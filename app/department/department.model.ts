import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import Employee from '../employee/employee.model.js';
import { DateTime } from 'luxon';

export default class Department extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare department: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime;

  @hasMany(() => Employee, { foreignKey: 'departmentId' })
  declare employees: relations.HasMany<typeof Employee>;
}
