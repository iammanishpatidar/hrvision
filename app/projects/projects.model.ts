import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import Business from '#app/business/business.model';
import { DateTime } from 'luxon';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export default class Project extends BaseModel {
  static table = 'projects';

  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare project_name: string;

  @column()
  declare description: string | null;

  @column()
  declare business_id: string;

  @column()
  declare status: ProjectStatus;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column.dateTime()
  declare deletedAt: DateTime;

  @belongsTo(() => Business)
  declare business: relations.BelongsTo<typeof Business>;
}
