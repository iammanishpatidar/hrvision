import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';
const EmployeeInvitationController = () =>
  import('./employee_invitation.controller.js');

router
  .group(() => {
    // Create invitation (requires authentication)
    router.post('/invite', [EmployeeInvitationController, 'invite']);
  })
  .prefix('/employee-invitation')
  .middleware(middleware.bouncer());

// Public routes for invitation processing (no authentication required)
router
  .group(() => {
    // Validate invitation token
    router.post('/validate-token', [EmployeeInvitationController, 'validateToken']);
    
    // Get invitation details
    router.post('/details', [EmployeeInvitationController, 'getDetails']);
  })
  .prefix('/employee-invitation');

router
  .group(() => {
    // Respond to invitation (Accept or Reject)
    router.post('/respond', [EmployeeInvitationController, 'respondToInvitation']);
  })
  .prefix('/employee-invitation');
