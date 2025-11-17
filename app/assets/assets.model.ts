import Business from "#app/business/business.model";
import Category from "#app/category/category.model";
import { BaseModel, belongsTo, column, beforeFind, beforeFetch, beforePaginate } from "@adonisjs/lucid/orm"
import * as relations from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';

export default class Assets extends BaseModel {
  static table = 'assets'

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare serial_number: string;

  @column()
  declare business_id: string;

  @column()
  declare asset_type: string;

  @column.date()
  declare assigned_date: DateTime;

  @column()
  declare category_id: string;

  @column()
  declare current_status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'DISPOSED';

  @column()
  declare condition: 'GOOD' | 'BAD' | 'REPAIR' | 'REPLACEMENT';

  @column.date()
  declare warranty_expiry: DateTime;

  @column()
  declare license_type: string;

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updated_at: DateTime

  @column.dateTime({ columnName: 'deleted_at' })
  declare deleted_at?: DateTime | null

  @belongsTo(() => Business, { foreignKey: 'business_id' })
  declare business: relations.BelongsTo<typeof Business>;

  @belongsTo(() => Category, { foreignKey: 'category_id' })
  declare category: relations.BelongsTo<typeof Category>;

  static boot() {
    super.boot()
    
    this.before('create', (model) => {
      if (!model.id) {
        model.id = uuidv4()
      }
    })
  }

  async delete() {
    this.deleted_at = DateTime.now()
    await this.save()
  }

  @beforeFind()
  @beforeFetch()
  @beforePaginate()
  static applySoftDeleteFilter(query: any) {
    const qb = typeof query?.whereNull === 'function' 
      ? query 
      : typeof query?.query?.whereNull === 'function' 
        ? query.query 
        : null;

    if (qb) {
      qb.whereNull('deleted_at');
    }
  }
}