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

export default class LeaveTypes extends BaseModel {
  public static table = 'leave_types';

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare max_leaves: number;

  @column()
  declare is_carry_forward_allowed: boolean;

  @column()
  declare is_approval_required: boolean;

  @column({
    serialize: (value: string[]) => value,
    consume: (value: string[]) => value,
  })
  declare allowed_genders: string[];

  @column({
    serialize: (value: string[]) => value,
    consume: (value: string[]) => value,
  })
  declare allowed_employee_type: string[];

  @column()
  declare business_id: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt?: DateTime | null;

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: BelongsTo<typeof Business>;

  // Soft delete functionality
  async delete() {
    this.deletedAt = DateTime.now();
    await this.save();
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
      qb.whereNull('deleted_at');
    }
  }
}
