import router from '@adonisjs/core/services/router';

const ReimbursementController = () =>
  import('#app/reimbursement/reimbursements.controller');

router
  .group(() => {
    router.post('/create', [ReimbursementController, 'createReimbursement']);
    router.patch('/update/:id', [
      ReimbursementController,
      'updateReimbursement',
    ]);
    router.patch('/update/status/:id', [
      ReimbursementController,
      'updateReimbursement',
    ]);
    router.get('/fetch/:id', [
      ReimbursementController,
      'fetchReimbursementById',
    ]);
    router.get('/employee/:employeeId', [
      ReimbursementController,
      'fetchReimbursementsByEmployeeId',
    ]);
    // router.get('/fetch/all/:businessId', [ReimbursementController, 'fetchReimbursementsByBusinessId'])
    router.delete('/delete/:id', [
      ReimbursementController,
      'deleteReimbursement',
    ]);
  })
  .prefix('/reimbursement');
