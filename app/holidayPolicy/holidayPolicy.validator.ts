import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class HolidayPolicyValidator extends Validator<'create' | 'update'> {
  public schemas(type: string) {
    switch (type) {
      case 'create':
        return schema.create({
          businessId: schema.string({}, [rules.uuid()]),
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          date: schema.date.optional(),
          isMandatory: schema.boolean(),
          type: schema.enum(['NATIONAL', 'REGIONAL', 'COMPANY', 'OPTIONAL']),
          region: schema.array().members(schema.string({ trim: true })),
          allowedEmployeeType: schema
            .array()
            .members(schema.string({ trim: true })),
        });

      case 'update':
        return schema.create({
          businessId: schema.string.optional({}, [rules.uuid()]),
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          date: schema.date.optional(),
          isMandatory: schema.boolean.optional(),
          type: schema.enum.optional([
            'NATIONAL',
            'REGIONAL',
            'COMPANY',
            'OPTIONAL',
          ]),
          region: schema.array
            .optional()
            .members(schema.string({ trim: true })),
          allowedEmployeeType: schema.array
            .optional()
            .members(schema.string({ trim: true })),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'businessId.required': 'Business ID is required.',
      'businessId.uuid': 'Business ID must be a valid UUID.',

      'name.required': 'Name is required.',
      'name.maxLength': 'Name must not exceed 255 characters.',

      'date.date': 'Date must be a valid date.',

      'isMandatory.required': 'Mandatory status is required.',
      'isMandatory.boolean': 'Mandatory status must be true or false.',

      'type.required': 'Type is required.',
      'type.enum':
        'Type must be either NATIONAL, REGIONAL, COMPANY or OPTIONAL.',

      'region.required': 'Region is required.',
      'region.array': 'Region must be an array of strings.',

      'allowedEmployeeType.required': 'Allowed employee type is required.',
      'allowedEmployeeType.array':
        'Allowed employee type must be an array of strings.',
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

export default new HolidayPolicyValidator();
