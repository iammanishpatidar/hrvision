import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column({ columnName: 'line_1' })
  declare line1: string;

  @column({ columnName: 'line_2' })
  declare line2?: string;

  @column()
  declare city: string;

  @column()
  declare state: string;

  @column()
  declare zipcode: number;

  @column()
  declare country: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;
}
