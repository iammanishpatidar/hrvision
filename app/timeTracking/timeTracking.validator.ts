import { schema, rules, validator } from '@adonisjs/validator';
import { ValidationException } from '@adonisjs/validator';
import Validator from '../common/validator.js';
import type TimeTracking from './timeTracking.model.js';
import { TaskMode, TaskStatus } from './timeTracking.model.js';

type ValidationType = 'create' | 'update' | 'get' | 'delete';

class TimeTrackingValidator extends Validator<ValidationType> {
  public schemas(type: ValidationType) {
    switch (type) {
      case 'get':
      case 'delete':
        return schema.create({
          id: schema.string({ trim: true }, [rules.uuid()]), 
        });

      case 'create':
        return schema.create({
          task_mode: schema.enum([TaskMode.IN_OFFICE, TaskMode.REMOTE]),
          project_name: schema.string({ trim: true }, [rules.maxLength(255), rules.minLength(1)]),
          task_name: schema.string({ trim: true }, [rules.maxLength(255), rules.minLength(1)]),
          date: schema.string({ trim: true }, [
            rules.minLength(1),
            rules.regex(/^\d{4}-\d{2}-\d{2}$/)
          ]),
          work_description: schema.string({ trim: true }, [rules.minLength(1)]),
        });

      case 'update':
        return schema.create({
          task_mode: schema.enum.optional([TaskMode.IN_OFFICE, TaskMode.REMOTE]),
          project_name: schema.string.optional({ trim: true }, [rules.maxLength(255), rules.minLength(1)]),
          work_description: schema.string.optional({ trim: true }, [rules.minLength(1)]),
          status: schema.enum.optional([TaskStatus.ACTIVE, TaskStatus.PAUSED, TaskStatus.COMPLETED, TaskStatus.CANCELLED]),
        });

      default:
        throw new Error(`Validation schema for type "${type}" is not defined.`);
    }
  }

  public messages() {
    return {
      'id.required': 'Time tracking ID is required.',
      'id.uuid': 'Time tracking ID must be a valid UUID.',
      'task_mode.required': 'Task mode is required.',
      'task_mode.enum': `Task mode must be either "${TaskMode.IN_OFFICE}" or "${TaskMode.REMOTE}".`,
      'project_name.required': 'Project name is required.',
      'project_name.maxLength': 'Project name must not exceed 255 characters.',
      'project_name.minLength': 'Project name cannot be empty.',
      'task_name.required': 'Task name is required.',
      'task_name.maxLength': 'Task name must not exceed 255 characters.',
      'task_name.minLength': 'Task name cannot be empty.',
      'date.required': 'Date is required.',
      'date.minLength': 'Date cannot be empty.',
      'date.regex': 'Date must be in YYYY-MM-DD format (e.g., 2024-01-15).',
      'status.enum': `Status must be one of: ${Object.values(TaskStatus).join(', ')}.`,
      'work_description.required': 'Work description is required.',
      'work_description.minLength': 'Work description cannot be empty.',
      'uuid': 'Must be a valid UUID.',
    };
  }

  public async fire(payload: Partial<TimeTracking>, type: ValidationType) {
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

  public async validateId(id: string): Promise<void> {
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

export default new TimeTrackingValidator();