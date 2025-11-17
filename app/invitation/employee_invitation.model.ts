import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

import Employee from '../employee/employee.model.js';

export default class EmployeeInvitation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare token: string;

  @column.dateTime()
  declare expires_at: DateTime;

  @column()
  declare employee_id: string;

  @column()
  declare admin_id: string;

  @column()
  declare status: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  /** Relationships */
  @belongsTo(() => Employee, { foreignKey: 'employee_id' })
  declare employee: BelongsTo<typeof Employee>;

  @belongsTo(() => Employee, { foreignKey: 'admin_id' })
  declare admin: BelongsTo<typeof Employee>;
}
