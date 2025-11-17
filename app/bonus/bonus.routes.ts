import router from '@adonisjs/core/services/router';

const BonusController = () => import('#app/bonus/bonus.controller');

router
  .group(() => {
    router.post('/create', [BonusController, 'createBonus']);
    router.patch('/update/:id', [BonusController, 'updateBonus']);
    router.get('/fetch/:id', [BonusController, 'fetchBonusById']);
    router.get('/fetch/all/:businessId', [
      BonusController,
      'fetchBonusesByBusinessId',
    ]);
    router.delete('/delete/:id', [BonusController, 'deleteBonus']);
  })
  .prefix('/bonus');
