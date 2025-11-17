import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'reimbursements';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.uuid('employee_id').references('id').inTable('employees');
      table
        .enum('status', ['pending', 'approved', 'rejected'])
        .notNullable()
        .defaultTo('pending');
      table.decimal('amount', 10, 2);
      table.string('description');
      table.date('date');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
