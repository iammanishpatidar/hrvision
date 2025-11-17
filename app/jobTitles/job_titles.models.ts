import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  beforeFind,
  beforeFetch,
  beforePaginate,
  scope,
} from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';

import Business from '../business/business.model.js';

export default class JobTitle extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare title: string;

  @column()
  declare description: string;

  @column()
  declare business_id: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deleted_at: DateTime | null;

  // Scopes
  public static active = scope(
    (query: ModelQueryBuilderContract<typeof JobTitle>) => {
      query.whereNull('deleted_at');
    }
  );

  // Soft delete method
  async delete() {
    this.deleted_at = DateTime.now();
    await this.save();
  }

  // Auto-apply soft delete filter
  @beforeFind()
  @beforeFetch()
  @beforePaginate()
  static applySoftDeleteFilter(
    query: ModelQueryBuilderContract<typeof JobTitle>
  ) {
    query.whereNull('deleted_at');
  }

  // Relationships
  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: BelongsTo<typeof Business>;
}
