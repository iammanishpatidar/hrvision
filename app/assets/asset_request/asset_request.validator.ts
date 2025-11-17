import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../../common/validator.js';
import AssetRequest from './asset_request.model.js';

class AssetRequestValidator extends Validator<'create' | 'update' | 'fetch' | 'delete' | 'approve' | 'reject'> {
  public schemas(type: string) {
    switch (type) {
      case 'fetch':
        return schema.create({
          business_id: schema.string.optional({ trim: true }, [rules.uuid()]),
          id: schema.string.optional({ trim: true }, [rules.uuid()]),
          employee_id: schema.string.optional({ trim: true }),
          category_id: schema.string.optional({ trim: true }, [rules.uuid()]),
          status: schema.enum.optional(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
          page: schema.number.optional([rules.range(1, 1000)]),
          limit: schema.number.optional([rules.range(1, 100)]),
        });

      case 'get':
      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        });

      case 'create':
        return schema.create({
          category_id: schema.string({ trim: true }, [rules.uuid()]),
          asset_types: schema.array().members(schema.string({ trim: true }, [rules.maxLength(100)])),
          employee_id: schema.string({ trim: true }),
          comments: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
        });

      case 'update':
        return schema.create({
          employee_id: schema.string.optional({ trim: true }),
          business_id: schema.string.optional({ trim: true }, [rules.uuid()]),
          asset_type: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
          category_id: schema.string.optional({ trim: true }, [rules.uuid()]),
          status: schema.enum.optional(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
          approved_by: schema.string.optional({ trim: true }),
          approved_at: schema.date.optional(),
          comments: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
        });

      case 'approve':
      case 'reject':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
          approved_by: schema.string({ trim: true }),
          comments: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'id.required': 'Asset request ID is required.',
      'id.uuid': 'Asset request ID must be a valid UUID.',

      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      'employee_id.required': 'Employee ID is required.',
      'employee_id.uuid': 'Employee ID must be a valid UUID.',

      'asset_type.required': 'Asset type is required.',
      'asset_type.maxLength': 'Asset type must not exceed 100 characters.',

      'category_id.required': 'Category ID is required.',
      'category_id.uuid': 'Category ID must be a valid UUID.',

      'comments.maxLength': 'Comments must not exceed 1000 characters.',

      'approved_by.required': 'Approver ID is required.',

      'page.number': 'Page must be a number.',
      'page.range': 'Page must be between 1 and 1000.',
      'limit.number': 'Limit must be a number.',
      'limit.range': 'Limit must be between 1 and 100.',

      'uuid': 'Must be a valid UUID.',
    };
  }

  public async fire(payload: Partial<AssetRequest> | any, type: 'create' | 'update' | 'fetch' | 'delete' | 'approve' | 'reject') {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      });

      if (type === 'fetch') {
        await this.validateFetchLogic(payload);
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400;
      }
      throw error;
    }
  }

  private async validateFetchLogic(payload: any) {
    const hasSearchCriteria = payload.id || payload.employee_id || payload.business_id || payload.category_id || payload.status;

    if (!hasSearchCriteria) {
      throw {
        statusCode: 400,
        message: 'At least one search criteria is required: id, employee_id, business_id, category_id, or status.',
        errors: {
          search_criteria: ['At least one search criteria is required: id, employee_id, business_id, category_id, or status.']
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

export default new AssetRequestValidator();   