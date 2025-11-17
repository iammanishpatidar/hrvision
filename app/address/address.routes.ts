import router from '@adonisjs/core/services/router';

const AddressController = () => import('./address.controller.js');

router
  .group(() => {
    router.put('/update/:id', [AddressController, 'updateAddress']);
    router.get('/fetch/:id', [AddressController, 'fetchAddress']);
  })
  .prefix('/address');
