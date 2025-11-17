import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';
import Assets from './assets.model.js';

class AssetsValidator extends Validator<'create' | 'update' | 'fetch' | 'delete' | 'getAssetTypes'> {
  public schemas(type: string) {
    switch (type) {
      case 'fetch':
        return schema.create({
          business_id: schema.string.optional({ trim: true }, [rules.uuid()]),
          id: schema.string.optional({ trim: true }, [rules.uuid()]),
          category_id: schema.string.optional({ trim: true }, [rules.uuid()]),
          page: schema.number.optional([rules.range(1, 1000)]),
          limit: schema.number.optional([rules.range(1, 100)]),
        });

      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        });

      case 'getAssetTypes':
        return schema.create({
          category_id: schema.string({ trim: true }, [rules.uuid()]),
        });

      case 'create':
        return schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          serial_number: schema.string({ trim: true }, [rules.maxLength(255)]),
          business_id: schema.string({ trim: true }, [rules.uuid()]),
          category_id: schema.string({ trim: true }, [rules.uuid()]),
          asset_type: schema.string({ trim: true }, [rules.maxLength(255)]),
          assigned_date: schema.date.optional({ format: 'yyyy-MM-dd' }),
          current_status: schema.enum(['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'DISPOSED']),
          condition: schema.enum(['GOOD', 'BAD', 'REPAIR', 'REPLACEMENT']),
          warranty_expiry: schema.date({ format: 'yyyy-MM-dd' }),
          license_type: schema.string({ trim: true }, [rules.maxLength(255)]),
        });

      case 'update':
        return schema.create({
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          serial_number: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          business_id: schema.string({ trim: true }, [rules.uuid()]),
          category_id: schema.string({ trim: true }, [rules.uuid()]),
          assigned_date: schema.date.optional({ format: 'yyyy-MM-dd' }),
          current_status: schema.enum.optional(['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'DISPOSED']),
          condition: schema.enum.optional(['GOOD', 'BAD', 'REPAIR', 'REPLACEMENT']),
          warranty_expiry: schema.date.optional({ format: 'yyyy-MM-dd' }),
          license_type: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'id.required': 'Asset ID is required.',
      'id.uuid': 'Asset ID must be a valid UUID.',

      'name.required': 'Asset name is required.',
      'name.maxLength': 'Asset name must not exceed 255 characters.',

      'serial_number.required': 'Serial number is required.',
      'serial_number.maxLength': 'Serial number must not exceed 255 characters.',

      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      // Category ID validation
      'category_id.required': 'Category ID is required.',
      'category_id.uuid': 'Category ID must be a valid UUID.',

      // Assigned date validation (optional)
      'assigned_date.date': 'Assigned date must be a valid date in YYYY-MM-DD format.',
      'assigned_date.format': 'Assigned date must be in YYYY-MM-DD format.',

      // Current status validation
      'current_status.required': 'Current status is required.',
      'current_status.enum': 'Current status must be one of: AVAILABLE, ASSIGNED, MAINTENANCE, DISPOSED.',

      // Condition validation
      'condition.required': 'Condition is required.',
      'condition.enum': 'Condition must be one of: GOOD, BAD, REPAIR, REPLACEMENT.',

      // Warranty expiry validation
      'warranty_expiry.required': 'Warranty expiry date is required.',
      'warranty_expiry.date': 'Warranty expiry date must be a valid date in YYYY-MM-DD format.',
      'warranty_expiry.format': 'Warranty expiry date must be in YYYY-MM-DD format.',

      // License type validation
      'license_type.required': 'License type is required.',
      'license_type.maxLength': 'License type must not exceed 255 characters.',

      // Pagination validation
      'page.number': 'Page must be a number.',
      'page.range': 'Page must be between 1 and 1000.',
      'limit.number': 'Limit must be a number.',
      'limit.range': 'Limit must be between 1 and 100.',

      // General validation
      'uuid': 'Must be a valid UUID.',
      'required': '{{ field }} is required.',
      'string': '{{ field }} must be a string.',
      'maxLength': '{{ field }} must not exceed {{ options.maxLength }} characters.',
      'enum': '{{ field }} must be one of the allowed values.',
    };
  }

  public async fire(payload: Assets | any, type: 'create' | 'update' | 'fetch' | 'delete' | 'getAssetTypes') {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      });

      if (type === 'create' || type === 'update') {
        await this.validateDateLogic(payload as Assets);
      }

      if (type === 'fetch') {
        await this.validateFetchLogic(payload);
      }

      if (type === 'getAssetTypes') {
        await this.validateGetAssetTypesLogic(payload);
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400;
      }
      throw error;
    }
  }

  private async validateDateLogic(payload: Assets) {
    if (payload.assigned_date && payload.warranty_expiry) {
      const assignedDate = new Date(payload.assigned_date.toString());
      const warrantyExpiryDate = new Date(payload.warranty_expiry.toString());

      if (warrantyExpiryDate <= assignedDate) {
        throw {
          statusCode: 400,
          message: 'Warranty expiry date must be after assigned date.',
          errors: {
            warranty_expiry: ['Warranty expiry date must be after assigned date.']
          }
        };
      }
    }

    if (payload.assigned_date) {
      const assignedDate = new Date(payload.assigned_date.toString());
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (assignedDate > today) {
        throw {
          statusCode: 400,
          message: 'Assigned date cannot be in the future.',
          errors: {
            assigned_date: ['Assigned date cannot be in the future.']
          }
        };
      }
    }
  }

  private async validateFetchLogic(payload: any) {
    if (payload.id) {
      if (!payload.business_id) {
        throw {
          statusCode: 400,
          message: 'Business ID is required even when fetching by asset ID.',
          errors: {
            business_id: ['Business ID is required for security validation.']
          }
        };
      }
    } else {
      if (!payload.business_id) {
        throw {
          statusCode: 400,
          message: 'Business ID is required for asset queries.',
          errors: {
            business_id: ['Business ID is required for asset queries.']
          }
        };
      }
    }

    if (payload.page && payload.limit) {
      const page = parseInt(payload.page);
      const limit = parseInt(payload.limit);

      if (page < 1) {
        throw {
          statusCode: 400,
          message: 'Page number must be at least 1.',
          errors: {
            page: ['Page number must be at least 1.']
          }
        };
      }

      if (limit < 1 || limit > 100) {
        throw {
          statusCode: 400,
          message: 'Limit must be between 1 and 100.',
          errors: {
            limit: ['Limit must be between 1 and 100.']
          }
        };
      }
    }
  }

  private async validateGetAssetTypesLogic(payload: any) {
    if (!payload.category_id) {
      throw {
        statusCode: 400,
        message: 'Category ID is required to fetch asset types.',
        errors: {
          category_id: ['Category ID is required to fetch asset types.']
        }
      };
    }
  }

  public async validateId(id: string) {
    try {
      await validator.validate({
        schema: schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
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

export default new AssetsValidator();   