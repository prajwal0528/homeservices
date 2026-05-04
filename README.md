# 🏠 HomeServices — Full Stack MERN + AI Platform

> Urban Company clone with AI (Anthropic Claude), MERN stack, UPI payments, email notifications, and dual admin/user login.

---

## 📁 Project Structure

```
homeservices/
├── backend/              ← Express + MongoDB
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── serviceController.js
│   │   ├── reviewController.js
│   │   ├── faqController.js
│   │   ├── paymentController.js
│   │   ├── aiController.js
│   │   └── adminController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── FAQ.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   ├── faqs.js
│   │   ├── payments.js
│   │   ├── ai.js
│   │   └── admin.js
│   ├── utils/email.js
│   ├── seeder.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/             ← React 18
    ├── public/index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/Navbar.js
    │   │   └── user/ServiceCard.js
    │   ├── context/AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── FAQ.js
    │   │   ├── user/
    │   │   │   ├── Services.js
    │   │   │   ├── ServiceDetail.js
    │   │   │   ├── Dashboard.js
    │   │   │   └── AIChat.js
    │   │   └── admin/
    │   │       └── AdminDashboard.js
    │   ├── styles/global.css
    │   ├── utils/api.js
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure these are installed on your system:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | (comes with Node) |
| MongoDB Compass | Latest | https://www.mongodb.com/products/compass |
| VS Code | Latest | https://code.visualstudio.com |

---

## 🚀 Complete Setup (Step-by-Step in VS Code)

### Step 1 — Start MongoDB

1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. It will auto-create the `homeservices` database when data is first inserted

---

### Step 2 — Configure Backend Environment

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/homeservices
JWT_SECRET=homeservices_super_secret_jwt_key_2024
JWT_EXPIRE=7d

# Gmail SMTP — Enable "App Password" in Google Account > Security
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password

# Anthropic API key (from your app.py — os.getenv("API_KEY"))
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514

CLIENT_URL=http://localhost:3000
```

**To get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords" → Create new → Copy the 16-char password

---

### Step 3 — Install & Run Backend

Open **Terminal 1** in VS Code (`Ctrl+`` `):

```bash
# Navigate to backend folder
cd homeservices/backend

# Install all dependencies
npm install

# Seed the database with 35+ services and 12 FAQs
node seeder.js

# Start the backend server
npm run dev
```

✅ You should see:
```
=======================================================
  🏠 HomeServices API Server v1.0
  🚀 Running on: http://localhost:5000
  📦 Database: MongoDB Compass
  🤖 AI: Anthropic Claude
=======================================================
✅ MongoDB Connected: localhost
```

---

### Step 4 — Install & Run Frontend

Open **Terminal 2** in VS Code (`Ctrl+Shift+`` `):

```bash
# Navigate to frontend folder
cd homeservices/frontend

# Install all dependencies
npm install

# Start the React development server
npm start
```

✅ Browser opens at: `http://localhost:3000`

---

## 🔑 Login Credentials

| Role | Username/Email | Password |
|------|---------------|----------|
| **Admin** | `admin` | `admin@123` |
| **User** | Register with email | Your chosen password |

---

## 🌐 All API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (user or admin) |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/auth/save-service/:id` | Toggle saved service |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all (with filters) |
| GET | `/api/services/:id` | Get single service |
| GET | `/api/services/category/:cat` | By category |
| GET | `/api/services/categories/all` | All categories |
| POST | `/api/services` | Create (Admin) |
| PUT | `/api/services/:id` | Update (Admin) |
| DELETE | `/api/services/:id` | Deactivate (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | My bookings |
| GET | `/api/bookings/:id` | Single booking |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| GET | `/api/bookings/admin/all` | All bookings (Admin) |
| GET | `/api/bookings/admin/stats` | Stats (Admin) |
| PUT | `/api/bookings/admin/:id/status` | Update status (Admin) ← sends email |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | HomeBot chat |
| POST | `/api/ai/recommend` | Personalized recs |
| POST | `/api/ai/smart-search` | AI-powered search |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Get UPI payment links |
| POST | `/api/payments/verify` | Verify transaction ID |
| GET | `/api/payments/history` | Payment history |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit review |
| GET | `/api/reviews/service/:id` | Service reviews |
| GET | `/api/reviews/admin/all` | All reviews (Admin) |

---

## 💡 Key Features

### ✅ Implemented
- **User Auth** — Register/login with email + mobile + password. JWT tokens.
- **Admin Login** — Hardcoded `admin / admin@123`. Access full admin panel.
- **35+ Services** seeded across 7 categories with real pricing
- **Booking System** — Date picker, time slots, address, booking type
- **UPI Payments** — Redirects to Google Pay, PhonePe, Paytm, Amazon Pay. Transaction ID verification.
- **Email Notifications** — Booking confirmation + every status update sends email to user
- **Admin Dashboard** — View all bookings, update status, manage users, manage services
- **AI Chat (HomeBot)** — Powered by Anthropic Claude API. Full conversation support.
- **AI Recommendations** — Personalized service recommendations
- **AI Smart Search** — Natural language search ("fix my leaky pipe" → Plumbing)
- **Reviews System** — Rate and review completed bookings
- **FAQ Section** — Searchable, collapsible FAQ cards
- **Saved Services** — Bookmark favourite services
- **Responsive UI** — Works on mobile, tablet, desktop

### 🔧 Customization
- Add your real UPI ID in `backend/controllers/paymentController.js` (line 19)
- Update `ANTHROPIC_API_KEY` in `.env` with the API key from your `app.py`
- Configure Gmail SMTP for real email delivery

---

## 🛠 Troubleshooting

**MongoDB won't connect:**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Port 5000 in use:**
```bash
# Change PORT in backend/.env to 5001
PORT=5001
# Also update frontend/.env
REACT_APP_API_URL=http://localhost:5001/api
```

**Email not sending:**
- Check Gmail App Password (not your Gmail password)
- Enable "Less secure app access" or use App Password
- Test with: `node -e "require('./utils/email').sendEmail({to:'test@test.com',subject:'Test',html:'<p>Test</p>'})`

**npm install fails:**
```bash
npm install --legacy-peer-deps
```

---

## 📧 Email Flow

| Event | Trigger | Email Sent |
|-------|---------|-----------|
| Registration | User signs up | Welcome email |
| Booking Created | User books service | Booking confirmation |
| Status Updated | Admin changes status | Status update email |
| User Cancels | User cancels booking | Cancellation email |

Every email uses beautiful HTML templates with booking details.
