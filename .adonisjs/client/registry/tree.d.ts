/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
  }
  purchases: {
    store: typeof routes['purchases.store']
    index: typeof routes['purchases.index']
    show: typeof routes['purchases.show']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  users: {
    index: typeof routes['users.index']
    show: typeof routes['users.show']
    store: typeof routes['users.store']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  gateways: {
    updatePriority: typeof routes['gateways.update_priority']
  }
  customers: {
    index: typeof routes['customers.index']
    show: typeof routes['customers.show']
  }
  refunds: {
    store: typeof routes['refunds.store']
  }
}
