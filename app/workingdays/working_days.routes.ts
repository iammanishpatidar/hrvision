import router from '@adonisjs/core/services/router';

const WorkingDaysController = () =>
  import('#app/workingdays/working_days.controller');

router
  .group(() => {
    router.get('/fetch/all', [WorkingDaysController, 'findAllDays']);
    router.get('/fetch/:id', [WorkingDaysController, 'findDayById']);
    router.get('/fetch/business/:id', [
      WorkingDaysController,
      'findByBusinessId',
    ]);
    router.post('/mapping', [
      WorkingDaysController,
      'createBusinessAndWorkingDaysMappings',
    ]);
  })
  .prefix('/working-days');
