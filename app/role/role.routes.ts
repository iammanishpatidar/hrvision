import router from '@adonisjs/core/services/router';

const RoleController = () => import('#app/role/role.controller');

router
  .group(() => {
    router.get('/all', [RoleController, 'getAllRoles']);
    router.get('/:id', [RoleController, 'getRoleById']);
  })
  .prefix('/roles'); 