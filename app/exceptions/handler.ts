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

    // 🔌 Database connection errors
    if (error.code === 'ENETUNREACH' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      const isDatabaseError = error.message?.includes('5432') || 
                              error.message?.includes('postgres') ||
                              error.message?.includes('database');
      
      if (isDatabaseError) {
        return ctx.response.status(503).send({
          statusCode: 503,
          message: 'Database connection failed. Please check your database configuration.',
          error: app.inProduction 
            ? 'Database service unavailable' 
            : error.message,
          hint: app.inProduction 
            ? 'Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_DATABASE environment variables'
            : `Connection error: ${error.code}. Check if the database is running and accessible.`,
        });
      }
    }

    // 🔁 Default error fallback
    return super.handle(error, ctx);
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx);
  }
}
