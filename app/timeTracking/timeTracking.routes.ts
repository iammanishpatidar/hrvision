import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/create', '#app/timeTracking/timeTracking.controller.create')
    router.get('/all', '#app/timeTracking/timeTracking.controller.getAllTasks')
    router.get('/employee', '#app/timeTracking/timeTracking.controller.invalidEmployeeEndpoint')
    router.get('/employee/:id', '#app/timeTracking/timeTracking.controller.getByEmployeeId')
    router.patch('/update/:id', '#app/timeTracking/timeTracking.controller.updateTask')
    router.patch('/stop/:id', '#app/timeTracking/timeTracking.controller.stopTask')
    router.get('/:id', '#app/timeTracking/timeTracking.controller.getById')
  })
  .prefix('/time-tracking')
  .middleware([middleware.bouncer()]);
