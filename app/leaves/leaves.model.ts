import LeaveTypes from '#app/leaveTypes/leave_types.model';
import Employee from '../employee/employee.model.js';
import Business from '../business/business.model.js';
import {
  BaseModel,
  belongsTo,
  column,
  beforeFind,
  beforeFetch,
  beforePaginate,
  beforeCreate,
} from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

export default class Leaves extends BaseModel {
  static table = 'leaves';

  @column({ isPrimary: true, columnName: 'id', serializeAs: 'id' })
  declare id: string;

  @column({ columnName: 'date' })
  declare date: DateTime;

  @column({ columnName: 'is_half_day' })
  declare is_half_day: boolean;

  @column({ columnName: 'employee_id' })
  declare employee_id: string;

  @column({ columnName: 'reason' })
  declare reason: string | null;

  @column({ columnName: 'status' })
  declare status: string | null;

  @column({ columnName: 'leave_type_id' })
  declare leave_type_id: string;

  @column({ columnName: 'business_id' })
  declare business_id: string;

  @belongsTo(() => LeaveTypes, {
    foreignKey: 'leave_type_id',
  })
  declare leaveTypes: BelongsTo<typeof LeaveTypes>;

  @belongsTo(() => Employee, {
    foreignKey: 'employee_id',
  })
  declare employee: BelongsTo<typeof Employee>;

  @belongsTo(() => Business, {
    foreignKey: 'business_id',
  })
  declare business: BelongsTo<typeof Business>;

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

  // Soft delete functionality
  async delete() {
    this.deleted_at = DateTime.now();
    await this.save();
  }

  @beforeCreate()
  static setDefaultStatus(model: Leaves) {
    if (!model.status) {
      model.status = 'PENDING';
    }
  }

  @beforeFind()
  @beforeFetch()
  @beforePaginate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static applySoftDeleteFilter(query: any) {
    const qb =
      typeof query?.whereNull === 'function'
        ? query
        : typeof query?.query?.whereNull === 'function'
          ? query.query
          : null;

    if (qb) {
      qb.whereNull(`${Leaves.table}.deleted_at`);
    }
  }
}
