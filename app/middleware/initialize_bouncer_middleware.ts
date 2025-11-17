import { policies } from '#policies/main'
import { abilities } from '#abilities/main'

import { Bouncer } from '@adonisjs/bouncer'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import CustomError from '../../utilities/custom_error.js'

export default class InitializeBouncerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    ctx.bouncer = new Bouncer(
      () => {
        const userId = ctx.request.header('X-User-ID') ||
          ctx.request.qs().userId ||
          ctx.request.body().userId
        // const userId = '9d2e2c8a-8ae4-4ee8-9f93-384c263d1f50'

        if (!userId) {
          throw new CustomError('User ID is required for authorization', 401)
        }

        return { id: userId }
      },
      abilities,
      policies
    ).setContainerResolver(ctx.containerResolver)

    if ('view' in ctx) {
      ; (ctx.view as any).share(ctx.bouncer.edgeHelpers)
    }
    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    bouncer: Bouncer<
      { id: string },
      typeof abilities,
      typeof policies
    >
  }
}