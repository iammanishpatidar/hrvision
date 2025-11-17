import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'compensations';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));

      table.uuid('employee_id').references('id').inTable('employees').notNullable();

      table.decimal('base_salary', 15, 2).notNullable();
      table.enum('base_rate_period', ['MONTHLY', 'YEARLY', 'QUARTERLY']).notNullable();

      table.string('salary_schedule').nullable();

      table.decimal('total_allowance', 15, 2).nullable();
      table.decimal('net_salary', 15, 2).nullable();

      table.string('currency', 3).nullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
