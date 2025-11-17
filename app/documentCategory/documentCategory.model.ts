import { BaseModel, column,hasMany,hasOne,belongsTo} from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import DocumentFolder from '../documentFolder/documentFolder.model.js'

export default class DocumentCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @hasMany(() => DocumentFolder, { foreignKey: 'category_id' })
  declare folders: relations.HasMany<typeof DocumentFolder>

}
