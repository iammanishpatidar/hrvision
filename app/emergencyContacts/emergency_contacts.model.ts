import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  beforeFind,
  beforeFetch,
  beforePaginate,
  belongsTo,
} from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Address from '../address/address.model.js';
import Employee from '../employee/employee.model.js';

export default class EmergencyContact extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare relationship: string;

  @column()
  declare contact_number: string;

  @column()
  declare address_id?: string;

  @column()
  declare employee_id?: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt?: DateTime | null;

  @belongsTo(() => Address, { foreignKey: 'address_id' })
  declare address: BelongsTo<typeof Address>;

  @belongsTo(() => Employee, { foreignKey: 'employee_id' })
  declare employee: BelongsTo<typeof Employee>;

  async delete() {
    this.deletedAt = DateTime.now();
    await this.save();
  }

  @beforeFind()
  @beforeFetch()
  @beforePaginate()
  static applySoftDeleteFilter(query: any) {
    const qb =
      typeof query?.whereNull === 'function'
        ? query
        : typeof query?.query?.whereNull === 'function'
          ? query.query
          : null;

    if (qb) {
      qb.whereNull('deleted_at');
    }
  }
}
