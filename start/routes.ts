import '../app/business/business.routes.js'
import '../app/employee/employee.routes.js'
import '../app/contract/contract.routes.js'
import '../app/leaveTypes/leave_types.routes.js'
import '../app/holidayPolicy/holidayPolicy.routes.js'
import '../app/invitation/employee_invitation.routes.js'
import '../app/leaves/leaves.routes.js'
import '../app/compensation/compensation.routes.js'
import '../app/address/address.routes.js'
import '../app/emergencyContacts/emergency_contacts.routes.js'
import '../app/bonus/bonus.routes.js'
import '../app/allowance/allowance.routes.js'
import '../app/bankDetails/bank_details.routes.js'
import '../app/reimbursement/reimbursements.route.js'
import '../app/workingdays/working_days.routes.js'
import '../app/compensation/compensation.routes.js'
import '../app/jobTitles/job_titles.routes.js'
import '../app/policy/policy.routes.js'
import '../app/projects/projects.routes.js'
import '../app/category/category.routes.js'
import '../app/assets/assets.routes.js'
import '../app/swagger/swagger.routes.js'
import '../app/department/department.routes.js'

import '../app/documentFolder/documentFolder.routes.js'

import '../app/role/role.routes.js'
import '../app/designation/designation.routes.js'
import '../app/timeTracking/timeTracking.routes.js'
import '../app/assets/asset_request/asset_request.routes.js'
import '../app/calendar/calendar.routes.js'

import router from '@adonisjs/core/services/router'
import { commonRequestErrorHandler } from '../utilities/error_handler.js';
import { genericResponse } from '../utilities/response_handler.js';

// Root route - health check and API info
router.get('/', async ({ request, response }) => {
  return genericResponse({
    request,
    response,
    data: {
      name: 'HRMS Backend API',
      version: '1.0.0',
      status: 'running',
      documentation: '/api/docs',
      swagger: '/api/swagger.json',
    },
    message: 'HRMS Backend API is running',
  });
});

// Health check endpoint
router.get('/health', async ({ response }) => {
  return response.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route for unmatched endpoints
router.any('*', async ({ request, response }) => {
  commonRequestErrorHandler({ request, response }, 'Invalid endPoint', 404);
});