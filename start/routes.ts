import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// --- 🔓 RUTAS PÚBLICAS ---
router.post('/login', [() => import('#controllers/auth_controller'), 'login'])
router.post('/purchase', [() => import('#controllers/purchases_controller'), 'store'])

// --- 🔐 RUTAS PRIVADAS (Requieren estar logueado) ---
router.group(() => {

  // 🛍️ PRODUCTOS: CRUD con roles específicos
  router.get('/products', [() => import('#controllers/products_controller'), 'index'])
  router.post('/products', [() => import('#controllers/products_controller'), 'store'])
    .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS']))
  router.put('/products/:id', [() => import('#controllers/products_controller'), 'update'])
    .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS']))
  router.delete('/products/:id', [() => import('#controllers/products_controller'), 'destroy'])
    .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS']))

  // 👥 USUARIOS: Solo personal de gestión
  router.group(() => {
    router.get('/users', [() => import('#controllers/users_controller'), 'index'])
    router.get('/users/:id', [() => import('#controllers/users_controller'), 'show'])
    router.post('/users', [() => import('#controllers/users_controller'), 'store'])
    router.put('/users/:id', [() => import('#controllers/users_controller'), 'update'])
    router.delete('/users/:id', [() => import('#controllers/users_controller'), 'destroy'])
  }).use(middleware.role(['ADMIN', 'GERENTE']))

  // 💳 GESTIÓN DE PASARELAS (GATEWAYS)
  router.patch('/gateways/:id/priority', [() => import('#controllers/gateways_controller'), 'updatePriority'])
    .use(middleware.role(['ADMIN']))

  // 📊 LISTADOS Y CLIENTES
  router.get('/customers', [() => import('#controllers/customers_controller'), 'index'])
    .use(middleware.role(['ADMIN', 'GERENTE']))

    router.get('/customers/:id', [() => import('#controllers/customers_controller'), 'show'])
  .use(middleware.role(['ADMIN', 'GERENTE']))

  // 🧾 TRANSACCIONES    
  router.get('/transactions', [() => import('#controllers/purchases_controller'), 'index'])
    .use(middleware.role(['ADMIN', 'FINANZAS']))
  
 router.get('/transactions/:id', [() => import('#controllers/purchases_controller'), 'show'])
  .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS'])) 

  // 💸 REEMBOLSOS
  router.post('/transactions/:id/refund', [() => import('#controllers/refunds_controller'), 'store'])
    .use(middleware.role(['ADMIN', 'FINANZAS']))

}).use(middleware.auth())