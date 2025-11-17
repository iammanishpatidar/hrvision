import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  beforeFind,
  beforeFetch,
  beforePaginate,
} from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import Business from '../business/business.model.js';
import WorkingDay from './working_days.model.js';

export default class BusinessWorkingDaysMapping extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare business_id: string;

  @column()
  declare working_days_id: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt?: DateTime | null;

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: BelongsTo<typeof Business>;

  @belongsTo(() => WorkingDay, { foreignKey: 'working_days_id' })
  declare workingDay: BelongsTo<typeof WorkingDay>;

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
