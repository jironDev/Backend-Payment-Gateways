import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gateways'

  async up() {
    this.schema.createTable(this.tableName, (table) => {

      table.increments('id')
      table.string('name').notNullable() // Ejemplo: "Gateway 1"
      table.boolean('is_active').defaultTo(true) // Para poder apagar una pasarela
      table.integer('priority').notNullable().defaultTo(1) // 1 es más prioridad 


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}