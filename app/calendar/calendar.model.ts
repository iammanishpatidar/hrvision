import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Business from '../business/business.model.js'
import Employee from '../employee/employee.model.js'
import HolidayPolicy from '../holidayPolicy/holidayPolicy.model.js'
import Leave from '../leaves/leaves.model.js'

export default class CalendarEvent extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare business_id: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare event_type: 'birthday' | 'holiday' | 'leave' | 'meeting' | 'custom'

  @column.date()
  declare date: DateTime

  @column()
  declare employee_id: string | null

  @column()
  declare holiday_id: string | null

  @column()
  declare leave_id: string | null

  @column()
  declare status: 'active' | 'cancelled' | 'completed'

  @column()
  declare metadata: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Business, {
    foreignKey: 'business_id'
  })
  declare business: BelongsTo<typeof Business>

  @belongsTo(() => Employee, {
    foreignKey: 'employee_id'
  })
  declare employee: BelongsTo<typeof Employee>

  @belongsTo(() => HolidayPolicy, {
    foreignKey: 'holiday_id'
  })
  declare holiday: BelongsTo<typeof HolidayPolicy>

  @belongsTo(() => Leave, {
    foreignKey: 'leave_id'
  })
  declare leave: BelongsTo<typeof Leave>
} 