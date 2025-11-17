import router from '@adonisjs/core/services/router';
const LeaveTypesController = () =>
  import('#app/leaveTypes/leave_types.controller');

router
  .group(() => {
    router.post('/create', [LeaveTypesController, 'createLeaveTypes']);
    router.get('/fetch/business/:business_id', [
      LeaveTypesController,
      'fetchLeaveTypes',
    ]);
    router.put('/update/:id', [LeaveTypesController, 'updateLeaveTypes']);
    router.delete('/delete/:id', [LeaveTypesController, 'deleteLeaveTypes']);
  })
  .prefix('/leave-types');
