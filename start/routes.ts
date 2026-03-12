// import router from '@adonisjs/core/services/router'


// const PurchasesController = () => import('#controllers/purchases_controller')

// router.post('/purchase', [PurchasesController, 'store'])


// const AuthController = () => import('#controllers/auth_controller')

// router.post('/login', [AuthController, 'login'])

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Rutas Públicas
router.post('/login', [() => import('#controllers/auth_controller'), 'login'])
router.post('/purchase', [() => import('#controllers/purchases_controller'), 'store'])

// Grupo de Rutas Privadas (Requieren Auth)
router.group(() => {
  
  // Solo ADMIN y GERENTE pueden ver clientes
//   router.get('/customers', [() => import('#controllers/customers_controller'), 'index'])
//     .use(middleware.role(['ADMIN', 'GERENTE']))

  // Solo ADMIN puede cambiar prioridades de pasarelas
//   router.patch('/gateways/:id/priority', [() => import('#controllers/gateways_controller'), 'updatePriority'])
//     .use(middleware.role(['ADMIN']))

  // Solo ADMIN y FINANZAS pueden hacer reembolsos
//   router.post('/transactions/:id/refund', [() => import('#controllers/refunds_controller'), 'store'])
//     .use(middleware.role(['ADMIN', 'FINANZAS']))

}).use(middleware.auth()) // Se aplica auth a todo el grupo

