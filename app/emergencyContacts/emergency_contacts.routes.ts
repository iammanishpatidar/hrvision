import router from '@adonisjs/core/services/router';

const EmergencyContactController = () =>
  import('./emergency_contacts.controller.js');

router
  .group(() => {
    router.patch('/update/:id', [
      EmergencyContactController,
      'updateEmergencyContact',
    ]);
    router.get('/fetch/:id', [
      EmergencyContactController,
      'fetchEmergencyContact',
    ]);
  })
  .prefix('/emergencyContact');
