import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'leave_types';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.string('name');
      table.integer('max_leaves');
      table.boolean('is_carry_forward_allowed');
      table.boolean('is_approval_required');
      table.specificType('allowed_genders', 'text[]').notNullable();
      table.specificType('allowed_employee_type', 'text[]').notNullable();
      table.uuid('business_id').references('id').inTable('businesses');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
