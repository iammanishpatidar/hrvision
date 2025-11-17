import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'calendar_events'

  async up() {

    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.uuid('business_id').references('id').inTable('businesses').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.enum('event_type', ['birthday', 'holiday', 'leave', 'meeting', 'custom']).notNullable()
      table.date('date').notNullable()
      table.uuid('employee_id').references('id').inTable('employees').onDelete('CASCADE').nullable()
      table.uuid('holiday_id').references('id').inTable('holidays').onDelete('CASCADE').nullable()
      table.uuid('leave_id').references('id').inTable('leaves').onDelete('CASCADE').nullable()
      table.enum('status', ['active', 'cancelled', 'completed']).defaultTo('active')
      table.json('metadata').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()

      table.index(['business_id', 'date'])
      table.index(['business_id', 'event_type'])
      table.index(['employee_id', 'date'])
      table.index(['holiday_id'])
      table.index(['leave_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}