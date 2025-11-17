import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';
import CustomError from '../../utilities/custom_error.js';

class CalendarEventValidator extends Validator<'create' | 'update' | 'get' | 'delete' | 'fetch' | 'bulk_create'> {
 
  public schemas(type: 'create' | 'update' | 'get' | 'delete' | 'fetch' | 'bulk_create') {
    switch (type) {
      case 'create':
        return schema.create({
          business_id: schema.string({}, [rules.uuid(), rules.required()]),
          title: schema.string({ trim: true }, [
            rules.required(),
            rules.minLength(1),
            rules.maxLength(255)
          ]),
          description: schema.string.optional({ trim: true }, [
            rules.maxLength(1000)
          ]),
          event_type: schema.enum(['birthday', 'holiday', 'leave', 'meeting', 'custom'], [
            rules.required()
          ]),
          employee_id: schema.string.optional({}, [rules.uuid()]),
          holiday_id: schema.string.optional({}, [rules.uuid()]),
          leave_id: schema.string.optional({}, [rules.uuid()]),
          status: schema.enum.optional(['active', 'cancelled', 'completed']),
          metadata: schema.object.optional().members({
            color: schema.string.optional({}, [rules.maxLength(7)]),
            priority: schema.enum.optional(['low', 'medium', 'high']),
            location: schema.string.optional({}, [rules.maxLength(255)]),
            meeting_url: schema.string.optional({}, [rules.url()]),
            attendees: schema.array.optional().members(schema.string()),
            notes: schema.string.optional({}, [rules.maxLength(500)]),
            tags: schema.array.optional().members(schema.string()),
          })
        });

      case 'update':
        return schema.create({
          id: schema.string({}, [rules.uuid(), rules.required()]),
          title: schema.string.optional({ trim: true }, [
            rules.minLength(1),
            rules.maxLength(255)
          ]),
          description: schema.string.optional({ trim: true }, [
            rules.maxLength(1000)
          ]),
          event_type: schema.enum.optional(['birthday', 'holiday', 'leave', 'meeting', 'custom']),
          employee_id: schema.string.optional({}, [rules.uuid()]),
          holiday_id: schema.string.optional({}, [rules.uuid()]),
          leave_id: schema.string.optional({}, [rules.uuid()]),
          status: schema.enum.optional(['active', 'cancelled', 'completed']),
          metadata: schema.object.optional().members({
            color: schema.string.optional({}, [rules.maxLength(7)]),
            priority: schema.enum.optional(['low', 'medium', 'high']),
            location: schema.string.optional({}, [rules.maxLength(255)]),
            meeting_url: schema.string.optional({}, [rules.url()]),
            attendees: schema.array.optional().members(schema.string()),
            notes: schema.string.optional({}, [rules.maxLength(500)]),
            tags: schema.array.optional().members(schema.string()),
          })
        });

      case 'bulk_create':
        return schema.create({
          '*': schema.object().members({
            business_id: schema.string({}, [rules.uuid(), rules.required()]),
            title: schema.string({ trim: true }, [
              rules.required(),
              rules.minLength(1),
              rules.maxLength(255)
            ]),
            description: schema.string.optional({ trim: true }, [
              rules.maxLength(1000)
            ]),
            event_type: schema.enum(['birthday', 'holiday', 'leave', 'meeting', 'custom'], [
              rules.required()
            ]),
            date: schema.date.optional(),
            employee_id: schema.string.optional({}, [rules.uuid()]),
            holiday_id: schema.string.optional({}, [rules.uuid()]),
            leave_id: schema.string.optional({}, [rules.uuid()]),
            status: schema.enum.optional(['active', 'cancelled', 'completed']),
            metadata: schema.object.optional().members({
              color: schema.string.optional({}, [rules.maxLength(7)]),
              priority: schema.enum.optional(['low', 'medium', 'high']),
              location: schema.string.optional({}, [rules.maxLength(255)]),
              meeting_url: schema.string.optional({}, [rules.url()]),
              attendees: schema.array.optional().members(schema.string()),
              notes: schema.string.optional({}, [rules.maxLength(500)]),
              tags: schema.array.optional().members(schema.string()),
            })
          })
        });

      case 'get':
        return schema.create({
          id: schema.string({}, [rules.uuid(), rules.required()])
        });

      case 'delete':
        return schema.create({
          id: schema.string({}, [rules.uuid(), rules.required()]),
          hard_delete: schema.boolean.optional()
        });

      case 'fetch':
        return schema.create({
          business_id: schema.string.optional({}, [rules.uuid()]),
          event_type: schema.enum.optional(['birthday', 'holiday', 'leave', 'meeting', 'custom']),
          employee_id: schema.string.optional({}, [rules.uuid()]),
          status: schema.enum.optional(['active', 'cancelled', 'completed']),
          start_date: schema.date.optional(),
          end_date: schema.date.optional(),
          page: schema.number.optional([rules.unsigned()]),
          limit: schema.number.optional([rules.unsigned(), rules.range(1, 100)]),
          date_from: schema.date.optional(),
          date_to: schema.date.optional(),
          search: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
          sort_by: schema.enum.optional(['date', 'title', 'event_type', 'created_at']),
          sort_order: schema.enum.optional(['asc', 'desc'])
        });

      default:
        throw new CustomError(`Validation schema for type "${type}" is not defined.`, 400);
    }
  }

  public messages() {
    return {
      'business_id.required': 'Business ID is required.',
      'business_id.uuid': 'Business ID must be a valid UUID.',

      'title.required': 'Event title is required.',
      'title.minLength': 'Event title must be at least 1 character long.',
      'title.maxLength': 'Event title must not exceed 255 characters.',

      'event_type.required': 'Event type is required.',
      'event_type.enum': 'Event type must be one of: birthday, holiday, leave, meeting, custom.',

      'date.required': 'Event date is required.',
      'date.date': 'Event date must be a valid date.',

      'description.maxLength': 'Description must not exceed 1000 characters.',

      'status.enum': 'Status must be one of: active, cancelled, completed.',

      'metadata.color.maxLength': 'Color code must not exceed 7 characters.',
      'metadata.priority.enum': 'Priority must be one of: low, medium, high.',
      'metadata.location.maxLength': 'Location must not exceed 255 characters.',
      'metadata.meeting_url.url': 'Meeting URL must be a valid URL.',
      'metadata.notes.maxLength': 'Notes must not exceed 500 characters.',

      'id.required': 'Event ID is required.',
      'id.uuid': 'Event ID must be a valid UUID.',

      'start_date.date': 'Start date must be a valid date.',
      'end_date.date': 'End date must be a valid date.',
      'date_from.date': 'Date from must be a valid date.',
      'date_to.date': 'Date to must be a valid date.',
      'page.unsigned': 'Page number must be a positive number.',
      'limit.unsigned': 'Limit must be a positive number.',
      'limit.range': 'Limit must be between 1 and 100.',
      'search.maxLength': 'Search term must not exceed 100 characters.',
      'sort_by.enum': 'Sort by must be one of: date, title, event_type, created_at.',
      'sort_order.enum': 'Sort order must be either asc or desc.',
      'employee_id.uuid': 'Employee ID must be a valid UUID.'
    };
  }

  public async fire(payload: any, type: 'create' | 'update' | 'get' | 'delete' | 'fetch' | 'bulk_create') {
    try {
      await validator.validate({
        schema: this.schemas(type),
        data: payload,
        messages: this.messages(),
      });

      if (type === 'create' || type === 'update' || type === 'bulk_create') {
        await this.validateEventTypeSpecificRules(payload, type);
      }

      if (type === 'fetch') {
        await this.validateFetchFilters(payload);
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400;
      }
      throw error;
    }
  }

  private async validateEventTypeSpecificRules(payload: any, type: 'create' | 'update' | 'bulk_create') {
    const items = type === 'bulk_create' ? payload : [payload];

    for (const item of items) {
      if (!item.event_type) continue;

      switch (item.event_type) {
        case 'birthday':
          await this.validateBirthdayEvent(item);
          break;
        case 'holiday':
          await this.validateHolidayEvent(item);
          break;
        case 'leave':
          await this.validateLeaveEvent(item);
          break;
        case 'meeting':
          await this.validateMeetingEvent(item);
          break;
        case 'custom':
          await this.validateCustomEvent(item);
          break;
      }
    }
  }

  private async validateBirthdayEvent(item: any) {
    if (!item.employee_id) {
      throw new CustomError('Employee ID is required for birthday events.', 400);
    }
  }

  private async validateHolidayEvent(item: any) {
    if (!item.holiday_id) {
      throw new CustomError('Holiday ID is required for holiday events.', 400);
    }
  }

  private async validateLeaveEvent(item: any) {
    if (!item.employee_id) {
      throw new CustomError('Employee ID is required for leave events.', 400);
    }
    if (!item.leave_id) {
      throw new CustomError('Leave ID is required for leave events.', 400);
    }
  }

  private async validateMeetingEvent(item: any) {
    if (item.employee_id && typeof item.employee_id !== 'number') {
      throw new CustomError('Employee ID must be a valid number for meeting events.', 400);
    }
  }

  private async validateCustomEvent(item: any) {
    if (item.employee_id && typeof item.employee_id !== 'number') {
      throw new CustomError('Employee ID must be a valid number for custom events.', 400);
    }
  }

  public async validateDateRange(startDate: string, endDate: string) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        throw new CustomError('Start date cannot be after end date.', 400);
      }

      const oneYearFromStart = new Date(start);
      oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);

      if (end > oneYearFromStart) {
        throw new CustomError('Date range cannot exceed 1 year.', 400);
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new CustomError('Invalid date format provided.', 400);
    }
  }

  public async validateId(id: string) {
    try {
      await validator.validate({
        schema: schema.create({
          id: schema.string({}, [rules.uuid(), rules.required()]),
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

  public async validateBusinessId(businessId: string) {
    try {
      await validator.validate({
        schema: schema.create({
          business_id: schema.string({}, [rules.uuid(), rules.required()]),
        }),
        data: { business_id: businessId },
        messages: this.messages(),
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        error.status = 400;
      }
      throw error;
    }
  }

  private async validateFetchFilters(filters: any) {
    if (filters.start_date && filters.end_date) {
      await this.validateDateRange(filters.start_date, filters.end_date);
    }

    if (filters.date_from && filters.date_to) {
      await this.validateDateRange(filters.date_from, filters.date_to);
    }

    const allowedFilters = [
      'business_id', 'event_type', 'employee_id', 'status', 
      'start_date', 'end_date', 'page', 'limit', 
      'date_from', 'date_to', 'search', 'sort_by', 'sort_order'
    ];

    const providedFilters = Object.keys(filters);
    const invalidFilters = providedFilters.filter(filter => !allowedFilters.includes(filter));

    if (invalidFilters.length > 0) {
      throw new CustomError(
        `Invalid filter(s) provided: ${invalidFilters.join(', ')}. Allowed filters: ${allowedFilters.join(', ')}`,
        400
      );
    }

    if (!filters.business_id) {
      throw new CustomError('Business ID is required for filtering calendar events.', 400);
    }

    if (filters.business_id && !this.isValidUUID(filters.business_id)) {
      throw new CustomError('Business ID must be a valid UUID.', 400);
    }

    if (filters.employee_id && !this.isValidUUID(filters.employee_id)) {
      throw new CustomError('Employee ID must be a valid UUID.', 400);
    }
  
    if (filters.event_type && !this.isValidEventType(filters.event_type)) {
      throw new CustomError('Event type must be one of: birthday, holiday, leave, meeting, custom.', 400);
    }

    if (filters.status && !this.isValidStatus(filters.status)) {
      throw new CustomError('Status must be one of: active, cancelled, completed.', 400);
    }

    if (filters.sort_by && !this.isValidSortBy(filters.sort_by)) {
      throw new CustomError('Sort by must be one of: date, title, event_type, created_at.', 400);
    }

    if (filters.sort_order && !this.isValidSortOrder(filters.sort_order)) {
      throw new CustomError('Sort order must be either asc or desc.', 400);
    }
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(value)
  }

  private isValidEventType(value: string): boolean {
    const validTypes = ['birthday', 'holiday', 'leave', 'meeting', 'custom']
    return validTypes.includes(value)
  }

  private isValidStatus(value: string): boolean {
    const validStatuses = ['active', 'cancelled', 'completed']
    return validStatuses.includes(value)
  }

  private isValidSortBy(value: string): boolean {
    const validSortBy = ['date', 'title', 'event_type', 'created_at']
    return validSortBy.includes(value)
  }

  private isValidSortOrder(value: string): boolean {
    const validSortOrder = ['asc', 'desc']
    return validSortOrder.includes(value)
  }
}

export default new CalendarEventValidator(); 