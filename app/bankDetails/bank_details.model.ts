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
import Employee from '../employee/employee.model.js';

export default class BankDetail extends BaseModel {
  public static table = 'bank_details';

  @column({ isPrimary: true })
  declare id: string;

  @column({ columnName: 'account_number' })
  declare account_number: number;

  @column({ columnName: 'bank_name' })
  declare bank_name: string;

  @column({ columnName: 'branch' })
  declare branch: string;

  @column({ columnName: 'ifsc_code' })
  declare ifsc_code: string;

  @column({ columnName: 'swift_code' })
  declare swift_code: string;

  @column({ columnName: 'account_holder_name' })
  declare account_holder_name: string;

  @column({ columnName: 'passbook' })
  declare passbook: string;

  @column({ columnName: 'employee_id' })
  declare employee_id?: string;

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare created_at: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updated_at',
  })
  declare updated_at: DateTime;

  @column.dateTime({ columnName: 'deleted_at' })
  declare deleted_at?: DateTime | null;

  @belongsTo(() => Employee, { foreignKey: 'employee_id' })
  declare employee: BelongsTo<typeof Employee>;

  async delete() {
    this.deleted_at = DateTime.now();
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
