import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import type { HasMany } from '@adonisjs/lucid/types/relations';
import DocumentFolder from '../documentFolder/documentFolder.model.js';

export default class DocumentCategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare name: string;

  @hasMany(() => DocumentFolder, { foreignKey: 'category_id' })
  declare folders: HasMany<typeof DocumentFolder>;
}
