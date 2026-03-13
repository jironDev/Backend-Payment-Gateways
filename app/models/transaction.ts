import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import Gateway from '#models/gateway'
import TransactionProduct from '#models/transaction_product'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number

  @column()
  declare gatewayId: number | null

  @column()
  declare externalId: string | null

  @column()
  declare status: 'PENDING' | 'COMPLETED' | 'REFUNDED' | 'FAILED'

  @column()
  declare amount: number

  @column()
  declare lastFourDigits: string | null

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  // Related to the pivot table that connects transactions and products, to know what was bought in this transaction
  @hasMany(() => TransactionProduct)
  declare transactionProducts: HasMany<typeof TransactionProduct>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
