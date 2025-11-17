import Business from "#app/business/business.model";
import Employee from "#app/employee/employee.model";
import { BaseModel, belongsTo, column, beforeFind, beforeFetch, beforePaginate } from "@adonisjs/lucid/orm";
import * as relations from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';

export enum TaskMode {
  IN_OFFICE = 'in-office',
  REMOTE = 'remote',
}

export enum TaskStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export default class TimeTracking extends BaseModel {
  static table = 'time_trackings'

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare task_mode: TaskMode;

  @column()
  declare project_name: string;

  @column()
  declare task_name: string;

  @column.dateTime()
  declare date: DateTime;

  @column()
  declare work_description: string;

  @column()
  declare business_id: string;

  @column()
  declare employee_id: string;

  @column.dateTime()
  declare start_time: DateTime;

  @column.dateTime()
  declare end_time: DateTime | null;

  @column()
  declare duration_minutes: number;

  @column()
  declare status: TaskStatus;

  @column()
  declare ip_address: string | null;

  @column()
  declare user_agent: string | null;

  @column()
  declare session_id: string | null;

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updated_at: DateTime;

  @column.dateTime({ columnName: 'deleted_at' })
  declare deleted_at?: DateTime | null;

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: relations.BelongsTo<typeof Business>;

  @belongsTo(() => Employee, { foreignKey: 'employee_id' })
  declare employee: relations.BelongsTo<typeof Employee>;

  static boot() {
    super.boot()
    
    this.before('create', (model) => {
      if (!model.id) {
        model.id = uuidv4()
      }
    })
  }

  async delete() {
    this.deleted_at = DateTime.now()
    await this.save()
  }

  @beforeFind()
  @beforeFetch()
  @beforePaginate()
  static applySoftDeleteFilter(query: any) {
    const qb = typeof query?.whereNull === 'function' 
      ? query 
      : typeof query?.query?.whereNull === 'function' 
        ? query.query 
        : null;

    if (qb) {
      qb.whereNull('deleted_at');
    }
  }

  public getDurationInHours(): number {
    return this.duration_minutes / 60;
  }

  public isActive(): boolean {
    return this.status === TaskStatus.ACTIVE;
  }

  public isPaused(): boolean {
    return this.status === TaskStatus.PAUSED;
  }

  public isCompleted(): boolean {
    return this.status === TaskStatus.COMPLETED;
  }

  public canBeStarted(): boolean {
    return this.status === TaskStatus.PAUSED || this.status === TaskStatus.CANCELLED;
  }

  public canBePaused(): boolean {
    return this.status === TaskStatus.ACTIVE;
  }

  public canBeCompleted(): boolean {
    return this.status === TaskStatus.ACTIVE || this.status === TaskStatus.PAUSED;
  }

  public calculateDuration(): number {
    if (!this.start_time) return 0;
    
    const endTime = this.end_time || DateTime.now();
    const duration = endTime.diff(this.start_time, 'minutes');
    return Math.round(duration.minutes);
  }
}
