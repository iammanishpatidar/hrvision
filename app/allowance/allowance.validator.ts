import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class AllowanceValidator extends Validator<'create' | 'update'> {
  /**
   * Validation schemas for 'create' and 'update'
   */
  public schemas(type: 'create' | 'update') {
    switch (type) {
      case 'create':
        return schema.create({
          allowance_type: schema.string({ trim: true }, [rules.maxLength(255)]),
          amount: schema.number([rules.unsigned()]),
          currency: schema.string({ trim: true }, [
            rules.maxLength(3),
            rules.alpha(),
          ]),
          is_recurring: schema.boolean(),
          status: schema.enum(['active', 'inactive']),
          business_id: schema.string({}, [rules.uuid()]),
        });

      case 'update':
        return schema.create({
          allowance_type: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          amount: schema.number.optional([rules.unsigned()]),
          currency: schema.string.optional({ trim: true }, [
            rules.maxLength(3),
            rules.alpha(),
          ]),
          is_recurring: schema.boolean.optional(),
          status: schema.enum.optional(['active', 'inactive']),
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
      'id.required': 'Allowance ID is required.',
      'id.uuid': 'Allowance ID must be a valid UUID.',

      'allowance_type.required': 'Allowance type is required.',
      'allowance_type.maxLength':
        'Allowance type must not exceed 255 characters.',

      'amount.required': 'Amount is required.',
      'amount.number': 'Amount must be a number.',
      'amount.unsigned': 'Amount must be a positive number.',

      'currency.required': 'Currency is required.',
      'currency.maxLength': 'Currency must not exceed 3 characters.',
      'currency.alpha': 'Currency must only contain letters.',

      'is_recurring.required': 'Recurring status is required.',
      'is_recurring.boolean': 'Recurring status must be true or false.',

      'status.required': 'Status is required.',
      'status.enum': 'Status must be either active or inactive.',

      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',
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

  // Validate `id` from request params
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

export default new AllowanceValidator();
