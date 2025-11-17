import Employee from "#app/employee/employee.model";
import Assets from "../assets.model.js";
import { BaseModel, column, belongsTo } from "@adonisjs/lucid/orm";
import * as relations from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";
import Category from "#app/category/category.model";

export default class AssetRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare employee_id: string;

  @column()
  declare asset_type: string;

  @column()
  declare category_id: string;

  @column()
  declare asset_id?: string;

  @column()
  declare status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

  @column()
  declare approved_by?: string;

  @column.dateTime()
  declare approved_at?: DateTime;

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updated_at: DateTime;

  @column.dateTime({ columnName: 'deleted_at' })
  declare deleted_at?: DateTime | null

  @belongsTo(() => Employee, { foreignKey: 'employee_id' })
  declare employee: relations.BelongsTo<typeof Employee>;

  @belongsTo(() => Category, { foreignKey: 'category_id' })
  declare category: relations.BelongsTo<typeof Category>;

  @belongsTo(() => Assets, { foreignKey: 'asset_id' })
  declare asset: relations.BelongsTo<typeof Assets>;
}