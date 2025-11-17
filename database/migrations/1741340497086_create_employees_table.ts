import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateEmployeesTable extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.string('name');
      table.string('employee_id');
      table.string('clerk_id').unique();
      table.string('email').unique();
      table.string('contact_number');
      table.uuid('permanent_address_id').references('id').inTable('addresses');
      table.uuid('current_address_id').references('id').inTable('addresses');
      table.uuid('business_id').references('id').inTable('businesses');
      table.string('marital_status');
      table.string('gender');   
      table.string('religion');
      table.date('date_of_birth');
      table.timestamp('date_of_hire');
      table.string('designation');
      table.boolean('is_active').defaultTo(true);
      table.string('blood_group');
      table.uuid('manager_id').references('id').inTable('employees');
      table.string('employment_type');
      table.timestamp('last_working_date');
      table.uuid('department_id').references('id').inTable('departments');
      table.uuid('role_id').references('id').inTable('roles');
      table.uuid('designation_id').references('id').inTable('designations');
      table.uuid('location_id').references('id').inTable('locations');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
