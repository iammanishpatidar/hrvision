import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

class LeavesValidator extends Validator<'create' | 'update' | 'get' | 'delete' | 'fetch' | 'bulk_create' | 'update_status'> {
  /**
   * Validation schemas for 'create', 'update', 'get', 'delete', 'fetch', 'bulk_create', and 'update_status'
   */
  public schemas(type: 'create' | 'update' | 'get' | 'delete' | 'fetch' | 'bulk_create' | 'update_status') {
    switch (type) {
      case 'create':
        return schema.create({
          employee_id: schema.string({}, [rules.maxLength(255)]),
          leave_type_id: schema.string({}, [rules.uuid()]),
          date: schema.date(),
          is_half_day: schema.boolean(),
          business_id: schema.string({}, [rules.uuid()]),
          reason: schema.string.optional({}, [rules.maxLength(500)]),
          status: schema.enum.optional(['PENDING', 'APPROVED', 'REJECT']),
        });

      case 'bulk_create':
        return schema.create({
          '*': schema.object().members({
            employee_id: schema.string({}, [rules.maxLength(255)]),
            leave_type_id: schema.string({}, [rules.uuid()]),
            date: schema.date(),
            is_half_day: schema.boolean(),
            reason: schema.string.optional({}, [rules.maxLength(500)]),
            status: schema.enum.optional(['PENDING', 'APPROVED', 'REJECT']),
          }),
        });

      case 'update':
        return schema.create({
          id: schema.string([rules.uuid()]),
          leave_type_id: schema.string.optional({}, [rules.uuid()]),
          date: schema.date.optional(),
          is_half_day: schema.boolean.optional(),
          reason: schema.string.optional({}, [rules.maxLength(500)]),
        });

      case 'update_status':
        return schema.create({
          id: schema.string([rules.uuid()]),
          status: schema.enum(['PENDING', 'APPROVED', 'REJECT']),
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
          employee_id: schema.string.optional({}, [rules.maxLength(255)]),
          leave_type_id: schema.string.optional({}, [rules.uuid()]),
          id: schema.string.optional({}, [rules.uuid()]),
          status: schema.enum.optional(['PENDING', 'APPROVED', 'REJECT']),
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
      'employee_id.required': 'Employee ID is required.',
      'employee_id.maxLength': 'Employee ID must not exceed 255 characters.',
      
      'leave_type_id.required': 'Leave Type ID is required.',
      'leave_type_id.uuid': 'Leave Type ID must be a valid UUID.',
      
      'date.required': 'Date is required.',
      'date.date': 'Date must be a valid date.',
      
      'is_half_day.required': 'Half day status is required.',
      'is_half_day.boolean': 'Half day status must be a boolean value.',
      
      'reason.maxLength': 'Reason must not exceed 500 characters.',
      
      'status.enum': 'Status must be one of: PENDING, APPROVED, REJECT.',
      'status.required': 'Status is required.',
      
      'id.required': 'Leave ID is required.',
      'id.uuid': 'Leave ID must be a valid UUID.',
    };
  }

  /**
   * Validate request body based on type
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async fire(payload: any, type: 'create' | 'update' | 'get' | 'delete' | 'fetch' | 'bulk_create' | 'update_status') {
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
   * Validate array or single object for bulk operations
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async validateBulkOrSingle(payload: any) {
    try {
      if (Array.isArray(payload)) {
        // For arrays, validate each item individually
        for (const item of payload) {
          await validator.validate({
            schema: this.schemas('create'),
            data: item,
            messages: this.messages(),
          });
        }
      } else {
        // For single objects, validate normally
        await validator.validate({
          schema: this.schemas('create'),
          data: payload,
          messages: this.messages(),
        });
      }
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

export default new LeavesValidator();
