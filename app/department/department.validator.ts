import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class DepartmentValidator extends Validator<'create' | 'update'> {
  public schemas(type: 'create' | 'update') {
    switch (type) {
      case 'create':
        return schema.create({
          department: schema.string({ trim: true }, [rules.maxLength(255)]),
        });

      case 'update':
        return schema.create({
          department: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  /**
   * Custom error messages
   */
  public messages() {
    return {
      'id.required': 'Department ID is required.',
      'id.uuid': 'Department ID must be a valid UUID.',

      'department.required': 'Department name is required.',
      'department.maxLength': 'Department name must not exceed 255 characters.',
    };
  }

  /**
   * Validate request body based on type
   */
  public async fire(payload: any, type: 'create' | 'update') {
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

  /**
   * Validate `id` from request query
   */
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
        error.status = 400;
      }
      throw error;
    }
  }
}

export default new DepartmentValidator();
