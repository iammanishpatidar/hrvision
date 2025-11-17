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
import Business from '../business/business.model.js';

export default class Bonus extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare bonus_type: string;

  @column()
  declare amount: string;

  @column()
  declare currency: string;

  @column()
  declare interval: string;

  @column()
  declare business_id?: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt?: DateTime | null;

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: BelongsTo<typeof Business>;

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
