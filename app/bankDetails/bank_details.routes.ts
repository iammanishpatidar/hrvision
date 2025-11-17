import router from '@adonisjs/core/services/router';
const BankDetailController = () =>
  import('#app/bankDetails/bank_details.controller');
router
  .group(() => {
    router.post('/create', [BankDetailController, 'createBankDetail']);
    router.patch('/update/:id', [BankDetailController, 'updateBankDetail']);
    router.get('/fetch', [BankDetailController, 'fetchBankDetailByEmployeeId']);
    router.delete('/delete/:id', [BankDetailController, 'deleteBankDetail']);
  })
  .prefix('/bank-details');
