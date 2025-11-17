import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class BonusValidator extends Validator<'create' | 'update'> {
  public schemas(type: string) {
    switch (type) {
      case 'create':
        return schema.create({
          bonus_type: schema.string({ trim: true }, [rules.maxLength(255)]),
          interval: schema.string({ trim: true }, [rules.maxLength(255)]),
          amount: schema.string({}, [rules.regex(/^\d+(\.\d{1,2})?$/)]),
          currency: schema.string({ trim: true }, [
            rules.maxLength(3),
            rules.alpha(),
          ]),
          business_id: schema.string({}, [rules.uuid()]),
        });

      case 'update':
        return schema.create({
          bonus_type: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          interval: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          amount: schema.string.optional({}, [
            rules.regex(/^\d+(\.\d{1,2})?$/),
          ]),
          currency: schema.string.optional({ trim: true }, [
            rules.maxLength(3),
            rules.alpha(),
          ]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'bonus_type.required': 'Bonus type is required.',
      'bonus_type.maxLength': 'Bonus type must not exceed 255 characters.',

      'interval.required': 'Interval is required.',
      'interval.maxLength': 'Interval must not exceed 255 characters.',

      'amount.required': 'Amount is required.',
      'amount.regex':
        'Amount must be a valid number with up to 2 decimal places.',

      'currency.required': 'Currency is required.',
      'currency.maxLength': 'Currency must not exceed 3 characters.',
      'currency.alpha': 'Currency must only contain letters.',

      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',
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

export default new BonusValidator();
