import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class BusinessWorkingDaysMappingValidator extends Validator<'create'> {
  public schemas(type: string) {
    switch (type) {
      case 'create':
        return schema.create({
          business_id: schema.string({}, [rules.uuid()]),
          working_days_id: schema.string({}, [rules.uuid()]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      'working_days_id.required': 'Working Day ID is required.',
      'working_days_id.uuid': 'Working Day ID must be a valid UUID.',
    };
  }

  public async fire(payload: any, type: 'create') {
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

export default new BusinessWorkingDaysMappingValidator();
