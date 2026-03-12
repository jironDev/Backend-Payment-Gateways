import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      
      table.increments('id').primary()
      table.integer('customer_id').unsigned().references('id').inTable('customers').onDelete('CASCADE')
      table.integer('gateway_id').unsigned().references('id').inTable('gateways').nullable()
      table.string('external_id').nullable() // El ID que te dará el Mock
      table.enum('status', ['PENDING', 'COMPLETED', 'REFUNDED', 'FAILED']).defaultTo('PENDING')
      table.integer('amount').notNullable()
      table.string('last_four_digits', 4).nullable()


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}