import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'leaves';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.date('date');
      table.boolean('is_half_day');
      table.uuid('employee_id').references('id').inTable('employees');
      table.uuid('business_id').references('id').inTable('businesses');
      table.string('reason').nullable();
      table.string('status').nullable();
      table.uuid('leave_type_id').references('id').inTable('leave_types');
      table.timestamps(true, true);
      table.dateTime('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
