import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// --- 🔓 PUBLIC ROUTES ---
router.post('/login', [() => import('#controllers/auth_controller'), 'login'])
router.post('/purchase', [() => import('#controllers/purchases_controller'), 'store'])

// --- 🔐 PRIVATE ROUTES (Require being logged in) ---
router.group(() => {

  // 🛍️ PRODUCTS: CRUD with especific roles
  router.get('/products', [() => import('#controllers/products_controller'), 'index'])
  router.post('/products', [() => import('#controllers/products_controller'), 'store'])
    .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS']))
  router.put('/products/:id', [() => import('#controllers/products_controller'), 'update'])
    .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS']))
  router.delete('/products/:id', [() => import('#controllers/products_controller'), 'destroy'])
    .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS']))

  // 👥 USERS: Just autohrized roles
  router.group(() => {
    router.get('/users', [() => import('#controllers/users_controller'), 'index'])
    router.get('/users/:id', [() => import('#controllers/users_controller'), 'show'])
    router.post('/users', [() => import('#controllers/users_controller'), 'store'])
    router.put('/users/:id', [() => import('#controllers/users_controller'), 'update'])
    router.delete('/users/:id', [() => import('#controllers/users_controller'), 'destroy'])
  }).use(middleware.role(['ADMIN', 'GERENTE']))

  // 💳 GATEWAYS
  router.patch('/gateways/:id/priority', [() => import('#controllers/gateways_controller'), 'updatePriority'])
    .use(middleware.role(['ADMIN']))

    // 📈 CUSTOMERS REPORTS
  router.get('/customers', [() => import('#controllers/customers_controller'), 'index'])
    .use(middleware.role(['ADMIN', 'GERENTE']))

    router.get('/customers/:id', [() => import('#controllers/customers_controller'), 'show'])
  .use(middleware.role(['ADMIN', 'GERENTE']))

  // 🧾 SALES REPORTS    
  router.get('/transactions', [() => import('#controllers/purchases_controller'), 'index'])
    .use(middleware.role(['ADMIN', 'FINANZAS']))
  
 router.get('/transactions/:id', [() => import('#controllers/purchases_controller'), 'show'])
  .use(middleware.role(['ADMIN', 'GERENTE', 'FINANZAS'])) 

  // 💸 REFUNDS
  router.post('/transactions/:id/refund', [() => import('#controllers/refunds_controller'), 'store'])
    .use(middleware.role(['ADMIN', 'FINANZAS']))

}).use(middleware.auth())