import { HttpContext } from '@adonisjs/core/http';
import sanitizeHtml from 'sanitize-html';

export default class SanitizePayload {
  public async handle({ request }: HttpContext, next: () => Promise<void>) {
    const body = request.all();
    const sanitize = (value: any): any => {
      if (typeof value === 'string') {
        return sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
      } else if (Array.isArray(value)) {
        return value.map((item) => sanitize(item));
      } else if (typeof value === 'object' && value !== null) {
        return Object.entries(value).reduce(
          (acc, [key, val]) => {
            acc[key] = sanitize(val);
            return acc;
          },
          {} as Record<string, any>
        );
      }

      return value;
    };

    const sanitized = sanitize(body);
    request.updateBody(sanitized);

    await next();
  }
}
