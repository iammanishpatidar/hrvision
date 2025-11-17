import router from '@adonisjs/core/services/router';

const AllowanceController = () => import('#app/allowance/allowance.controller');

router
  .group(() => {
    router.post('/create', [AllowanceController, 'createAllowance']);
    router.patch('/update/:id', [AllowanceController, 'updateAllowance']);
    router.get('/fetch/:id', [AllowanceController, 'fetchAllowanceById']);
    router.get('/fetch/all/:businessId', [
      AllowanceController,
      'fetchAllowanceByBusinessId',
    ]);
    router.delete('/delete/:id', [AllowanceController, 'deleteAllowance']);
  })
  .prefix('/allowance');
