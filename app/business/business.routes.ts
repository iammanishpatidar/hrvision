// import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';

const BusinessController = () => import('#app/business/business.controller');

router
  .group(() => {
    router.post('/register', [BusinessController, 'register']);
    router.get('/fetch', [BusinessController, 'fetchBusiness']);
    router.delete('/delete/:id', [BusinessController, 'deleteBusinessById']);
    router.put('/update/:id', [BusinessController, 'updateBusiness']);
    router.put('/upload-logo/:id', [BusinessController, 'uploadBusinessLogo']);
  })
  .prefix('/business');
