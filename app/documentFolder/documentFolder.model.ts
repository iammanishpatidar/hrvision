import { BaseModel, column, belongsTo,hasMany,hasOne} from '@adonisjs/lucid/orm'
import DocumentCategory from '../documentCategory/documentCategory.model.js'
import * as relations from '@adonisjs/lucid/types/relations'

export default class DocumentFolderModel extends BaseModel {
   public static table = 'document_folders'
  @column({ isPrimary: true })
declare id: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare documentPath: string

  @column()
  declare categoryId: string

  
  @belongsTo(() => DocumentCategory, { foreignKey: 'category_id' })
  declare category: relations.BelongsTo<typeof DocumentCategory>
}
