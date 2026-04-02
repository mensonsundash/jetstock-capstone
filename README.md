# JetStock — Inventory & Product Management Application

> A lightweight, full-stack inventory management web application built for small businesses to track products, stock, categories, and suppliers — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
---

## Overview

**JetStock** solves a common problem for small business owners: managing inventory manually through spreadsheets and notebooks is inefficient, error-prone, and hard to scale. JetStock provides a clean, centralised web interface to:

- Manage products, categories, and suppliers
- Track real-time stock quantities
- Dashboard view to users when stock falls below reorder thresholds
- Log every stock movement (in/out) with full audit trail
- Handle customer orders through an integrated order management system
- Expose a public-facing product listing via **JetStore** (the external storefront)

---

## Features

### Core Features
| Feature | Description |
|---|---|
| Authentication | JWT-based registration and login with protected routes |
| Product Management | Full CRUD — add, edit, view, delete products with SKU, price, category, supplier |
| Category Management | Create and organise product categories |
| Supplier Management | Store and manage supplier contact details |
| Inventory Control | Real-time quantity tracking with low-stock and out-of-stock alerts |
| Stock Movements | Log stock IN/OUT with source type: MANUAL, ONLINE, DAMAGE, RETURN |
| Order Management | Create and track customer orders with full order item details |
| Dashboard | Summary view — total products, low-stock count, inventory overview |
| Search & Filter | Find products by name or SKU; filter by category |
| Products Pagination | Paginated listing pages for performance |

### Extended Features
- CSV export
- Image upload
- Theme modes
- Role-based access control (admin / user)
- Charts and analytics (planned)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, JavaScript (ES6), HTML5, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Authentication** | JWT (jsonwebtoken), bcrypt |
| **HTTP Client** | Axios |
| **Testing** | Jest (unit), Postman (API) |
| **Version Control** | GitHub |

---

## System Architecture

```
User
 │
 ▼
┌─────────────────────┐          ┌──────────────────────┐
│      Client         │          │       Server          │
│                     │          │                       │
│  JetStock (React)   │◄────────►│  JetStock Server     │
│  JetStore (HTML)    │  API     │  (Node.js + Express)  │
│                     │          │          │            │
└─────────────────────┘          │          ▼            │
                                 │      MySQL DB         │
                                 └──────────────────────┘
```

- **JetStock** — The React-based admin interface for business owners
- **JetStore** — A plain HTML/CSS/JS external storefront for product listings
- **JetStock Server** — Node.js/Express REST API following MVC architecture
- **MySQL** — Relational database storing all business data

---

## Database Design

The database consists of **9 relational tables**:

| Table | Purpose |
|---|---|
| `users` | Business owner and staff accounts (role: admin / user) |
| `products` | Core product records — SKU, name, price, category, supplier |
| `categories` | Product categories linked to users |
| `suppliers` | Supplier contact details |
| `inventory` | Real-time quantity on hand and reorder levels per product |
| `stock_movements` | Full audit log of every stock IN/OUT event |
| `customers` | Customer records for order management |
| `orders` | Customer orders with status tracking |
| `order_items` | Line items within each order |

ERD diagram: [View on Draw.io](https://drive.google.com/file/d/1HupjjxbfYEgbygMS7iAcHn4O365Hqnl0/view?usp=sharing)

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8+
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/[your-username]/jetstock.git
cd jetstock
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create your `.env` file (see [Environment Variables](#environment-variables)).

Run database migrations / dump:
create admin as one user if all user movement view required


Start the server:
```bash
npm run dev
```

The backend runs on `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd client
npm install
npm start
```

The frontend runs on `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the `/server` directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jetstock
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products (with search/filter/pagination) |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |

### Suppliers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/suppliers` | Get all suppliers |
| POST | `/api/suppliers` | Create a supplier |
| PUT | `/api/suppliers/:id` | Update a supplier |
| DELETE | `/api/suppliers/:id` | Delete a supplier |

### Inventory & Stock
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory` | Get all inventory (with low-stock filter) |
| POST | `/api/stock-movements/in` | Record a stock IN movement |
| POST | `/api/stock-movements/out` | Record a stock OUT movement |
| GET | `/api/stock-movements` | Get stock movement history |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Create a new order |
| PUT | `/api/orders/:id` | Update order status |
| GET | `/api/customers` | Get all customers |
| POST | `/api/customers` | Create a customer |

> All routes (except auth) require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## Testing

### Unit Tests (Jest)

```bash
cd server
npm test
```

Tests cover:
- Product, Category, Supplier, Inventory CRUD operations
- Stock movement quantity calculations
- Authentication middleware (JWT validation)
- Input validation and error handling

### API Tests (Postman)
Test all api frmo postman

---

## Project Structure

```
jetstock/
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios API calls
│   │   ├── app/             # App context provider
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── context/         # Auth context (global state)
│   │   ├── hooks/           # Reusable Hooks
│   │   ├── test/            # Vitest cases
│   │   ├── utils/           # Storage: token
│   │   └── App.jsx
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── controllers/         # Request handlers
│   ├── models/              # Database queries
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── middleware/          # Auth, validation, error handling
│   ├── tests/               # Jest unit tests
│   └── index.js
│
├── jetstore/                # External storefront (HTML/CSS/JS)
│   └── index.html
│
└── README.md
```

---

## Designs


Wireframe designs: [View on Figma](https://www.figma.com/proto/BI3GKjDIRTp2sso2760ZbR/JetStock-Capston)

---

## Capstone Project

This project was built as part of the **Software Engineering Capstone** at Institute of Data.

- **Project Duration:** March 13 – March 31, 2026
- **Tasks Completed:** 24 / 24 ✅
- **Deliverables:** Code (GitHub), Project Document, Presentation & Demo

---

*Built with Slepless night and lots of console.log() debugging.*