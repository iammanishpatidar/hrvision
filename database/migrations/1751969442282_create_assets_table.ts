import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assets'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));

      table.string('name').notNullable();
      table.string('serial_number').notNullable();
      table.uuid('business_id').references('id').inTable('businesses').onDelete('SET NULL');
      table.string('asset_type').notNullable();
      table.date('assigned_date');
      table.uuid('category_id').references('id').inTable('categories').onDelete('SET NULL');
      table.enum('current_status', ['AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'DISPOSED']).defaultTo('AVAILABLE');
      table.enum('condition', ['GOOD', 'BAD', 'REPAIR', 'REPLACEMENT']).defaultTo('GOOD');
      table.date('warranty_expiry');
      table.string('license_type');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}