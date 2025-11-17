import router from '@adonisjs/core/services/router'

const AssetRequestController = () => import('#app/assets/asset_request/asset_request.controller')

router.group(() => {
    router.post('/create', [AssetRequestController, 'createAssetRequest'])
    router.post('/fetch', [AssetRequestController, 'getAssetRequests'])

    router.put('/:id', [AssetRequestController, 'updateAssetRequest'])
    router.delete('/:id', [AssetRequestController, 'deleteAssetRequest'])
    router.post('/:id/approve', [AssetRequestController, 'approveAssetRequest'])
    router.post('/:id/reject', [AssetRequestController, 'rejectAssetRequest'])
}).prefix('/asset-requests')