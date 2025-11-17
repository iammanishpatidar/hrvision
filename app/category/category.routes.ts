import router from '@adonisjs/core/services/router'

const CategoryController = () => import('#app/category/category.controller')

router
    .group(() => {
        router.get('/fetch', [CategoryController, 'fetch'])
    })
    .prefix('categories')