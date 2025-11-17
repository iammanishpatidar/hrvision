import router from '@adonisjs/core/services/router';

const JobTitleController = () => import('#app/jobTitles/job_titles.controller');

router
  .group(() => {
    router.post('/create', [JobTitleController, 'createJobTitle']);
    router.get('/fetch/business/:business_id', [
      JobTitleController,
      'fetchJobTitles',
    ]);
    router.put('/update/:id', [JobTitleController, 'updateJobTitle']);
    router.delete('/delete/:id', [JobTitleController, 'deleteJobTitle']);
  })
  .prefix('/job-titles');
