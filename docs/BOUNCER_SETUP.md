# Bouncer Authorization Setup Guide

## 🎯 Overview

This guide explains how to implement and use the custom Bouncer authorization system in the HRMS backend. The system uses role-based permissions where the frontend sends a user ID, and the backend checks the user's role to determine what actions they can perform.

**Key Features:**
- **Selective Authorization**: Only apply Bouncer to routes that need authorization
- **Lazy User ID Extraction**: User ID is only extracted when authorization is actually needed
- **Flexible User ID Sources**: Supports headers, query parameters, and request body
- **Role-Based Access Control**: Different permissions for different user roles

## 📁 File Structure

```
app/
├── abilities/main.ts                    # Define what users can do
├── policies/main.ts                     # Define resource-specific rules
├── middleware/initialize_bouncer_middleware.ts  # Handle user ID extraction
└── utilities/role_helper.js             # Role checking logic

start/
└── kernel.ts                           # Middleware registration
```

## 🚀 Quick Start for New Developers

### Step 1: Understand the Flow

1. **Frontend sends user ID** (employee UUID) in request header, query, or body
2. **Middleware initializes Bouncer** without requiring user ID immediately
3. **Controller calls authorization** when needed (`bouncer.authorize()`)
4. **Bouncer extracts user ID** and checks user's role from database
5. **If authorized** → proceed, **if not** → return 403 error

### Step 2: Add Authorization to a Controller

**Before (no authorization):**
```typescript
async getAllEmployees({ request, response }: HttpContext) {
  const employees = await this.employeeService.getAllEmployees();
  return response.json(employees);
}
```

**After (with authorization):**
```typescript
import { view } from '#abilities/main'

async getAllEmployees({ request, response, bouncer }: HttpContext) {
  try {
    await bouncer.authorize(view); // Add this line
    const employees = await this.employeeService.getAllEmployees();
    return response.json(employees);
  } catch (error) {
    if (error.message === 'User ID is required for authorization') {
      return response.unauthorized({ message: 'User ID is required' });
    }
    if (error.code === 'E_AUTHORIZATION_FAILED') {
      return response.forbidden({ message: 'Not authorized' });
    }
    throw error;
  }
}
```

### Step 3: Add Middleware to Routes

**Before:**
```typescript
router.get('/employees', [EmployeeController, 'getAllEmployees'])
```

**After:**
```typescript
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/employees', [EmployeeController, 'getAllEmployees'])
  })
  .prefix('/employees')
  .middleware([middleware.bouncer()])
```

## 🔐 Role Hierarchy

| Role | Can View | Can Manage | Can Delete | Can Update Others |
|------|----------|------------|------------|-------------------|
| **SUPER_ADMIN** | ✅ All | ✅ All | ✅ All | ✅ All |
| **ADMIN** | ✅ All | ✅ All | ✅ All | ✅ All |
| **MANAGER** | ✅ All | ✅ All | ❌ | ✅ All |
| **EMPLOYEE** | ✅ All | ❌ | ❌ | ❌ (only self) |

## 📝 How to Add Authorization to New Endpoints

### 1. Import Required Abilities

Add to your controller:
```typescript
import { view, manage, deleteResource } from '#abilities/main'
```

### 2. Add Authorization Check

Choose the right ability based on what the endpoint does:

- **View data**: `await bouncer.authorize(view)`
- **Manage resources**: `await bouncer.authorize(manage)`
- **Delete resources**: `await bouncer.authorize(deleteResource)`
- **Update specific item**: `await bouncer.authorize(updateEmployee, item)`

### 3. Add Error Handling

```typescript
try {
  await bouncer.authorize(view);
  // Your logic here
} catch (error) {
  if (error.message === 'User ID is required for authorization') {
    return response.unauthorized({ message: 'User ID is required' });
  }
  if (error.code === 'E_AUTHORIZATION_FAILED') {
    return response.forbidden({ message: 'Not authorized' });
  }
  throw error;
}
```

### 4. Add Middleware to Route

```typescript
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/your-endpoint', [YourController, 'method'])
  })
  .prefix('/your-prefix')
  .middleware([middleware.bouncer()])
```

## 🔧 Frontend Integration

### How to Send User ID

The frontend must include the employee UUID in every request. Choose one method:

**Option 1: Header (Recommended)**
```javascript
headers: {
  'X-User-ID': 'employee-uuid-here'
}
```

**Option 2: Query Parameter**
```javascript
fetch('/api/employees?userId=employee-uuid-here')
```

**Option 3: Request Body**
```javascript
body: JSON.stringify({
  userId: 'employee-uuid-here',
  // other data...
})
```

## 🧪 Testing Your Authorization

### Test with curl

**Valid request:**
```bash
curl -X GET "http://localhost:3333/employees" \
  -H "X-User-ID: valid-employee-uuid"
```

**Missing user ID:**
```bash
curl -X GET "http://localhost:3333/employees"
# Should return: 401 "User ID is required"
```

**Unauthorized user:**
```bash
curl -X GET "http://localhost:3333/employees" \
  -H "X-User-ID: unauthorized-employee-uuid"
# Should return: 403 "Not authorized"
```

## 🐛 Common Issues & Solutions

### Issue 1: "User ID is required"
**Cause:** Frontend not sending user ID
**Solution:** Add user ID to request header, query, or body

### Issue 2: "You are not authorized"
**Cause:** User doesn't have the required role
**Solution:** Check user's role in database or assign appropriate role

### Issue 3: TypeScript errors with middleware
**Cause:** Wrong middleware syntax
**Solution:** Use the correct syntax:
```typescript
import { middleware } from '#start/kernel'
.middleware([middleware.bouncer()])
```

### Issue 4: Middleware not working
**Cause:** Middleware not registered or applied
**Solution:** 
1. Check `start/kernel.ts` has bouncer middleware registered:
```typescript
export const middleware = router.named({
  bouncer: () => import('../app/middleware/initialize_bouncer_middleware.js'),
});
```
2. Check route has `.middleware([middleware.bouncer()])` applied

### Issue 5: Authorization not triggering
**Cause:** Controller not calling `bouncer.authorize()`
**Solution:** Ensure you're calling the authorization method in your controller

## 📋 Checklist for New Endpoints

- [ ] Import required abilities (`view`, `manage`, etc.)
- [ ] Add `bouncer` parameter to controller method
- [ ] Add `await bouncer.authorize(ability)` before your logic
- [ ] Add error handling for authorization failures
- [ ] Import middleware from `#start/kernel`
- [ ] Add `middleware.bouncer()` to route group
- [ ] Test with different user roles
- [ ] Test with missing user ID

## 🔍 Debugging Tips

### 1. Add Debug Logs to Middleware
```typescript
console.log('🔍 Bouncer middleware is being called!')
console.log('🔍 Request URL:', ctx.request.url())
console.log('🔍 Headers:', ctx.request.headers())
```

### 2. Add Debug Logs to Controller
```typescript
console.log('🔍 Controller method called!')
console.log('🔍 About to call bouncer.authorize(view)')
console.log('🔍 Bouncer authorization passed!')
```

### 3. Check User ID Extraction
Add this to middleware temporarily:
```typescript
const userId = ctx.request.header('X-User-ID') || 
               ctx.request.qs().userId || 
               ctx.request.body().userId
console.log('🔍 User ID found:', userId)
```

### 4. Check Role Assignment
Add this to abilities temporarily:
```typescript
const role = await getUserRole(user.id)
console.log('User role:', role)
```

### 5. Test with Known Data
Use a valid employee UUID from your database for testing.

## 🛡️ Security Best Practices

1. **Always validate user ID** - Ensure it's a valid UUID
2. **Use HTTPS** in production
3. **Log authorization attempts** for audit trails
4. **Regular role reviews** - Check who has what permissions
5. **Test with different roles** - Ensure proper access control
6. **Handle errors gracefully** - Don't expose internal details
7. **Apply middleware selectively** - Only on routes that need authorization

## 🔄 Migration Guide

### From No Authorization to Bouncer

1. **Add middleware to existing routes** using `middleware.bouncer()`
2. **Update controllers** to include authorization checks
3. **Update frontend** to send user ID
4. **Test thoroughly** with different user roles
5. **Monitor logs** for authorization failures

### Adding New Roles

1. **Update role hierarchy** in abilities
2. **Add role to database** if needed
3. **Update documentation** with new permissions
4. **Test with new role** to ensure proper access

### Selective Authorization Strategy

**Apply Bouncer only to protected routes:**
```typescript
// Public routes (no middleware)
router.get('/public-data', [Controller, 'getPublicData'])

// Protected routes (with middleware)
router
  .group(() => {
    router.get('/private-data', [Controller, 'getPrivateData'])
  })
  .middleware([middleware.bouncer()])
```

## 📚 Advanced Usage

### Custom Abilities
```typescript
// In abilities/main.ts
export const customAbility = Bouncer.ability('custom-action', async (user) => {
  const role = await getUserRole(user.id)
  return role === 'ADMIN' || role === 'MANAGER'
})
```

### Resource-Specific Policies
```typescript
// In policies/main.ts
export const employeePolicy = {
  update: async (user, employee) => {
    const role = await getUserRole(user.id)
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true
    if (role === 'EMPLOYEE' && user.id === employee.id) return true
    return false
  }
}
```

### Conditional Authorization
```typescript
// In controller
if (someCondition) {
  await bouncer.authorize(manage)
} else {
  await bouncer.authorize(view)
}
```
