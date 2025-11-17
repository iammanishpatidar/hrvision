import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const EmployeeController = () => import('#app/employee/employee.controller');

router
  .group(() => {
    router.delete('/:id', [EmployeeController, 'deleteEmployeeByID'])
    router.put('/update/:id', [EmployeeController, 'updateEmployee'])
    router.get('/fetch/:id', [EmployeeController, 'fetchEmployee'])
    router.get('/business', [EmployeeController,'fetchEmployeesByBusiness'])

    router.get('/all', [EmployeeController, 'getAllEmployees'])
  })
  .prefix('/employee')
  .middleware([middleware.bouncer()]); 