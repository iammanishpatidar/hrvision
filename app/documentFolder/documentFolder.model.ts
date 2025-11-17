import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import DocumentCategory from '../documentCategory/documentCategory.model.js';

export default class DocumentFolderModel extends BaseModel {
  public static table = 'document_folders';

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @column()
  declare description: string;

  @column({ columnName: 'document_path' })
  declare documentPath: string;

  @column({ columnName: 'category_id' })
  declare categoryId: string;

  @belongsTo(() => DocumentCategory, { foreignKey: 'category_id' })
  declare category: BelongsTo<typeof DocumentCategory>;
}
