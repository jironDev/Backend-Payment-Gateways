/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'purchases.store': {
    methods: ["POST"]
    pattern: '/purchase'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/purchase').purchaseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/purchase').purchaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
