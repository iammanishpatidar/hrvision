import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class LeaveTypesValidator extends Validator<
  'create' | 'update' | 'get' | 'delete' | 'fetch'
> {
  /**
   * Validation schemas for 'create', 'update', 'get', 'delete', and 'fetch'
   */
  public schemas(type: 'create' | 'update' | 'get' | 'delete' | 'fetch') {
    switch (type) {
      case 'create':
        return schema.create({
          name: schema.string({ trim: true }, [
            rules.minLength(3),
            rules.maxLength(50),
          ]),
          max_leaves: schema.number([rules.unsigned(), rules.range(1, 365)]),
          is_carry_forward_allowed: schema.boolean(),
          is_approval_required: schema.boolean(),
          allowed_genders: schema
            .array()
            .members(schema.enum(['MALE', 'FEMALE', 'OTHER'])),
          allowed_employee_type: schema
            .array()
            .members(schema.enum(['Full-time', 'Part-time', 'Interns'])),
          business_id: schema.string({}, [rules.uuid()]),
        });

      case 'update':
        return schema.create({
          name: schema.string.optional({ trim: true }, [
            rules.minLength(3),
            rules.maxLength(50),
          ]),
          max_leaves: schema.number.optional([
            rules.unsigned(),
            rules.range(1, 365),
          ]),
          is_carry_forward_allowed: schema.boolean.optional(),
          is_approval_required: schema.boolean.optional(),
          allowed_genders: schema.array
            .optional()
            .members(schema.enum(['MALE', 'FEMALE', 'OTHER'])),
          allowed_employee_type: schema.array
            .optional()
            .members(schema.enum(['Full-time', 'Part-time', 'Interns'])),
          business_id: schema.string.optional({}, [rules.uuid()]),
        });

      case 'get':
        return schema.create({
          id: schema.string.optional([rules.uuid()]),
        });

      case 'delete':
        return schema.create({
          id: schema.string([rules.uuid()]),
        });

      case 'fetch':
        return schema.create({
          business_id: schema.string({}, [rules.uuid()]),
          leave_type_id: schema.string.optional({}, [rules.uuid()]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  /**
   * Custom error messages for the validation rules
   */
  public messages() {
    return {
      'name.required': 'Name is required.',
      'name.minLength': 'Name must be at least 3 characters long.',
      'name.maxLength': 'Name must not exceed 50 characters.',

      'max_leaves.required': 'Max leaves is required.',
      'max_leaves.number': 'Max leaves must be a number.',
      'max_leaves.unsigned': 'Max leaves must be a positive number.',
      'max_leaves.range': 'Max leaves must be between 1 and 365.',

      'is_carry_forward_allowed.required': 'Carry forward status is required.',
      'is_carry_forward_allowed.boolean':
        'Carry forward status must be a boolean value.',

      'is_approval_required.required': 'Approval required status is required.',
      'is_approval_required.boolean':
        'Approval required status must be a boolean value.',

      'allowed_genders.required': 'Allowed genders are required.',
      'allowed_genders.enum':
        'Allowed genders must be one of MALE, FEMALE, or OTHER.',

      'allowed_employee_type.required': 'Allowed employee types are required.',
      'allowed_employee_type.enum':
        'Allowed employee types must be one of Full-time, Part-time, or Interns.',

      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      'id.required': 'Leave type ID is required.',
      'id.uuid': 'Leave type ID must be a valid UUID.',
    };
  }

  /**
   * Validate request body based on type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async fire(payload: any, type: 'create' | 'update' | 'get' | 'delete' | 'fetch') {
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
          id: schema.string([rules.uuid()]),
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

export default new LeaveTypesValidator();
