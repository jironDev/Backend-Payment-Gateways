
# 💳 Multi-Gateway Payment API (Level 3 Implementation)

This project is a robust, production-ready RESTful API built with  **AdonisJS 6**,  **MySQL**, and  **Docker**. It manages payments through multiple gateways with automated failover logic, role-based access control (RBAC), and backend-calculated transaction amounts.


## 🎯 High-Level Architecture

The following patterns and standards were implemented:

-   **Strategy Pattern**: Each payment gateway (Gateway 1 & 2) is encapsulated in its own Provider class. This ensures the system is modular and can scale to new gateways without modifying the core business logic.
-   **Automated Failover**: The  `PaymentService`  orchestrates a retry loop based on gateway priority defined in the database. If the primary gateway fails, the system automatically attempts the next one before reporting an error.
-   **Secure Backend Calculations**: To prevent data tampering, the API ignores price data from the client. It fetches product prices directly from the database to calculate the final transaction amount.
-   **RBAC (Role-Based Access Control)**: A custom middleware validates user roles (`ADMIN`,  `GERENTE`,  `FINANZAS`,  `USUARIO`) before granting access to sensitive routes.
-   **Database Integrity**: All critical operations (transaction creation and product mapping) are wrapped in  **SQL Transactions**  to ensure atomicity.


## 📋 Requirements

-   **Docker**  and  **Docker Compose**  installed.
-   (Optional)  **Node.js 24+**  for local development.


## 🚀 Installation and Execution

The project is fully dockerized. Simply run the following command to spin up the entire stack (API, MySQL, and Payment Mocks):

bash
```
docker-compose up --build
```

Usa el código con precaución.

The system will automatically:

1.  Launch  **MySQL 8.0**  and wait for it to be healthy.
2.  Launch the  **Payment Mocks**  (Gateways 1 & 2).
3.  Compile TypeScript to JavaScript.
4.  Run all  **Database Migrations**.
5.  Seed the database with initial products, gateways, and test users.

**Base URL**:  `http://localhost:3333`


## 🔑 Test Credentials

|    Role        |Email                       |Password    |Permissions                  |
|----------------|----------------------------|------------|-----------------------------|
|**ADMIN**       |`admin@test.com`            |password123 | Full access to all routes.  |
|**USUARIO**     |`user@test.com`             |password123 | Public routes and purchases.|


## 🛣️ API Route Details

Public Routes

-   `POST /login`: Authenticates user and returns an Opaque Bearer Token.
-   `POST /purchase`: Processes a payment. Accepts product IDs and quantities.

Private Routes (Authenticated)

-   `GET /customers`: Lists all customers and their purchase history (Preloaded).
-   `GET /transactions`: Lists all platform transactions (Finance audit).
-   `POST /transactions/:id/refund`: Processes a refund through the original gateway.
-   `PATCH /gateways/:id/priority`: Enables/disables or changes gateway priority.
-   `GET/POST/PUT/DELETE /products`: Full CRUD for product management.
-   `GET/POST/PUT/DELETE /users`: Full CRUD for staff management.


## 🧪 Automated Testing (TDD)

The project includes a functional test suite covering the most critical business rules:

-   **Failover Logic**: Verifies that if Gateway 1 fails, Gateway 2 processes the payment.
-   **RBAC Security**: Ensures unauthorized roles cannot access sensitive data.
-   **Price Integrity**: Confirms the backend ignores manipulated prices from the request.

**Run tests inside Docker:**

bash
```
docker-compose exec app node ace test
```

## 📝 Evaluation Criteria Fulfillment

-   **Programming Logic**: Implementation of a clean retry loop for gateways and robust error handling for foreign APIs (English vs. Portuguese formats).
-   **Organization & Readability**: Strict adherence to AdonisJS 6 structure (Controllers, Services, Providers, Validators).
-   **Data Validation**: Every request is strictly validated using  **VineJS**  before processing.
-   **Sensitive Data Handling**: Passwords are hashed using  `scrypt`, and only the last four digits of credit cards are stored for PCI compliance.
-   **Documentation**: Clear installation steps and architectural justification provided here.