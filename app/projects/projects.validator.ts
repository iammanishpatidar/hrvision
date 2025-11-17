import {
  schema,
  rules,
  validator,
  ValidationException,
} from '@adonisjs/validator';
import Validator from '../common/validator.js';
import CustomError from '../../utilities/custom_error.js';

class ProjectValidator extends Validator<'create' | 'update' | 'get' | 'getAll' | 'getByBusinessId' | 'delete'> {
  public schemas(type: 'create' | 'update' | 'get' | 'getAll' | 'getByBusinessId' | 'delete') {
    switch (type) {
      case 'create':
        return schema.create({
          project_name: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.required(),
          ]),
          description: schema.string.optional({ trim: true }, [
            rules.maxLength(1000),
          ]),
          business_id: schema.string({}, [rules.uuid(), rules.required()]),
          status: schema.enum.optional(['ACTIVE', 'INACTIVE']),
        });

      case 'update':
        return schema.create({
          id: schema.string({}, [rules.uuid()]),
          project_name: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
            rules.minLength(1),
          ]),
          description: schema.string.optional({ trim: true }, [
            rules.maxLength(1000),
            rules.minLength(1),
          ]),
          status: schema.enum.optional(['ACTIVE', 'INACTIVE']),
          business_id: schema.string.optional({}, [rules.uuid()]),
        });

      case 'get':
        return schema.create({
          id: schema.string({}, [rules.uuid()]),
        });

      case 'getAll':
        return schema.create({});

      case 'getByBusinessId':
        return schema.create({
          business_id: schema.string({}, [rules.uuid(), rules.required()]),
        });

      case 'delete':
        return schema.create({
          id: schema.string({}, [rules.uuid()]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      required: '{{ field }} is required.',
      string: '{{ field }} must be a string.',
      maxLength:
        '{{ field }} must not exceed {{ options.maxLength }} characters.',
      minLength:
        '{{ field }} must be at least {{ options.minLength }} characters.',
      uuid: '{{ field }} must be a valid UUID.',
      enum: '{{ field }} must be a valid value.',
      
      'project_name.required': 'Project name is required.',
      'project_name.maxLength': 'Project name must not exceed 255 characters.',
      'project_name.minLength': 'Project name cannot be empty.',
      'description.maxLength': 'Description must not exceed 1000 characters.',
      'description.minLength': 'Description cannot be empty.',
      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',
      'status.enum': 'Status must be either ACTIVE or INACTIVE.',
      'id.uuid': 'Project ID must be a valid UUID.',
    };
  }

  public async fire(
    payload: Record<string, unknown>,
    type: 'create' | 'update' | 'get' | 'getAll' | 'getByBusinessId' | 'delete'
  ) {
    try {
      // Prevent updates to immutable fields
      if (type === 'update') {
        const immutableFields = ['business_id'];
        const attemptedImmutableUpdates = immutableFields.filter(field => payload.hasOwnProperty(field));
        
        if (attemptedImmutableUpdates.length > 0) {
          throw new CustomError(`Cannot update immutable fields: ${attemptedImmutableUpdates.join(', ')}. These fields cannot be modified after creation.`, 400);
        }

        // Check for empty strings and throw validation errors
        const emptyStringFields: string[] = [];
        Object.keys(payload).forEach(key => {
          if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
            emptyStringFields.push(key);
          }
        });

        if (emptyStringFields.length > 0) {
          const fieldNames = emptyStringFields.map(field => field.replace(/_/g, ' ')).join(', ');
          throw new CustomError(`${fieldNames} cannot be empty.`, 400);
        }
      }

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

export default new ProjectValidator();
