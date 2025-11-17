import {
  schema,
  rules,
  validator,
  ValidationException,
} from '@adonisjs/validator';
import Validator from '../common/validator.js';

class JobTitleValidator extends Validator<'create' | 'update' | 'fetch'> {
  public schemas(type: 'create' | 'update' | 'fetch') {
    switch (type) {
      case 'create':
        return schema.create({
          title: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.required(),
          ]),
          description: schema.string({ trim: true }, [
            rules.maxLength(1000),
            rules.required(),
          ]),
          business_id: schema.string({}, [rules.uuid(), rules.required()]),
        });

      case 'update':
        return schema.create({
          title: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          description: schema.string.optional({ trim: true }, [
            rules.maxLength(1000),
          ]),
        });

      case 'fetch':
        return schema.create({
          business_id: schema.string({}, [rules.uuid(), rules.required()]),
          job_title_id: schema.string.optional({}, [rules.uuid()]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      required: '{{ field }} is required.',
      string: '{{ field }} must be a string.',
      maxLength:
        '{{ field }} must not exceed {{ options.maxLength }} characters.',
      uuid: '{{ field }} must be a valid UUID.',
    };
  }

  public async fire(
    payload: Record<string, unknown>,
    type: 'create' | 'update' | 'fetch'
  ) {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        throw {
          statusCode: 400,
          message: error.messages,
          errors: error.messages,
        };
      }
      throw error;
    }
  }

  public async validateId(id: string) {
    try {
      await validator.validate({
        schema: schema.create({
          id: schema.string({}, [rules.uuid()]),
        }),
        data: { id },
        messages: this.messages(),
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        throw {
          statusCode: 400,
          message: error.messages,
          errors: error.messages,
        };
      }
      throw error;
    }
  }
}

export default new JobTitleValidator();
