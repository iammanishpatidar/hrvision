import {
  schema,
  rules,
  validator,
  ValidationException,
} from '@adonisjs/validator';
import Validator from '../common/validator.js';

class BusinessValidator extends Validator<'create' | 'update' | 'uploadLogo'> {
  private addressSchema = schema.object().members({
    line1: schema.string(),
    city: schema.string(),
    state: schema.string(),
    country: schema.string(),
    zipcode: schema.number(),
  });

  public schemas(type: 'create' | 'update' | 'uploadLogo') {
    switch (type) {
      case 'create':
        return schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          email: schema.string({}, [rules.email(), rules.maxLength(255)]),
          contact_number: schema.string({}, [rules.regex(/^\+?\d{10,15}$/)]),
          website: schema.string.optional({}, [rules.url()]),
          business_sector: schema.string({ trim: true }, [
            rules.maxLength(255),
          ]),
          address: this.addressSchema,
          admin: schema.object().members({
            clerk_id: schema.string(),
            email: schema.string({}, [rules.email()]),
            date_of_birth: schema.string({}, [
              rules.regex(/^\d{4}-\d{2}-\d{2}$/),
            ]),
            blood_group: schema.enum([
              'A+',
              'A-',
              'B+',
              'B-',
              'AB+',
              'AB-',
              'O+',
              'O-',
            ]),
            gender: schema.enum(['male', 'female', 'other']),
            current_address: this.addressSchema,
            permanent_address: this.addressSchema,
            emergency_contact: schema.object.optional().members({
              name: schema.string(),
              relationship: schema.string(),
              contact_number: schema.string({}, [
                rules.regex(/^\+?\d{10,15}$/),
              ]),
              address: this.addressSchema,
            }),
          }),
        });

      case 'update':
        return schema.create({
          name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
          email: schema.string.optional({}, [
            rules.email(),
            rules.maxLength(255),
          ]),
          contact_number: schema.string.optional({}, [
            rules.regex(/^\+?\d{10,15}$/),
          ]),
          website: schema.string.optional({}, [rules.url()]),
          business_sector: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          primary_color: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          secondary_color: schema.string.optional({ trim: true }, [
            rules.maxLength(255),
          ]),
          time_off_cycle_start_date: schema.date.optional({
            format: 'yyyy-MM-dd',
          }),
          time_off_cycle_end_date: schema.date.optional({
            format: 'yyyy-MM-dd',
          }),
        });

      case 'uploadLogo':
        return schema.create({
          logo: schema.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
          }),
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
      email: '{{ field }} must be a valid email address.',
      regex: '{{ field }} has invalid format.',
      maxLength:
        '{{ field }} must not exceed {{ options.maxLength }} characters.',
      enum: '{{ field }} must be a valid value.',
      url: '{{ field }} must be a valid URL.',
      uuid: '{{ field }} must be a valid UUID.',
      date: '{{ field }} must be a valid date (YYYY-MM-DD).',

      'address.zipcode.number': 'Zipcode must be a number.',
      'admin.current_address.zipcode.number': 'Zipcode must be a number.',
      'admin.permanent_address.zipcode.number': 'Zipcode must be a number.',
      'admin.emergency_contact.address.zipcode.number':
        'Zipcode must be a number.',
    };
  }

  public async fire(payload: any, type: 'create' | 'update' | 'uploadLogo') {
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

export default new BusinessValidator();
