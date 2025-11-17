import router from '@adonisjs/core/services/router';

const HolidayPolicyController = () =>
  import('#app/holidayPolicy/holidayPolicy.controller');

router
  .group(() => {
    router.post('/create', [HolidayPolicyController, 'create']);
    router.put('/update/:id', [HolidayPolicyController, 'update']);
    router.delete('/delete/:id', [
      HolidayPolicyController,
      'deleteHolidayById',
    ]);
    router.get('/fetch/:businessId', [
      HolidayPolicyController,
      'fetchHolidays',
    ]);
  })
  .prefix('/holidays');
