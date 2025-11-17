import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';

export default class ContractValidator extends Validator<
  'create' | 'update' | 'get' | 'delete'
> {
    public schemas(type: string) {
        switch (type) {
            case 'get':
                return schema.create({
                    id: schema.string({ trim: true }),
                });

            case 'create':
                return schema.create({
                    employee_id: schema.string({ trim:true }, [rules.uuid()]),
                    contract_name: schema.string({ trim: true }, [rules.maxLength(255)]),
                    contract_type: schema.string({ trim: true }, [rules.maxLength(255)]),
                    start_date: schema.date(),
                    end_date: schema.date(),
                    is_active: schema.boolean.optional(),
                });

            case 'update':
                return schema.create({
                    employee_id: schema.string({ trim:true }, [rules.uuid()]),
                    id: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
                    contract_name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
                    contract_type: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
                    start_date: schema.date.optional(),
                    end_date: schema.date.optional(),
                });
            
            case 'delete':
                return schema.create({
                    id: schema.string({}, [rules.uuid()]),
                });

            default:
                throw new ValidationException(false);
        }
    }

    public messages() {
        return {
            'required': 'The {{ field }} is required.',
            'string': 'The {{ field }} must be a string.',
            'maxLength': 'The {{ field }} must not exceed {{ options.maxLength }} characters.',
            'date': 'The {{ field }} must be a valid date.',
            'trim': 'The {{ field }} must not contain leading or trailing spaces.',
        };
    }

    public async fire(payload: any, type: 'create' | 'update' | 'delete') {
        try {
        await validator.validate({
            schema: this.schemas(type),
            data: payload,
            messages: this.messages(),
        });
        } catch (error) {
        if (error instanceof ValidationException) {
            throw {
            statusCode: 400,
            message: error.messages,
            errors: error.messages,
            };
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
            throw {
            statusCode: 400,
            message: error.messages,
            errors: error.messages,
            };
        }
        throw error;
        }
    }
}

export const contractValidator = new ContractValidator();

