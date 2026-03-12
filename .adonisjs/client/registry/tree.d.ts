/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  purchases: {
    store: typeof routes['purchases.store']
  }
}
