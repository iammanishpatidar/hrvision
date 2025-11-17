import { BasePolicy } from '@adonisjs/bouncer'
import { getUserRole } from '../../utilities/role_helper.js'

export default class AppPolicy extends BasePolicy {
    async before(user: { id: string }) {
        const role = await getUserRole(user.id)
        if (role === 'SUPER_ADMIN') {
            return true
        }
    }

    async manage(user: { id: string }) {
        const role = await getUserRole(user.id)
        return ['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(role || '')
    }

    async view(user: { id: string }) {
        const role = await getUserRole(user.id)
        return ['ADMIN', 'MANAGER', 'EMPLOYEE', 'SUPER_ADMIN'].includes(role || '')
    }
}

export const policies = {
    AppPolicy: () => import('#policies/main')
}
