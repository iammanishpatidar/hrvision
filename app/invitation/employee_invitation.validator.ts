import {
  schema,
  rules,
  validator,
  ValidationException,
} from '@adonisjs/validator';
import Validator from '../common/validator.js';

class EmployeeInvitationValidator extends Validator<'create' | 'update' | 'get' | 'delete' | 'post'> {
  public schemas(type: 'create' | 'update' | 'get' | 'delete' | 'post') {
    switch (type) {
      case 'create':
        return schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          email: schema.string({}, [rules.email(), rules.maxLength(255)]),
          hire_date: schema.date(),
          employment_status: schema.enum(['Full-Time', 'Part-Time', 'Contract', 'Intern']),
          designation_id: schema.string({}, [rules.uuid()]),
          department_id: schema.string({}, [rules.uuid()]),
          pay_rate: schema.number([rules.unsigned()]),
          pay_rate_period: schema.enum(['Hour', 'Day', 'Week', 'Month', 'Year']),
          business_id: schema.string({}, [rules.uuid()]),
          admin_id: schema.string({}, [rules.uuid()]),
          role_id: schema.string({}, [rules.uuid()]),
        });

      case 'update':
        return schema.create({
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          email: schema.string.optional({}, [rules.email(), rules.maxLength(255)]),
          hire_date: schema.date.optional(),
          employment_status: schema.enum.optional(['Full-Time', 'Part-Time', 'Contract', 'Intern']),
          designation: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          department_id: schema.string.optional({}, [rules.uuid()]),
          pay_rate: schema.number.optional([rules.unsigned()]),
          pay_rate_period: schema.enum.optional(['Hour', 'Day', 'Week', 'Month', 'Year']),
          schedule: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
          status: schema.enum.optional(['INVITED', 'PENDING', 'ACCEPTED', 'EXPIRED']),
        });

      case 'get':
      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        });

      case 'post':
        return schema.create({
          email: schema.string({ trim: true }),
          business_id: schema.string({ trim: true }),
          role_id: schema.string({ trim: true }),
          expires_at: schema.string.optional({ trim: true }),
          action: schema.enum.optional(['accept', 'reject']),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'name.required': 'Employee name is required.',
      'name.maxLength': 'Name must not exceed 255 characters.',
      
      'email.required': 'Email address is required.',
      'email.email': 'Invalid email address format.',
      'email.maxLength': 'Email must not exceed 255 characters.',
      
      'hire_date.required': 'Hire date is required.',
      'hire_date.date': 'Hire date must be a valid date.',
      
      'employment_status.required': 'Employment status is required.',
      'employment_status.enum': 'Employment status must be one of: Full-Time, Part-Time, Contract, Intern.',
      
      'designation.required': 'Designation is required.',
      'designation.maxLength': 'Designation must not exceed 255 characters.',
      
      'department_id.required': 'Department is required.',
      'department_id.uuid': 'Department ID must be a valid UUID.',
      
      'pay_rate.required': 'Pay rate is required.',
      'pay_rate.unsigned': 'Pay rate must be a positive number.',
      
      'pay_rate_period.required': 'Pay rate period is required.',
      'pay_rate_period.enum': 'Pay rate period must be one of: Hour, Day, Week, Month, Year.',
      
      'schedule.maxLength': 'Schedule must not exceed 500 characters.',
      
      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',
      
      'admin_id.required': 'Admin ID is required.',
      'admin_id.uuid': 'Admin ID must be a valid UUID.',
      
      'id.required': 'Invitation ID is required.',
      'id.uuid': 'Invitation ID must be a valid UUID.',
      
      'status.enum': 'Status must be one of: INVITED, PENDING, ACCEPTED, EXPIRED, REJECTED',
      'action.required': 'Action is required.',
      'action.enum': 'Action must be either "accept" or "reject".'
    };
  }

  public async fire(payload: any, type: 'create' | 'update' | 'get' | 'delete' | 'post') {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new Error('Validation failed');
    }
  }

  public async validateId(id: string) {
    try {
      await validator.validate({
        schema: schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        }),
        data: { id },
        messages: {
          'id.required': 'ID is required',
          'id.uuid': 'ID must be a valid UUID',
        },
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new Error('ID validation failed');
    }
  }
}

export default new EmployeeInvitationValidator(); 