import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'holidays';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.string('name').notNullable();
      table.date('date').notNullable();
      table.boolean('is_mandatory').notNullable();
      table.string('type').notNullable();
      table.specificType('region', 'TEXT[]').notNullable();
      table.specificType('allowed_employee_type', 'TEXT[]').notNullable();
      table
        .uuid('business_id')
        .notNullable()
        .references('id')
        .inTable('businesses')
        .onDelete('CASCADE');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
