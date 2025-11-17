import router from '@adonisjs/core/services/router';

const ContractController = () => import('#app/contract/contract.controller');

router
  .group(() => {
    router.post('/create', [ContractController, 'createContract']);
    router.get('/business/:businessId', [ContractController, 'fetchContractsByBusiness']);
    router.get('/fetch/:id', [ContractController, 'fetchContractById']);
    router.put('/update/:id', [ContractController, 'updateContract']);
    router.delete('/:id', [ContractController, 'deleteContract']);
  })
  .prefix('/contract');