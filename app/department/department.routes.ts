import router from '@adonisjs/core/services/router';
const DepartmentController = () => import('./department.controller.js');

router
  .group(() => {
    router.get('/fetch/all', [DepartmentController, 'fetchAllDepartments']);
    router.get('/fetch/:id', [DepartmentController, 'fetchDepartment']);
  })
  .prefix('/department');
