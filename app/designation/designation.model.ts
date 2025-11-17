import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  beforeFind,
  beforeFetch,
  beforePaginate,
  scope,
} from '@adonisjs/lucid/orm';
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';

export default class Designation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare designation: string;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;

  @column.dateTime()
  declare deleted_at: DateTime | null;

  // Scopes
  public static active = scope(
    (query: ModelQueryBuilderContract<typeof Designation>) => {
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
    query: ModelQueryBuilderContract<typeof Designation>
  ) {
    query.whereNull('deleted_at');
  }
} 