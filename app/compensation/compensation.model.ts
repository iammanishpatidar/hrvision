import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import Employee from '#app/employee/employee.model';
import { DateTime } from 'luxon';

export enum BaseRatePeriod {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum SalarySchedule {
  START_OF_MONTH = 'Start of every month',
  END_OF_MONTH = 'End of every month',
}

export default class Compensation extends BaseModel {
  static table = 'compensations';

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare employee_id: string;

  @column()
  declare base_salary: number;

  @column()
  declare base_rate_period: BaseRatePeriod;

  @column()
  declare salary_schedule: SalarySchedule;

  @column()
  declare total_allowance: number | null;

  @column()
  declare net_salary: number | null;

  @column()
  declare currency: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime

  @belongsTo(() => Employee)
  declare employee: relations.BelongsTo<typeof Employee>;
}
