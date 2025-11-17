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
import Business from '#app/business/business.model';

export default class HolidayLeavePolicy extends BaseModel {
  public static table = 'holidays';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column.date({ columnName: 'date' })
  declare date: DateTime | null;

  @column({ columnName: 'is_mandatory' })
  declare isMandatory: boolean;

  @column()
  declare type: 'NATIONAL' | 'REGIONAL' | 'COMPANY' | 'OPTIONAL';

  @column()
  declare region: string[];

  @column({ columnName: 'allowed_employee_type' })
  declare allowedEmployeeType: string[];

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

  @column({ columnName: 'business_id' })
  declare businessId: string;

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: BelongsTo<typeof Business>;

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
