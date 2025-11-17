import router from '@adonisjs/core/services/router';

const DocumentFolderController = () => import('#app/documentFolder/documentFolder.controller');

router
  .group(() => {
    router.post('/create',[DocumentFolderController,'create'])
  })
  .prefix('/document')
  