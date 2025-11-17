// import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';
const LeavesController = () => import('#app/leaves/leaves.controller');

router
  .group(() => {
    router.post('/apply', [LeavesController, 'applyLeaves']);
    router.get('/fetch/:employeeId', [LeavesController, 'getEmployeeLeaves']);
    router.put('/update/:id', [LeavesController, 'updateLeaves']);
    router.put('/update-status/:id', [LeavesController, 'updateLeavesStatus']);
    router.delete('/delete/:id', [LeavesController, 'delete']);
    router.get('/business/:businessId', [
      LeavesController,
      'getLeavesByBusinessId',
    ]);
  })
  .prefix('/leaves');
// .middleware([middleware.clerk()]);
