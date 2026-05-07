# ☕ The Daily Cup — Full-Stack Coffee Shop Delivery App

![The Daily Cup](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Railway](https://img.shields.io/badge/Backend-Railway-purple)

> **Live Demo:** [the-daily-cup.vercel.app](https://the-daily-cup.vercel.app)
> **Backend API:** [the-daily-cup-production.up.railway.app](https://the-daily-cup-production.up.railway.app)

---

## 1. 📌 Project Name

**The Daily Cup** — A modern, production-ready full-stack coffee shop delivery web application.

---

## 2. 📝 Project Description

The Daily Cup is a full-stack MERN (MongoDB, Express, React, Node.js) web application that enables customers to browse a premium coffee and food menu, place delivery orders, and track them in real time. The app also features a dedicated merchant administration portal for managing live orders, analytics, payments, and customer support tickets — all in one centralized dashboard.

---

## 3. 🧩 Problem It Solves

Local coffee shops often lack a digital ordering and delivery system. Customers are forced to call in orders or visit in person, while merchants struggle to manage orders efficiently. **The Daily Cup** solves this by providing:

- A seamless **online ordering experience** for customers
- A **real-time merchant dashboard** for order management
- A **multi-step checkout flow** with GPS-based delivery pinning
- **Live order tracking** with status updates every 5 seconds
- A **support ticket system** connecting customers with the merchant

---

## 4. ✨ Key Features

### 👤 Customer Experience
- 🔐 Register & login with JWT authentication
- ☕ Browse menu by category with search and filtering
- 🛒 Persistent cart with local storage
- 📍 GPS-based drop-off location pinning
- 💳 Multi-payment support: Cash, Credit/Debit Card, Easypaisa, JazzCash
- 📦 Multi-step checkout: Delivery Info → Payment → Order Confirmation
- 🔄 Real-time order tracking with live status polling
- 📊 Nutrition information page
- 📬 Customer support contact form with ticket system
- 🌿 Health & brand story pages

### 🏪 Merchant Portal
- 🔐 Separate merchant login system
- 📋 Live orders dashboard with real-time polling
- 🔄 Order status management: New → Preparing → Trip Started → Delivered
- 📈 Analytics with revenue and order statistics
- 💰 Payments and transaction history
- 🎧 Support ticket management
- 🛠️ Product catalog management
- 🌙 Dark/Light mode toggle
- ⏸️ Available/Paused toggle for accepting orders

---

## 5. 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **UI Components** | shadcn/ui (Radix UI) |
| **HTTP Client** | Axios |
| **Routing** | React Router v6 |
| **Notifications** | Sonner (Toast) |
| **Deployment (FE)** | Vercel |
| **Deployment (BE)** | Railway |
| **Database Hosting** | MongoDB Atlas |
| **Version Control** | Git + GitHub |

---

## 6. ⚛️ React-Specific Tools & Hooks

### Hooks Used
| Hook | Usage |
|---|---|
| `useState` | Local component state management |
| `useEffect` | API calls, polling, side effects |
| `useContext` | Consuming Auth and Cart contexts |
| `useReducer` | Complex state logic in CartContext |
| `useMemo` | Optimized filtering of products and orders |
| `useRef` | DOM references |
| `useNavigate` | Programmatic navigation |
| `useLocation` | Accessing route state between pages |
| `useParams` | Dynamic route parameters (product ID) |

### Custom Hooks
| Hook | Purpose |
|---|---|
| `useAuth` | Shortcut to access AuthContext (user, login, logout) |
| `useCart` | Shortcut to access CartContext (cart, addToCart, clearCart) |

### React Patterns Used
- **Context API** — Global state for Auth and Cart
- **Protected Routes** — Merchant-only route guards
- **Compound Components** — Reusable UI building blocks
- **Optimistic UI Updates** — Instant order status updates before API confirmation
- **Real-time Polling** — `setInterval` inside `useEffect` for live order tracking

---

## 7. 📦 Third-Party Libraries & Tools

### Frontend
| Package | Purpose |
|---|---|
| `react-router-dom` | Client-side routing |
| `framer-motion` | Page and component animations |
| `axios` | HTTP requests with JWT interceptor |
| `sonner` | Toast notifications |
| `shadcn/ui` | Pre-built accessible UI components |
| `lucide-react` | Icon library |
| `tailwindcss` | Utility-first CSS framework |
| `@tailwindcss/vite` | Tailwind Vite plugin |

### Backend
| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing (10 salt rounds) |
| `jsonwebtoken` | JWT creation and verification |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |
| `express-async-handler` | Clean async error handling |
| `nodemon` | Development auto-restart |

---

## 8. 🗂️ Project Structure Overview

The project follows a **monorepo structure** with a clean separation between frontend and backend:

```
vite-project/
├── backend/                  ← Node.js + Express (MVC Architecture)
│   ├── config/               ← MongoDB connection
│   ├── controllers/          ← Business logic (MVC Controllers)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── ticketController.js
│   ├── middleware/           ← JWT auth guards
│   │   └── authMiddleware.js
│   ├── models/               ← Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── tickets.js
│   ├── routes/               ← Thin API route mapping
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── tickets.js
│   ├── seed/                 ← Database seeders
│   ├── .env                  ← Environment variables (gitignored)
│   └── server.js             ← Express app entry point
│
└── frontend/                 ← React + Vite
    └── src/
        ├── api/              ← Axios API call modules
        │   ├── axiosConfig.js
        │   ├── orders.js
        │   ├── products.js
        │   └── tickets.js
        ├── assets/           ← Images, videos, fonts
        ├── components/       ← Reusable UI components
        │   ├── Navbar.jsx
        │   ├── CartButton.jsx
        │   ├── CartDrawer.jsx
        │   ├── ContactForm.jsx
        │   └── MerchantDashboard/
        │       ├── Sidebar.jsx
        │       └── OrderCard.jsx
        ├── context/          ← Global state providers
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── hooks/            ← Custom React hooks
        │   └── useAuth.js
        ├── pages/            ← Route-level page components
        │   ├── Landing.jsx
        │   ├── Products.jsx
        │   ├── ItemDetail.jsx
        │   ├── Checkout.jsx
        │   ├── Payment.jsx
        │   ├── OrderConfirmation.jsx
        │   ├── Orders.jsx
        │   ├── Nutrition.jsx
        │   ├── Health.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Merchant/
        │       ├── MerchantLogin.jsx
        │       ├── MerchantDashboard.jsx
        │       ├── MerchantOrderHistory.jsx
        │       ├── MerchantPayments.jsx
        │       ├── MerchantAnalytics.jsx
        │       ├── MerchantContactCare.jsx
        │       └── MerchantManageItems.jsx
        ├── App.jsx           ← Routes + global providers
        └── main.jsx          ← React entry point
```

### Architecture Pattern
The backend follows the **MVC (Model-View-Controller)** pattern:
- **Models** — Mongoose schemas defining data structure
- **Controllers** — Business logic separated from routing
- **Routes** — Thin mapping layer connecting URLs to controllers
- **React** acts as the **View** layer

---

## 9. 🚀 How to Run the Project

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/iamumerfarooq43-lab/the-daily-cup.git
cd the-daily-cup
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Seed the database:
```bash
node seed/seedProducts.js
node seed/seedMerchant.js
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the App
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Merchant Portal | http://localhost:5173/merchant/login |

---

## 10. 🎯 Target Audience

| Audience | Role |
|---|---|
| **Coffee shop customers** | Browse menu, place orders, track delivery |
| **Merchant/Admin** | Manage orders, analytics, tickets, products |
| **Recruiters & Developers** | Portfolio project showcasing MERN stack skills |
| **Internship evaluators** | Full-stack project with real-world architecture |

---

## 11. 🗺️ File Structure Flowchart

```
                        ┌─────────────────────────┐
                        │      THE DAILY CUP       │
                        │    (MERN Application)    │
                        └────────────┬────────────┘
                                     │
               ┌─────────────────────┴─────────────────────┐
               │                                           │
    ┌──────────▼──────────┐                   ┌───────────▼───────────┐
    │      FRONTEND        │                   │        BACKEND         │
    │   React + Vite       │                   │   Node.js + Express    │
    └──────────┬──────────┘                   └───────────┬───────────┘
               │                                           │
    ┌──────────▼──────────┐                   ┌───────────▼───────────┐
    │       src/           │                   │       MVC Pattern      │
    ├─────────────────────┤                   ├───────────────────────┤
    │  ├── api/            │                   │  ├── models/           │
    │  │   ├── axiosConfig │◄──── HTTP ───────►│  │   ├── User.js       │
    │  │   ├── orders.js   │      (JWT)        │  │   ├── Product.js    │
    │  │   ├── products.js │                   │  │   ├── Order.js      │
    │  │   └── tickets.js  │                   │  │   └── tickets.js    │
    │  │                   │                   │  │                     │
    │  ├── context/        │                   │  ├── controllers/      │
    │  │   ├── AuthContext │                   │  │   ├── authCtrl      │
    │  │   └── CartContext │                   │  │   ├── productCtrl   │
    │  │                   │                   │  │   ├── orderCtrl     │
    │  ├── hooks/          │                   │  │   └── ticketCtrl    │
    │  │   └── useAuth     │                   │  │                     │
    │  │                   │                   │  ├── routes/           │
    │  ├── components/     │                   │  │   ├── auth.js       │
    │  │   ├── Navbar      │                   │  │   ├── products.js   │
    │  │   ├── CartDrawer  │                   │  │   ├── orders.js     │
    │  │   └── Merchant/   │                   │  │   └── tickets.js    │
    │  │                   │                   │  │                     │
    │  └── pages/          │                   │  ├── middleware/       │
    │      ├── Landing     │                   │  │   └── authMiddleware│
    │      ├── Products    │                   │  │                     │
    │      ├── ItemDetail  │                   │  └── server.js         │
    │      ├── Checkout    │                   └───────────┬───────────┘
    │      ├── Payment     │                               │
    │      ├── Orders      │                   ┌───────────▼───────────┐
    │      └── Merchant/   │                   │     MongoDB Atlas       │
    │          ├── Login   │                   ├───────────────────────┤
    │          └── Dashboard                   │  Collections:          │
    └─────────────────────┘                   │  ├── users             │
                                               │  ├── products          │
               │                               │  ├── orders            │
               ▼                               │  └── tickets           │
    ┌─────────────────────┐                   └───────────────────────┘
    │      Vercel          │
    │  (Frontend Hosting)  │
    └─────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │      Railway         │
    │  (Backend Hosting)   │
    └─────────────────────┘
```

---

## 🔐 API Endpoints Reference

### Auth Routes `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new customer |
| POST | `/login` | Public | Login and receive JWT |

### Product Routes `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all products |
| GET | `/:id` | Public | Get single product |
| PUT | `/:id` | Merchant | Update product price/stock |

### Order Routes `/api/orders`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Create new order |
| GET | `/mine` | Customer | Get own orders |
| GET | `/` | Merchant | Get all orders |
| PUT | `/:id` | Merchant | Update order status |
| DELETE | `/:id` | Customer | Cancel order |

### Ticket Routes `/api/tickets`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit support ticket |
| GET | `/` | Merchant | Get all tickets |
| PUT | `/:id` | Merchant | Update ticket status |

---

## 👨‍💻 Developer

**Umer Farooq**
- GitHub: [@iamumerfarooq43-lab](https://github.com/iamumerfarooq43-lab)
- Stack: MERN (MongoDB, Express, React, Node.js)
- Based in Lahore, Pakistan

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ☕ and passion by Umer Farooq*
