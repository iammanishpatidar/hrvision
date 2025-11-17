# Employee Invitation API Documentation

## Overview
Complete Employee Invitation system with all CRUD operations and advanced features based on the form fields provided.

## Database Fields
- **name**: Employee's full name
- **email**: Employee's email address (unique per business)
- **hire_date**: Date when employee will be hired
- **employment_status**: Full-Time, Part-Time, Contract, Intern
- **designation**: Job title/position (e.g., Software Engineer)
- **department_id**: Reference to department
- **pay_rate**: Salary/hourly rate amount
- **pay_rate_period**: Hour, Day, Week, Month, Year
- **schedule**: Work schedule details (optional)
- **business_id**: Reference to business
- **admin_id**: Reference to admin who created invitation
- **status**: INVITED, PENDING, ACCEPTED, EXPIRED
- **token**: Unique invitation token
- **expires_at**: Invitation expiry date

## API Endpoints

### 1. Create Employee Invitation
**POST** `/employee-invitation/invite`

**Request Body:**
```json
{
  "name": "John Mikel",
  "email": "johnmikel123@gmail.com",
  "hire_date": "2024-08-08",
  "employment_status": "Full-Time",
  "designation": "Software Engineer",
  "department_id": "123e4567-e89b-12d3-a456-426614174000",
  "pay_rate": 375000,
  "pay_rate_period": "Month",
  "schedule": "Monday to Friday, 9 AM to 5 PM",
  "business_id": "123e4567-e89b-12d3-a456-426614174000",
  "admin_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Employee invitation created successfully",
  "data": {
    "id": "uuid",
    "name": "John Mikel",
    "email": "johnmikel123@gmail.com",
    "status": "INVITED",
    "token": "generated_token",
    "expires_at": "2024-08-15T00:00:00.000Z"
  }
}
```

### 2. Get Employee Invitation by ID
**GET** `/employee-invitation/{id}`

**Response:**
```json
{
  "status": "success",
  "message": "Employee invitation retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Mikel",
    "email": "johnmikel123@gmail.com",
    "hire_date": "2024-08-08",
    "employment_status": "Full-Time",
    "designation": "Software Engineer",
    "pay_rate": 375000,
    "pay_rate_period": "Month",
    "schedule": "Monday to Friday, 9 AM to 5 PM",
    "status": "INVITED",
    "business": { /* business details */ },
    "admin": { /* admin details */ },
    "department": { /* department details */ }
  }
}
```

### 3. Update Employee Invitation
**PUT** `/employee-invitation/update/{id}`

**Request Body:**
```json
{
  "name": "John Mikel Updated",
  "employment_status": "Part-Time",
  "pay_rate": 200000,
  "status": "PENDING"
}
```

### 4. Delete Employee Invitation
**DELETE** `/employee-invitation/delete/{id}`

**Response:**
```json
{
  "status": "success",
  "message": "Employee invitation deleted successfully",
  "data": {}
}
```

### 5. Get Employee Invitations by Business
**GET** `/employee-invitation/business/{businessId}?page=1&limit=10`

**Response:**
```json
{
  "status": "success",
  "message": "Employee invitations retrieved successfully",
  "data": {
    "invitations": [
      { /* invitation details */ }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "last_page": 3,
      "has_pages": true,
      "has_more_pages": true
    }
  }
}
```

## Service Methods

### Core CRUD Operations
- `createEmployeeInvitation(data)` - Create new invitation with validation
- `getEmployeeInviationById(id)` - Get invitation with relationships
- `updateEmployeeInvitation(id, data)` - Update invitation details
- `deleteEmployeeInvitation(id)` - Delete invitation
- `getEmployeeInvitationsByBusiness(businessId, page, limit)` - Get paginated invitations

### Advanced Features
- `getInvitationsByStatus(businessId, status, page, limit)` - Filter by status
- `acceptInvitation(token)` - Accept invitation using token
- `expireInvitation(id)` - Manually expire invitation
- `resendInvitation(id)` - Resend with new token
- `getInvitationByToken(token)` - Get invitation by token
- `isInvitationValid(token)` - Check if token is valid
- `getPendingInvitations(businessId)` - Get all pending invitations
- `getInvitationStats(businessId)` - Get invitation statistics
- `expireOverdueInvitations()` - Bulk expire overdue invitations

## Validation Rules

### Required Fields
- name (max 255 chars)
- email (valid email format)
- hire_date (valid date)
- employment_status (enum: Full-Time, Part-Time, Contract, Intern)
- designation (max 255 chars)
- department_id (valid UUID)
- pay_rate (positive number)
- pay_rate_period (enum: Hour, Day, Week, Month, Year)
- business_id (valid UUID)
- admin_id (valid UUID)

### Optional Fields
- schedule (max 500 chars)

### Business Logic Validations
- Business must exist
- Department must exist
- Admin must exist
- No duplicate active invitations for same email in same business
- Invitation tokens are unique and expire in 7 days

## Status Flow
1. **INVITED** - Initial state when invitation is created
2. **PENDING** - Invitation viewed but not yet accepted
3. **ACCEPTED** - Invitation accepted by employee
4. **EXPIRED** - Invitation past expiry date or manually expired

## Error Handling
- 400: Validation errors
- 404: Resource not found
- 500: Internal server errors

All responses follow consistent format with status, message, and data fields.

## Features Implemented
✅ Complete CRUD operations
✅ Form field validation
✅ Business logic validation
✅ Relationship loading
✅ Pagination support
✅ Token-based invitation system
✅ Status management
✅ Expiry handling
✅ Statistics and reporting
✅ Bulk operations
✅ Error handling
✅ JSDoc documentation 