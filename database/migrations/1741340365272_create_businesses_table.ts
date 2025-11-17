import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'businesses';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.string('name');
      table.string('logo');
      table.string('email').unique();
      table.string('primary_color');
      table.string('secondary_color');
      table.date('time_off_cycle_start_date');
      table.date('time_off_cycle_end_date');
      table.string('contact_number');
      table.uuid('address_id').references('id').inTable('addresses');
      table.string('website').nullable();
      table.string('business_sector');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
