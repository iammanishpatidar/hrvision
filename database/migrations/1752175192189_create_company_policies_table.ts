import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'company_policies'

    async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))

      table.uuid('business_id').notNullable()
        .references('id')
        .inTable('businesses')
        .onDelete('CASCADE')

      table.string('policy_name').notNullable()
      table.text('description').nullable()
      table.string('file_path').notNullable()

      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
