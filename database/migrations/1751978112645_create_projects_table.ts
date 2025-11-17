import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'projects';

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      
      table.string('project_name').notNullable();
      table.text('description').nullable();
      table.uuid('business_id').references('id').inTable('businesses').notNullable();
      table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE').notNullable();

      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
} 