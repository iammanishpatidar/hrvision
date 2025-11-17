import { schema, rules, validator } from '@adonisjs/validator'
import { ValidationException } from '@adonisjs/validator'
import Validator from '../common/validator.js' 

class CompanyPolicyValidator extends Validator<'create' | 'get' | 'delete'|'update'> {
  public schemas(type: string) {
    switch (type) {
      case 'get':
      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        })

      case 'create':
        return schema.create({
          policy_name: schema.string({ trim: true }, [rules.maxLength(255)]),
          description: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
          business_id: schema.string({}, [rules.uuid()]),
        })
        case 'update':
        return schema.create({
          policy_name: schema.string({ trim: true }, [rules.maxLength(255)]),
          description: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
          business_id: schema.string({}, [rules.uuid()]),
        })

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`)
    }
  }

  public messages() {
    return {
      'id.required': 'Policy ID is required.',
      'id.uuid': 'Policy ID must be a valid UUID.',

      'policy_name.required': 'Policy name is required.',
      'policy_name.maxLength': 'Policy name must not exceed 255 characters.',

      'description.maxLength': 'Description must not exceed 1000 characters.',

      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',
    }
  }

  public async fire(
    payload: Record<string, any>,
    type: 'create' | 'get' | 'delete'|'update'
  ) {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      })
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400
      }
      throw error
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
      })
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400
      }
      throw error
    }
  }
}

export default new CompanyPolicyValidator()
