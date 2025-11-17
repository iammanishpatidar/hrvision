import { schema, rules, validator } from '@adonisjs/validator'
import { ValidationException } from '@adonisjs/validator'
import Validator from '../common/validator.js'

class DocumentFolderValidator extends Validator<'create' | 'get' | 'delete' | 'update'> {
  public schemas(type: string) {
    switch (type) {
      case 'get':
      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
        })

      case 'create':
        return schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          description: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
          category_id: schema.string({}, [rules.uuid()]),
        })

      case 'update':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]),
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          description: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
          category_id: schema.string.optional({}, [rules.uuid()]),
        })

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`)
    }
  }

  public messages() {
    return {
      'id.required': 'Folder ID is required.',
      'id.uuid': 'Folder ID must be a valid UUID.',

      'name.required': 'Folder name is required.',
      'name.maxLength': 'Folder name must not exceed 255 characters.',

      'description.maxLength': 'Description must not exceed 1000 characters.',

      'category_id.required': 'Category ID is required.',
      'category_id.uuid': 'Category ID must be a valid UUID.',
    }
  }

  public async fire(
    payload: Record<string, any>,
    type: 'create' | 'get' | 'delete' | 'update'
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

export default new DocumentFolderValidator()
