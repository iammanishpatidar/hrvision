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

export default class Allowance extends BaseModel {
  static table = 'allowances';

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare allowance_type: string;

  @column()
  declare amount: number;

  @column()
  declare currency: string;

  @column()
  declare is_recurring: boolean;

  @column()
  declare status: 'active' | 'inactive';

  @column()
  declare business_id: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime | null;

  // Relationship: One Allowance belongs to one Business
  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: BelongsTo<typeof Business>;

  // Soft delete override
  async delete() {
    this.deletedAt = DateTime.now();
    await this.save();
  }

  // Ignore soft-deleted records automatically
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
