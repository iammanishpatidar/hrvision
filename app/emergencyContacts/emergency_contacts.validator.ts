import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class EmergencyContactValidator extends Validator<'create' | 'update'> {
  /**
   * Validation schemas for 'create' and 'update'
   */
  public schemas(type: 'create' | 'update') {
    switch (type) {
      case 'create':
        return schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          relationship: schema.string({ trim: true }, [rules.maxLength(100)]),
          contact_number: schema.string({ trim: true }, [
            rules.mobile({ locale: ['en-IN'] }),
          ]),
        });

      case 'update':
        return schema.create({
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          relationship: schema.string.optional({ trim: true }, [
            rules.maxLength(100),
          ]),
          contact_number: schema.string.optional({ trim: true }, [
            rules.mobile({ locale: ['en-IN'] }),
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
      'id.required': 'Emergency Contact ID is required.',
      'id.uuid': 'Emergency Contact ID must be a valid UUID.',

      'name.required': 'Name is required.',
      'name.maxLength': 'Name must not exceed 255 characters.',

      'relationship.required': 'Relationship is required.',
      'relationship.maxLength': 'Relationship must not exceed 100 characters.',

      'contact_number.required': 'Contact number is required.',
      'contact_number.mobile': 'Contact number must be a valid mobile number.',

      'address_id.uuid': 'Address ID must be a valid UUID.',

      'employee_id.required': 'Employee ID is required.',
      'employee_id.uuid': 'Employee ID must be a valid UUID.',
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
   * Validate `id` from request params
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

export default new EmergencyContactValidator();
