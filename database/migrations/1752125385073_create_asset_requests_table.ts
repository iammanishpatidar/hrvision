import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'asset_requests'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      
      table.uuid('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE')
      table.string('asset_type').notNullable()
      table.uuid('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE')
      table.enum('status', ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']).defaultTo('PENDING')
      table.uuid('approved_by').nullable().references('id').inTable('employees').onDelete('SET NULL')
      table.timestamp('approved_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}