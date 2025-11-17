import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';
import Employee from './employee.model.js';

class EmployeeValidator extends Validator<
  'create' | 'update' | 'get' | 'delete'
> {
  public schemas(type: string) {
    switch (type) {
      case 'get':
      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }),
        });

      case 'create':
        return schema.create({
          business_id: schema.string({}, [rules.uuid()]),
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          employee_id: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          email: schema.string({}, [rules.email(), rules.maxLength(255)]),
          contact_number: schema.string({}, [rules.regex(/^\+?\d{10,15}$/)]),
          permanent_address_id: schema.string.optional({}, [rules.uuid()]),
          current_address_id: schema.string.optional({}, [rules.uuid()]),
          marital_status: schema.enum([
            'single',
            'married',
            'divorced',
            'widowed',
          ]),
          gender: schema.enum(['male', 'female', 'non-binary', 'other']),
          date_of_birth: schema.date(),
          date_of_hire: schema.date(),
          designation_id: schema.string.optional({}, [rules.uuid()]),
          is_active: schema.boolean(),
          blood_group: schema.enum.optional([
            'A+',
            'A-',
            'B+',
            'B-',
            'O+',
            'O-',
            'AB+',
            'AB-',
          ]),
          manager_id: schema.string.optional({ trim: true }), // Clerk-style employee ID
          employment_type_id: schema.string.optional({}, [rules.uuid()]),
          department_id: schema.string.optional({}, [rules.uuid()]),
          document_id: schema.number.optional([rules.unsigned()]),
          emergency_contact_id: schema.number.optional([rules.unsigned()]),
          last_working_date: schema.date.optional(),
          role_id: schema.string.optional({}, [rules.uuid()]),
          location_id: schema.string.optional({}, [rules.uuid()]),
          employee_compensation_id: schema.number.optional([rules.unsigned()]),
        });

      case 'update':
        return schema.create({
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          employee_id: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          email: schema.string.optional({}, [
            rules.email(),
            rules.maxLength(255),
          ]),
          contact_number: schema.string.optional({}, [
            rules.regex(/^\+?\d{10,15}$/),
          ]),
          marital_status: schema.enum.optional([
            'single',
            'married',
            'divorced',
            'widowed',
          ]),
          gender: schema.enum.optional([
            'male',
            'female',
            'non-binary',
            'other',
          ]),
          date_of_birth: schema.date.optional(),
          date_of_hire: schema.date.optional(),
          blood_group: schema.enum.optional([
            'A+',
            'A-',
            'B+',
            'B-',
            'O+',
            'O-',
            'AB+',
            'AB-',
          ]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'id.required': 'Employee ID is required.',
      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      'name.required': 'Employee name is required.',
      'name.maxLength': 'Name must not exceed 255 characters.',

      'employee_id.maxLength': 'Employee ID must not exceed 255 characters.',

      'email.required': 'Email is required.',
      'email.email': 'Invalid email address.',
      'email.maxLength': 'Email must not exceed 255 characters.',

      'contact_number.required': 'Contact number is required.',
      'contact_number.regex': 'Contact number must be a valid phone number.',

      'marital_status.enum':
        'Marital status must be one of: single, married, divorced, widowed.',
      'gender.enum': 'Gender must be one of: male, female, non-binary, other.',
      'blood_group.enum': 'Invalid blood group.',
      'date_of_birth.date': 'Date of birth must be a valid date.',
      'date_of_hire.date': 'Date of hire must be a valid date.',
      'is_active.boolean': 'Is active must be a boolean value.',

      uuid: 'Must be a valid UUID.',
      unsigned: 'Must be a positive number.',
    };
  }

  public async fire(
    payload: Partial<Employee>,
    type: 'create' | 'update' | 'get' | 'delete'
  ) {
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
          id: schema.string({ trim: true }), // No UUID rule
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

export default new EmployeeValidator();
