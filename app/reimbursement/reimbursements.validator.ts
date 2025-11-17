import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class ReimbursementValidator extends Validator<'create' | 'update'> {
  public schemas(type: string) {
    switch (type) {
      case 'create':
        return schema.create({
          employee_id: schema.string({}, [rules.uuid()]),
          status: schema.enum(['pending', 'approved', 'rejected']),
          amount: schema.number([rules.range(0.01, 1000000)]),
          description: schema.string({ trim: true }, [rules.maxLength(1000)]),
          date: schema.date(),
        });

      case 'update':
        return schema.create({
          employee_id: schema.string.optional({}, [rules.uuid()]),
          amount: schema.number.optional([rules.range(0.01, 1000000)]),
          description: schema.string.optional({ trim: true }, [
            rules.maxLength(1000),
          ]),
          date: schema.date.optional(),
        });

      case 'updateStatus':
        return schema.create({
          status: schema.enum(['pending', 'approved', 'rejected']),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      'employee_id.required': 'Employee ID is required.',
      'employee_id.uuid': 'Employee ID must be a valid UUID.',

      'status.required': 'Status is required.',
      'status.enum': 'Status must be one of: pending, approved, rejected.',

      'amount.required': 'Amount is required.',
      'amount.range':
        'Amount must be a positive number and less than 1 million.',

      'description.required': 'Description is required.',
      'description.maxLength': 'Description must not exceed 1000 characters.',

      'date.required': 'Date is required.',
      'date.date': 'Date must be a valid date.',
    };
  }

  public async fire(payload: any, type: 'create' | 'update' | 'updateStatus') {
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
}

export default new ReimbursementValidator();
