import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_tracking_audit_logs'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      
      // Event details
      table.string('event_type', 100).notNullable()
      table.jsonb('event_data').notNullable()
      table.timestamp('timestamp').notNullable()
      
      // Extract and index common fields from event_data for faster queries
      table.string('task_id').nullable()
      table.string('employee_id').nullable()
      
      // Timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')
      
      // Performance indexes
      table.index(['event_type'], 'idx_audit_event_type')
      table.index(['timestamp'], 'idx_audit_timestamp')
      table.index(['event_type', 'timestamp'], 'idx_audit_event_type_timestamp')
      table.index(['task_id'], 'idx_audit_task_id')
      table.index(['employee_id'], 'idx_audit_employee_id')
      table.index(['employee_id', 'timestamp'], 'idx_audit_employee_timestamp')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}