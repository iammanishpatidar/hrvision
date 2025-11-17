import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'contract_infos'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.uuid('employee_id').references('id').inTable('employees').notNullable().onDelete('CASCADE');
      table.string('contract_name');
      table.boolean('is_active').defaultTo(true);
      table.string('contract_type');
      table.date('start_date');
      table.date('end_date');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}