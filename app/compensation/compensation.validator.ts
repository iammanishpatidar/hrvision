import { schema, rules, validator, ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';
import { BaseRatePeriod, SalarySchedule } from './compensation.model.js';
import CustomError from '../../utilities/custom_error.js';
import Employee from '../employee/employee.model.js';

class CompensationValidator extends Validator<
  'create' | 'update' | 'get' | 'delete'
> {
  public schemas(type: 'create' | 'update' | 'get' | 'delete') {
    switch (type) {
      case 'get':
        return schema.create({
          id: schema.string({}, [rules.uuid()]),
        });

      case 'create':
        return schema.create({
          employee_id: schema.string({ trim: true }, [
            rules.minLength(1)
          ]),
          base_salary: schema.number([rules.unsigned()]),
          base_rate_period: schema.enum(Object.values(BaseRatePeriod)),
          salary_schedule: schema.enum(Object.values(SalarySchedule)),
          total_allowance: schema.number.optional([rules.unsigned()]),
          net_salary: schema.number.optional([rules.unsigned()]),
          currency: schema.string({ trim: true }, [
            rules.maxLength(3), 
            rules.minLength(3),
            rules.regex(/^[A-Z]{3}$/)
          ]),
        });

      case 'update':
        return schema.create({
          id: schema.string({}, [rules.uuid()]),
          base_salary: schema.number.optional([rules.unsigned()]),
          total_allowance: schema.number.optional([rules.unsigned()]),
          net_salary: schema.number.optional([rules.unsigned()]),
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
      number: '{{ field }} must be a number.',
      maxLength: '{{ field }} must not exceed {{ options.maxLength }} characters.',
      minLength: '{{ field }} must be at least {{ options.minLength }} characters.',
      enum: '{{ field }} must be a valid value.',
      uuid: '{{ field }} must be a valid UUID.',
      unsigned: '{{ field }} must be a positive number.',

      'employee_id.required': 'Employee ID is required.',
      'employee_id.minLength': 'Employee ID cannot be empty.',
      'base_salary.required': 'Base salary is required.',
      'base_salary.unsigned': 'Base salary must be a positive number.',
      'base_rate_period.required': 'Base rate period is required.',
      'base_rate_period.enum': 'Base rate period must be one of: MONTHLY, QUARTERLY, YEARLY.',
      'salary_schedule.required': 'Salary schedule is required.',
      'salary_schedule.enum': 'Salary schedule must be one of: "Start of every month", "End of every month".',
      'currency.required': 'Currency is required.',
      'total_allowance.unsigned': 'Total allowance must be a positive number.',
      'net_salary.unsigned': 'Net salary must be a positive number.',
      'currency.maxLength': 'Currency must be a 3-letter ISO currency code (e.g., USD, EUR, INR).',
      'currency.minLength': 'Currency must be a 3-letter ISO currency code (e.g., USD, EUR, INR).',
      'currency.regex': 'Currency must be a 3-letter ISO currency code (e.g., USD, EUR, INR).',
    }
  }

  public async fire(payload: any, type: 'create' | 'update' | 'get' | 'delete') {
    try {
      // Prevent updates to immutable fields
      if (type === 'update') {
        const immutableFields = ['employee_id', 'currency', 'base_rate_period', 'salary_schedule'];
        const attemptedImmutableUpdates = immutableFields.filter(field => payload.hasOwnProperty(field));
        
        if (attemptedImmutableUpdates.length > 0) {
          throw new CustomError(`Cannot update immutable fields: ${attemptedImmutableUpdates.join(', ')}. These fields cannot be modified after creation.`, 400);
        }
      }

      // Validate employee exists for create operations
      if (type === 'create' && payload.employee_id) {
        const employee = await Employee.find(payload.employee_id);
        if (!employee) {
          throw new CustomError('Employee not found. Please provide a valid employee ID.', 400);
        }
      }

      // Pre-process currency field if present
      if (payload.currency && typeof payload.currency === 'string') {
        const currencyNameToCode: { [key: string]: string } = {
          'dollars': 'USD', 'dollar': 'USD',
          'euros': 'EUR', 'euro': 'EUR',
          'rupees': 'INR', 'rupee': 'INR',
          'pounds': 'GBP', 'pound': 'GBP',
          'yen': 'JPY', 'yuan': 'CNY',
          'francs': 'CHF', 'franc': 'CHF',
          'canadian dollars': 'CAD', 'canadian dollar': 'CAD',
          'australian dollars': 'AUD', 'australian dollar': 'AUD'
        };
        
        const trimmedCurrency = payload.currency.trim();
        const lowerCurrency = trimmedCurrency.toLowerCase();
        
        if (currencyNameToCode[lowerCurrency]) {
          payload.currency = currencyNameToCode[lowerCurrency];
        } else if (trimmedCurrency.length === 3) {
          payload.currency = trimmedCurrency.toUpperCase();
        }
      }

      // Pre-process numeric fields
      ['base_salary', 'total_allowance', 'net_salary'].forEach(field => {
        if (payload[field] && typeof payload[field] === 'string') {
          const trimmedValue = payload[field].trim();
          if (trimmedValue !== '') {
            const numValue = parseFloat(trimmedValue);
            if (!isNaN(numValue)) {
              payload[field] = numValue;
            }
          }
        }
      });

      // Auto-calculate net_salary if not provided but base_salary is present
      if (payload.base_salary && !payload.net_salary) {
        const baseSalary = typeof payload.base_salary === 'number' ? payload.base_salary : parseFloat(payload.base_salary);
        const totalAllowance = payload.total_allowance ? 
          (typeof payload.total_allowance === 'number' ? payload.total_allowance : parseFloat(payload.total_allowance)) : 0;
        
        if (!isNaN(baseSalary)) {
          payload.net_salary = baseSalary + totalAllowance;
        }
      }
      
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      })
    } catch (error) {
      if (error instanceof ValidationException) {
        throw {
          statusCode: 400,
          message: error.messages,
          errors: error.messages,
        }
      }
      throw error
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
      })
    } catch (error) {
      if (error instanceof ValidationException) {
        throw {
          statusCode: 400,
          message: error.messages,
          errors: error.messages,
        }
      }
      throw error
    }
  }
}

export default new CompensationValidator();
