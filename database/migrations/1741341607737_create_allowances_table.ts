import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'allowances';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.string('allowance_type');
      table.decimal('amount', 10, 2);
      table.string('currency');
      table.boolean('is_recurring');
      table.enum('status', ['active', 'inactive']).defaultTo('active');
      table.uuid('business_id').references('id').inTable('businesses');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
