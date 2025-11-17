import router from '@adonisjs/core/services/router';

const ProjectController = () => import('#app/projects/projects.controller');

router
  .group(() => {
    router.post('/create', [ProjectController, 'createProject']);
    router.put('/:id', [ProjectController, 'updateProject']);
    router.get('/business/:business_id', [ProjectController, 'getProjectsByBusinessId']);
    router.get('/:id', [ProjectController, 'getProject']);
    router.get('/', [ProjectController, 'getAllProjects']);
    router.delete('/:id', [ProjectController, 'deleteProject']);
  })
  .prefix('/projects');
