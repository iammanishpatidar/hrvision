import router from '@adonisjs/core/services/router';

const CompanyPolicyController = () => import('#app/policy/policy.controller');

router
  .group(() => {
    //router.delete('/:id', [CompanyPolicyController, 'deletecompanyPolicy'])
    router.put('/update/:id', [CompanyPolicyController, 'updateCompanyPolicy'])
    router.post('/create',[CompanyPolicyController,'createCompanyPolicy'])
    router.get('/fetch/:businessId', [CompanyPolicyController,'getPoliciesByBusiness'])
    router.get('/all', [CompanyPolicyController,'getAllPolicies'])
  })
  .prefix('/policy')
  