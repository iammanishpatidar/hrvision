import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class RoleValidator extends Validator<'get'> {
  public schemas(type: string) {
    switch (type) {
      case 'get':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'id.required': 'Role ID is required.',
      'id.uuid': 'Role ID must be a valid UUID.',
    };
  }

  public async fire(payload: Record<string, any>, type: 'get') {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400;
      }
      throw error;
    }
  }

  public async validateId(id: string) {
    try {
      await validator.validate({
        schema: schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        }),
        data: { id },
        messages: this.messages(),
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400;
      }
      throw error;
    }
  }
}

export default new RoleValidator(); 