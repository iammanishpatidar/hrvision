import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class BankDetailValidator extends Validator<'create' | 'update'> {
  public schemas(type: string) {
    switch (type) {
      case 'create':
        return schema.create({
          account_number: schema.number([
            rules.range(1000000000, 999999999999),
          ]),
          bank_name: schema.string({ trim: true }, [rules.maxLength(255)]),
          branch: schema.string({ trim: true }, [rules.maxLength(255)]),
          ifsc_code: schema.string({ trim: true }, [
            rules.regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
          ]),
          swift_code: schema.string.optional({ trim: true }, [
            rules.maxLength(11),
          ]),
          account_holder_name: schema.string({ trim: true }, [
            rules.maxLength(255),
          ]),
          passbook: schema.string.optional({ trim: true }),
          employee_id: schema.string({}, [rules.uuid()]),
        });

      case 'update':
        return schema.create({
          account_number: schema.number.optional([
            rules.range(1000000000, 999999999999),
          ]),
          bank_name: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          branch: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          ifsc_code: schema.string.optional({ trim: true }, [
            rules.regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
          ]),
          swift_code: schema.string.optional({ trim: true }, [
            rules.maxLength(11),
          ]),
          account_holder_name: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          passbook: schema.string.optional({ trim: true }),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'account_number.required': 'Account number is required.',
      'account_number.range': 'Account number must be between 10 to 12 digits.',

      'bank_name.required': 'Bank name is required.',
      'bank_name.maxLength': 'Bank name must not exceed 255 characters.',

      'branch.required': 'Branch is required.',
      'branch.maxLength': 'Branch must not exceed 255 characters.',

      'ifsc_code.required': 'IFSC code is required.',
      'ifsc_code.regex':
        'IFSC code must be a valid format (e.g., SBIN0001234).',

      'swift_code.maxLength': 'SWIFT code must not exceed 11 characters.',

      'account_holder_name.required': 'Account holder name is required.',
      'account_holder_name.maxLength':
        'Account holder name must not exceed 255 characters.',

      'employee_id.required': 'Employee ID is required.',
      'employee_id.uuid': 'Employee ID must be a valid UUID.',
    };
  }

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
}

export default new BankDetailValidator();
