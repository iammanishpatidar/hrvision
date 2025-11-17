import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Business from '../business/business.model.js'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon';

export default class CompanyPolicy extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare business_id: string

  @column()
  declare policy_name: string

  @column()
  declare description?: string

  @column()
  declare file_path: string

  @column.dateTime({ autoCreate: true })
    declare created_at: DateTime;
  
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updated_at: DateTime;
  
    @column.dateTime()
    declare deleted_at: DateTime;
  

  @belongsTo(() => Business)
  declare business: relations.BelongsTo<typeof Business>
}
