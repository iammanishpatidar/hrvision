import { ParsedTypedSchema } from '@adonisjs/validator/types';
import { validator } from '@adonisjs/validator';

export default abstract class Validator<
  ValidationCases extends string = string,
> {
  /**
   * Object for schemas.
   * Each key in object will correspong to a type of validation.
   * Each values will be a valid Adonis schema, made using schema.create
   */
  protected abstract schemas(type: ValidationCases): ParsedTypedSchema<any>;

  /**
   * Object of error message objects used to pass custom error messages.
   * Each key will correspond to a valid validation type defined in schemas
   */
  protected errorMessages: {
    [k: string]: {
      [k: string]: string;
    };
  } = {};

  /**
   * Cache key, to be used if validator schema caching is needed.
   * Refer https://preview.adonisjs.com/guides/validator/schema-caching
   */
  protected cacheKey: string | undefined;

  public async fire(
    data: { [key: string]: any },
    type: ValidationCases
  ): Promise<unknown> {
    return validator.validate({
      schema: this.schemas(type),
      data,
      ...(this.errorMessages[type]
        ? { messages: this.errorMessages[type] }
        : {}),
      ...(this.cacheKey ? { cacheKey: this.cacheKey } : {}),
    });
  }
}
