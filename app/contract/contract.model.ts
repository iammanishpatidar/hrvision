import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  beforeFind,
  beforeFetch,
} from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Employee from '../employee/employee.model.js';

export default class Contract extends BaseModel {
    public static table = 'contract_infos';

    @column({ isPrimary: true })
    declare id: string;

    @column({ columnName: 'employee_id' })
    declare employee_id?: string;

    @belongsTo(() => Employee, { foreignKey: 'employee_id' })
      declare employee: BelongsTo<typeof Employee>;

    @column()
    declare contract_name: string;

    @column()
    declare contract_type: string;

    @column.dateTime({ autoCreate: true })
    declare created_at: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updated_at: DateTime;

    @column.dateTime()
    declare start_date: DateTime;

    @column.dateTime()
    declare end_date: DateTime;

    @column()
    declare is_active: boolean;

    @column.dateTime({ columnName: 'deleted_at' })
    declare deleted_at?: DateTime | null;

    async softDelete() {
      this.deleted_at = DateTime.now();
      await this.save();
    }

    @beforeFind()
    @beforeFetch()
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