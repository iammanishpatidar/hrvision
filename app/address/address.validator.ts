import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class AddressValidator extends Validator<'create' | 'update' | 'get'> {
  /**
   * Validation schemas for 'create', 'update', and 'get'
   */
  public schemas(type: 'create' | 'update' | 'get') {
    switch (type) {
      case 'get':
        return schema.create({
          id: schema.string({}, [rules.uuid()]),
          line1: schema.string({ trim: true }),
          line2: schema.string.optional({ trim: true }),
          city: schema.string.optional({ trim: true }),
          state: schema.string.optional({ trim: true }),
          zipcode: schema.number(),
          country: schema.string.optional({ trim: true }),
        });

      case 'create':
        return schema.create({
          line1: schema.string({ trim: true }),
          line2: schema.string.optional({ trim: true }),
          city: schema.string({ trim: true }),
          state: schema.string({ trim: true }),
          zipcode: schema.number(),
          country: schema.string({ trim: true }),
        });

      case 'update':
        return schema.create({
          line1: schema.string.optional({ trim: true }),
          line2: schema.string.optional({ trim: true }),
          city: schema.string.optional({ trim: true }),
          state: schema.string.optional({ trim: true }),
          zipcode: schema.number.optional(),
          country: schema.string.optional({ trim: true }),
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
      'id.required': 'Address ID is required.',
      'id.uuid': 'Address ID must be a valid UUID.',

      'line1.required': 'Line 1 is required.',
      'line1.string': 'Line 1 must be a string.',

      'line2.string': 'Line 2 must be a string.',

      'city.required': 'City is required.',
      'city.string': 'City must be a string.',

      'state.required': 'State is required.',
      'state.string': 'State must be a string.',

      'zipcode.required': 'Zipcode is required.',
      'zipcode.number': 'Zipcode must be a number.',

      'country.required': 'Country is required.',
      'country.string': 'Country must be a string.',
    };
  }

  /**
   * Validate payload based on schema type
   */
  public async fire(payload: any, type: 'create' | 'update' | 'get') {
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
   * Validate ID separately
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

export default new AddressValidator();
