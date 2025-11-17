import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employee_invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('token').notNullable()
      table.string('status').notNullable()
      table.timestamp('expires_at').notNullable()
      table
      .uuid('employee_id')
      .references('id')
      .inTable('employees')
      .onDelete('CASCADE')
      table
        .uuid('admin_id')
        .references('id')
        .inTable('employees')
        .onDelete('CASCADE')

      table.timestamps(true, true)
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
