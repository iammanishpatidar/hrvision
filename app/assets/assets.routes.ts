import router from '@adonisjs/core/services/router'

const AssetsController = () => import('#app/assets/assets.controller')

router
    .group(() => {
        router.post('/create', [AssetsController, 'createAssets'])
        router.post('/fetch', [AssetsController, 'getAssets'])
        router.patch('/update/:id', [AssetsController, 'updateAssets'])
        router.delete('/delete/:id', [AssetsController, 'deleteAssets'])
        router.get('/asset-types/:category_id', [AssetsController, 'getAssetTypes'])
    })
    .prefix('/assets');