import router from "@adonisjs/core/services/router"
import CompensationController from "./compensation.controller.js"


router
  .group(() => {
    router.post('/', [CompensationController, 'create'])
    router.get('/employee/:employeeId', [CompensationController, 'fetchByEmployeeId'])
    router.get('/:id', [CompensationController, 'get'])
    router.put('/:id', [CompensationController, 'update'])
    router.delete('/:id', [CompensationController, 'delete'])
  })
  .prefix('/compensation')
