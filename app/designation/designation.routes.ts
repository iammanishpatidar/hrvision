import router from '@adonisjs/core/services/router';

const DesignationController = () => import('#app/designation/designation.controller');

router
  .group(() => {
    router.get('/all', [DesignationController, 'getAllDesignations']);
    router.get('/:id', [DesignationController, 'getDesignationById']);
  })
  .prefix('/designations'); 