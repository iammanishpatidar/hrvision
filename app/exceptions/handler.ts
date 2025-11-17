import app from '@adonisjs/core/services/app';
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http';

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction;

  async handle(error: any, ctx: HttpContext) {
    // ✅ Custom validation error with detailed messages
    if (
      error.status === 400 &&
      error.message === 'Validation failed' &&
      Array.isArray(error.errors)
    ) {
      return ctx.response.status(400).send({
        statusCode: 400,
        message: error.message,
        errors: error.errors,
      });
    }

    // 🔁 Default error fallback
    return super.handle(error, ctx);
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx);
  }
}
