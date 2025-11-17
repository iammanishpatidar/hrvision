import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  beforeFind,
  beforeFetch,
  beforePaginate,
  belongsTo,
  scope,
} from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';

import Address from '../address/address.model.js';
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';

export default class Business extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare logo: string;

  @column()
  declare email: string;

  @column()
  declare primary_color: string;

  @column()
  declare secondary_color: string;

  @column.date()
  declare time_off_cycle_start_date: DateTime;

  @column.date()
  declare time_off_cycle_end_date: DateTime;

  @column()
  declare contact_number: string;

  @column()
  declare address_id: string;

  @column()
  declare website: string | null;

  @column()
  declare business_sector: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deleted_at: DateTime | null;

  /** Soft delete scope */
  public static active = scope(
    (query: ModelQueryBuilderContract<typeof Business>) => {
      query.whereNull('deleted_at');
    }
  );

  /** Soft delete method */
  async delete() {
    this.deleted_at = DateTime.now();
    await this.save();
  }

  /** Apply soft delete filter */
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

  /** Relationships */
  @belongsTo(() => Address, { foreignKey: 'address_id' })
  declare address: BelongsTo<typeof Address>;
}
