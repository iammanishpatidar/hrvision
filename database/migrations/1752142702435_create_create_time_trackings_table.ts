import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'time_trackings'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    this.schema.createTable(this.tableName, (table) => {
      // Primary key
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      
      // Core task fields
      table.enum('task_mode', ['in-office', 'remote']).notNullable()
      table.string('project_name', 255).notNullable()
      table.string('task_name', 255).notNullable()
      table.text('work_description').notNullable()
      
      // Date fields
      table.dateTime('date').nullable() // User-specified date
      table.timestamp('start_time').notNullable().defaultTo(this.now())
      table.timestamp('end_time').nullable()
      table.integer('duration_minutes').defaultTo(0)
      
      // Status
      table.enum('status', ['active', 'paused', 'completed', 'cancelled']).defaultTo('active')
      
      // Foreign keys
      table.uuid('business_id').references('id').inTable('businesses').onDelete('CASCADE')
      table.uuid('employee_id').references('id').inTable('employees').onDelete('CASCADE')
      
      // Security & tracking fields
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()
      table.string('session_id').nullable()
      
      // Timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable()
      
      // Performance indexes
      table.index(['employee_id', 'status'], 'idx_time_tracking_employee_status')
      table.index(['employee_id', 'created_at'], 'idx_time_tracking_employee_created')
      table.index(['business_id'], 'idx_time_tracking_business')
      table.index(['business_id', 'employee_id'], 'idx_time_tracking_business_employee')
      table.index(['start_time'], 'idx_time_tracking_start_time')
      table.index(['end_time'], 'idx_time_tracking_end_time')
      table.index(['start_time', 'end_time'], 'idx_time_tracking_time_range')
      table.index(['status'], 'idx_time_tracking_status')
      table.index(['status', 'created_at'], 'idx_time_tracking_status_created')
      table.index(['project_name'], 'idx_time_tracking_project')
      table.index(['task_name'], 'idx_time_tracking_task')
      table.index(['deleted_at'], 'idx_time_tracking_deleted')
      table.index(['employee_id', 'status', 'start_time'], 'idx_time_tracking_employee_status_time')
      table.index(['business_id', 'status', 'created_at'], 'idx_time_tracking_business_status_created')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}