import Business from "#app/business/business.model";
import Employee from "#app/employee/employee.model";
import TimeTracking, { TaskStatus } from "./timeTracking.model.js";
import TimeTrackingRepository from "./timeTracking.repository.js";
import CustomError from "../../utilities/custom_error.js";
import { DateTime } from "luxon";
import db from "@adonisjs/lucid/services/db";

export default class TimeTrackingService {
  private readonly timeTrackingRepository: TimeTrackingRepository;

  constructor() {
    this.timeTrackingRepository = new TimeTrackingRepository();
  }

  public async create(data: Partial<TimeTracking>, employeeId?: string): Promise<TimeTracking> {
    if (!employeeId) {
      throw new CustomError('Employee ID is required', 401);
    }

    const employee = await Employee.find(employeeId);

    if (!employee) {
      throw new CustomError('Employee not found', 404);
    }

    if (!employee.is_active) {
      throw new CustomError('Employee is not active', 400);
    }

    const business = await Business.find(employee.business_id);

    if (!business) {
      throw new CustomError('Business not found', 404);
    }

    const existingActiveTaskWithSameName = await TimeTracking.query()
      .where('employee_id', employee.id)
      .where('task_name', data.task_name!)
      .where('status', TaskStatus.ACTIVE)
      .first();

    if (existingActiveTaskWithSameName) {
      throw new CustomError(`A task with the name "${data.task_name}" is already active. Please stop the existing task before creating a new one.`, 400);
    }

    const activeTask = await TimeTracking.query()
      .where('employee_id', employee.id)
      .where('status', TaskStatus.ACTIVE)
      .first();

    if (activeTask) {
      await this.autoStopPreviousTask(activeTask);
      await this.logAuditEvent('auto_stop_previous_task', {
        task_id: activeTask.id,
        employee_id: employee.id,
        reason: 'New task started',
        new_task_name: data.task_name
      });
    }

    const serverTimestamp = DateTime.now();
    
    if (serverTimestamp > DateTime.now().plus({ seconds: 5 })) {
      throw new CustomError('Invalid timestamp: Cannot log time in the future', 400);
    }

    let parsedDate: DateTime | undefined = undefined;
    if (data.date) {
      const tempDate = typeof data.date === 'string' 
        ? DateTime.fromISO(data.date)
        : DateTime.isDateTime(data.date) 
          ? data.date 
          : DateTime.fromISO(data.date as string);
      if (!tempDate || !tempDate.isValid) {
        throw new CustomError('Invalid date format. Date must be in YYYY-MM-DD format (e.g., 2024-01-15).', 400);
      }
      const today = DateTime.now().startOf('day');
      if (tempDate > today) {
        throw new CustomError('Date cannot be in the future.', 400);
      }
      const lowerBound = DateTime.fromISO('1900-01-01');
      if (tempDate < lowerBound) {
        throw new CustomError('Date must be after 1900-01-01.', 400);
      }
      parsedDate = tempDate;
    }

    const timeTrackingData: Partial<TimeTracking> = {
      task_mode: data.task_mode!,
      project_name: data.project_name!,
      task_name: data.task_name!,
      work_description: data.work_description!,
      business_id: employee.business_id,
      employee_id: employee.id,
      ...(parsedDate ? { date: parsedDate } : {}),
      start_time: serverTimestamp,
      end_time: null,
      duration_minutes: 0,
      status: TaskStatus.ACTIVE,
    };

    const createdTask = await this.timeTrackingRepository.create(timeTrackingData);

    await this.logAuditEvent('task_created', {
      task_id: createdTask.id,
      employee_id: employee.id,
      task_name: data.task_name,
      project_name: data.project_name,
      start_time: serverTimestamp.toISO()
    });

    return createdTask;
  }

  public async getAll(employeeId?: string): Promise<TimeTracking[]> {
    if (!employeeId) {
      throw new CustomError('Employee ID is required', 401);
    }

    const employee = await Employee.find(employeeId);

    if (!employee) {
      throw new CustomError('Employee not found', 404);
    }

    return await TimeTracking.query()
      .where('employee_id', employee.id)
      .orderBy('created_at', 'desc');
  }

  public async getAllTasks(): Promise<TimeTracking[]> {
    return await TimeTracking.query()
      .preload('employee')
      .preload('business')
      .orderBy('created_at', 'desc');
  }

  public async getById(id: string): Promise<TimeTracking | null> {
    return await TimeTracking.find(id);
  }

  public async updateTask(taskId: string, data: Partial<TimeTracking>, employeeId?: string): Promise<TimeTracking> {
    if (!employeeId) {
      throw new CustomError('Employee ID is required', 401);
    }

    const employee = await Employee.find(employeeId);

    if (!employee) {
      throw new CustomError('Employee not found', 404);
    }

    const existingTask = await TimeTracking.query()
      .where('id', taskId)
      .where('employee_id', employee.id)
      .first();

    if (!existingTask) {
      throw new CustomError('Task not found or access denied', 404);
    }

    const protectedFields = [
      'created_at', 'updated_at', 'start_time', 'end_time',
      'createdAt', 'updatedAt', 'startTime', 'endTime',
      'date',
      'task_name'
    ];
    const attemptedProtectedFields = protectedFields.filter(field => data.hasOwnProperty(field));
    
    if (attemptedProtectedFields.length > 0) {
      throw new CustomError(
        `Cannot update protected fields: ${attemptedProtectedFields.join(', ')}. These fields are managed automatically by the system.`,
        400
      );
    }

    const oldValues = {
      task_name: existingTask.task_name,
      project_name: existingTask.project_name,
      work_description: existingTask.work_description,
      start_time: existingTask.start_time,
      end_time: existingTask.end_time,
      duration_minutes: existingTask.duration_minutes,
      status: existingTask.status
    };

    Object.assign(existingTask, data);
    await existingTask.save();

    await this.logAuditEvent('task_updated', {
      task_id: taskId,
      employee_id: employee.id,
      old_values: oldValues,
      new_values: {
        task_name: existingTask.task_name,
        project_name: existingTask.project_name,
        work_description: existingTask.work_description,
        start_time: existingTask.start_time,
        end_time: existingTask.end_time,
        duration_minutes: existingTask.duration_minutes,
        status: existingTask.status
      },
      changed_fields: this.getChangedFields(oldValues, existingTask)
    });

    return existingTask;
  }

  public async stopTask(taskId: string, employeeId?: string): Promise<TimeTracking> {
    if (!employeeId) {
      throw new CustomError('Employee ID is required', 401);
    }

    const employee = await Employee.find(employeeId);

    if (!employee) {
      throw new CustomError('Employee not found', 404);
    }

    const existingTask = await TimeTracking.query()
      .where('id', taskId)
      .where('employee_id', employee.id)
      .first();

    if (!existingTask) {
      throw new CustomError('Task not found or access denied', 404);
    }

    if (existingTask.status !== TaskStatus.ACTIVE) {
      throw new CustomError('Only active tasks can be stopped', 400);
    }

    const serverTimestamp = DateTime.now();
    existingTask.end_time = serverTimestamp;
    existingTask.duration_minutes = existingTask.calculateDuration();
    existingTask.status = TaskStatus.COMPLETED;
    await existingTask.save();

    await this.logAuditEvent('task_stopped', {
      task_id: taskId,
      employee_id: employee.id,
      end_time: serverTimestamp.toISO(),
      duration_minutes: existingTask.duration_minutes
    });

    return existingTask;
  }

  private async autoStopPreviousTask(activeTask: TimeTracking): Promise<void> {
    const serverTimestamp = DateTime.now();
    activeTask.end_time = serverTimestamp;
    activeTask.duration_minutes = activeTask.calculateDuration();
    activeTask.status = TaskStatus.COMPLETED;
    await activeTask.save();
  }

  private async logAuditEvent(eventType: string, data: any): Promise<void> {
    try {
      await db.table('time_tracking_audit_logs').insert({
        event_type: eventType,
        event_data: JSON.stringify(data),
        created_at: DateTime.now().toISO()
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  private getChangedFields(oldValues: any, newTask: TimeTracking): string[] {
    const changedFields = [];
    for (const [key, oldValue] of Object.entries(oldValues)) {
      if (newTask[key as keyof TimeTracking] !== oldValue) {
        changedFields.push(key);
      }
    }
    return changedFields;
  }
}
