# CheckInPass

<div align="center">

### Hotel Booking & Management Platform

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Mongoose](https://img.shields.io/badge/Mongoose-9.x-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-072654?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**CheckInPass** is a full-stack hotel booking and property management platform that bridges guests and hotel owners — featuring real-time room availability, Razorpay-powered online payments, Cloudinary image hosting, Google OAuth authentication, booking confirmation emails, and a dedicated hotel-owner dashboard for managing rooms and reservations.

[Live Demo](https://checkinpass.vercel.app) · [Report a Bug](https://github.com/Vans30m/CheckInPass/issues)

</div>

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Payment Flow (Razorpay)](#payment-flow-razorpay)
- [Image Upload Flow (Cloudinary)](#image-upload-flow-cloudinary)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Deployment (Vercel)](#deployment-vercel)
- [Security Architecture](#security-architecture)
- [Upcoming Features](#upcoming-features)

---

## System Overview

**Problem Solved:** Independent hotel owners and small chains lack an affordable, all-in-one platform to list rooms, manage real-time availability, accept online payments, and communicate with guests — forcing them to rely on expensive third-party OTAs.

**Core Mission:** Provide a self-hosted, open-source alternative that puts hotel owners in full control of their property listings and guest experience, while offering travelers a seamless, modern booking interface.

**Target Audience:** Independent hotel owners, B&B operators, and travelers seeking direct, commission-free room bookings.

**Architecture Paradigm:** Monorepo with a clear frontend–backend separation:
- `frontend/` → React SPA (Vite + Tailwind CSS v4)
- `backend/` → Express REST API (Node.js + Mongoose ODM)

---

## Architecture

```
+----------------------------------------------------------------------+
|                         CLIENT LAYER                                 |
|                                                                      |
|   +------------------------------------------------------------+     |
|   |   React SPA (Vite + JSX)                                   |     |
|   |   React Router v7 · Tailwind CSS v4 · React Hot Toast      |     |
|   |   @react-oauth/google · jwt-decode · axios                 |     |
|   +-----------------------------+------------------------------+     |
+----------------------------------------------------------------------+
                 |  HTTPS REST (JWT Bearer)
                 v
+----------------------------------------------------------------------+
|                    API LAYER (Express 5)                             |
|                                                                      |
|  +-----------+ +----------+ +----------+ +------------------+       |
|  |  /api/user| |/api/hotels| |/api/rooms| |  /api/bookings  |       |
|  +-----------+ +----------+ +----------+ +------------------+       |
|                                                                      |
|  Middleware Stack:                                                   |
|  [CORS] -> [express.json] -> [apiLimiter] -> [authLimiter]          |
|  -> [protect (JWT)] -> [upload (Multer)]                             |
+---+----------------------------------+-------------------------------+
    |                                  |
    v                                  v
+-------------------+      +---------------------------+
|   MongoDB Atlas   |      |   External Services       |
|   (Mongoose ODM)  |      |                           |
|   4 Collections:  |      |  Cloudinary  (Images)     |
|   User · Hotel    |      |  Razorpay    (Payments)   |
|   Room · Booking  |      |  Nodemailer  (Email)      |
+-------------------+      |  Google OAuth 2.0         |
                           +---------------------------+
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | `^19.2.8` | Core UI framework |
| Vite | `^6.2.0` | Build tool & dev server |
| React Router DOM | `^7.18.2` | Client-side routing |
| Tailwind CSS | `^4.3.3` | Utility-first styling (v4 via Vite plugin) |
| `@tailwindcss/vite` | `^4.3.3` | Vite integration for Tailwind v4 |
| `@react-oauth/google` | `^0.13.5` | Google OAuth 2.0 client |
| `jwt-decode` | `^4.0.0` | Decode JWT claims on the client |
| `axios` | `^1.20.0` | HTTP client for API calls |
| React Hot Toast | `^2.6.1` | Toast notification system |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | `20.x` | Runtime environment |
| Express | `^5.2.1` | HTTP framework |
| `mongoose` | `^9.9.5` | MongoDB ODM with schema validation |
| `jsonwebtoken` | `^9.0.3` | JWT issuance & verification |
| `google-auth-library` | `^11.0.2` | Server-side Google OAuth token verification |
| `cloudinary` | `^2.11.0` | Cloud image storage & transformation |
| `multer` | `^2.3.0` | Multipart form handling for image uploads |
| `nodemailer` | `^10.0.10` | SMTP transactional email (booking confirmations) |
| `express-rate-limit` | `^8.7.0` | IP-based rate limiting |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing |
| `dotenv` | `^17.4.2` | Environment variable loading |
| `nodemon` | `^3.1.14` | Hot-reload dev runner |

### Database

| Technology | Details | Purpose |
|---|---|---|
| MongoDB Atlas | Hosted cluster | Primary document database |
| Mongoose | `^9.9.5` | Schema definition, validation, relationships |

### Payments & External APIs

| Service | Role |
|---|---|
| **Razorpay** | INR payment gateway — order creation, webhook verification, UPI / Card / Netbanking |
| **Cloudinary** | Room image CDN — upload, resize, optimize |
| **Google OAuth 2.0** | Passwordless authentication |
| **Nodemailer / SMTP** | Booking confirmation & notification emails |

### DevOps & Deployment

| Tool | Purpose |
|---|---|
| Vercel | Serverless backend (`@vercel/node`) + static frontend hosting |
| `vercel.json` | Route all API traffic through `server/server.js` |
| `concurrently` | Run client + server simultaneously in dev mode |
| `npm run install:all` | One-command full-stack dependency install |

---

## Directory Structure

```
CheckInPass/
+-- package.json                  # Root: concurrently scripts (dev, build, start)
+-- vercel.json                   # Vercel IaC: routes all requests -> server/server.js
+-- LICENSE
|
+-- client/                       # React + Vite SPA
|   +-- index.html
|   +-- vite.config.js            # Vite config with Tailwind v4 plugin
|   +-- vercel.json               # SPA fallback: /* -> /index.html
|   +-- src/
|       +-- App.jsx               # Root: routing, layout, auth-guard, Toaster
|       +-- main.jsx              # Entry: React root, GoogleOAuthProvider, Providers
|       +-- index.css             # Global styles + Tailwind directives
|       +-- assets/
|       |   +-- assets.js         # Static assets, dummy room data, image imports
|       +-- context/
|       |   +-- Auth.jsx          # AuthContext: Google token decode, JWT storage
|       |   +-- AppContext.jsx    # AppContext: rooms, user role, hotel reg modal
|       +-- components/
|       |   +-- Navbar.jsx               # Responsive nav: auth state, owner toggle
|       |   +-- Hero.jsx                 # Landing hero with city search & date picker
|       |   +-- FeaturedDestination.jsx  # Popular city destination cards
|       |   +-- RecommendedHotels.jsx    # Filtered room cards grid
|       |   +-- HotelCard.jsx            # Individual room card with price & amenities
|       |   +-- ExclusiveOffers.jsx      # Promotional offer banners
|       |   +-- Testimonial.jsx          # Guest review section
|       |   +-- NewsLetter.jsx           # Email subscription CTA
|       |   +-- Footer.jsx               # Site footer with links
|       |   +-- HotelReg.jsx             # Hotel registration modal (overlay)
|       |   +-- StarRating.jsx           # Reusable star rating display
|       |   +-- Title.jsx                # Reusable section title component
|       +-- pages/
|           +-- Home.jsx          # Landing: Hero + Featured + Recommended + Offers
|           +-- About.jsx         # Team, mission, and platform story
|           +-- Login.jsx         # Google OAuth sign-in page
|           +-- AllRooms.jsx      # Searchable, filterable room listing
|           +-- RoomDetails.jsx   # Room detail: gallery, amenities, booking form
|           +-- MyBookings.jsx    # Guest's booking history with status & payment
|           +-- Experience.jsx    # (*) Upcoming: curated travel experiences
|           +-- hotelOwner/
|               +-- Layout.jsx    # Hotel owner shell layout with sidebar nav
|               +-- Dashboard.jsx # Stats: total bookings, revenue, recent bookings
|               +-- AddRoom.jsx   # Room creation form with Cloudinary image upload
|               +-- ListRoom.jsx  # Room list with availability toggle
|
+-- server/                       # Express REST API
    +-- server.js                 # Bootstrap: DB, Cloudinary, middleware chain, routes
    +-- config/
    |   +-- db.js                 # Mongoose connection with retry logic
    |   +-- cloudinary.js         # Cloudinary SDK initialization
    |   +-- nodemailer.js         # SMTP transporter setup
    +-- middleware/
    |   +-- authMiddleware.js     # protect: JWT verify, attach req.user
    |   +-- uploadMiddleware.js   # Multer: memory storage for Cloudinary pipeline
    +-- models/
    |   +-- User.js               # User schema (Google sub as _id)
    |   +-- Hotel.js              # Hotel schema (owner ref)
    |   +-- Room.js               # Room schema (hotel ref, images[], amenities[])
    |   +-- Booking.js            # Booking schema (user, room, hotel + payment)
    +-- controllers/
    |   +-- userController.js     # Google OAuth, user data, recent city search
    |   +-- hotelControllers.js   # Hotel registration
    |   +-- roomController.js     # Room CRUD, Cloudinary upload, toggle availability
    |   +-- bookingController.js  # Availability check, book, pay, list bookings
    +-- routes/
        +-- userRoutes.js         # /api/user
        +-- hotelRoutes.js        # /api/hotels
        +-- roomRoutes.js         # /api/rooms
        +-- bookingRoutes.js      # /api/bookings
```

---

## Database Schema

The database is a **MongoDB Atlas** cluster managed via **Mongoose v9**.

### Core Models

#### `User`
Authenticated via Google OAuth. The Google `sub` claim is used as the document `_id`.

| Field | Type | Notes |
|---|---|---|
| `_id` | `String` | Google OAuth `sub` — primary key |
| `username` | `String` | Display name from Google profile |
| `email` | `String` | Google account email |
| `image` | `String` | Google profile picture URL |
| `role` | `String` enum | `"user"` (default) or `"hotelOwner"` |
| `recentSearchedCities` | `[String]` | Last searched city names (personalization) |
| `createdAt` / `updatedAt` | `Date` | Auto-managed timestamps |

#### `Hotel`
A hotel property owned by a registered hotel-owner user.

| Field | Type | Notes |
|---|---|---|
| `name` | `String` | Hotel display name |
| `address` | `String` | Full street address |
| `contact` | `String` | Contact phone number |
| `city` | `String` | City; used for location filtering |
| `owner` | `String` ref `User` | Owning user's Google `sub` ID |
| `createdAt` / `updatedAt` | `Date` | Auto-managed timestamps |

#### `Room`
An individual bookable room within a hotel.

| Field | Type | Notes |
|---|---|---|
| `hotel` | `String` ref `Hotel` | Parent hotel reference |
| `roomType` | `String` | e.g. `"Single"`, `"Deluxe"`, `"Suite"` |
| `pricePerNight` | `String` | Nightly rate (INR for Razorpay flows) |
| `amenities` | `Array` | Feature list (WiFi, AC, Pool, etc.) |
| `images` | `[String]` | Cloudinary secure URLs (up to 4) |
| `isAvailable` | `Boolean` | Toggle availability; default `true` |
| `createdAt` / `updatedAt` | `Date` | Auto-managed timestamps |

#### `Booking`
A reservation record linking guest, room, and hotel.

| Field | Type | Notes |
|---|---|---|
| `user` | `String` ref `User` | Guest's Google `sub` ID |
| `room` | `String` ref `Room` | Booked room reference |
| `hotel` | `String` ref `Hotel` | Hotel reference (denormalized for dashboard queries) |
| `checkInDate` | `Date` | Arrival date |
| `checkOutDate` | `Date` | Departure date |
| `totalPrice` | `Number` | `pricePerNight × nights` |
| `guest` | `Number` | Number of guests |
| `status` | `String` enum | `"pending"` (default), `"confirmed"`, `"cancelled"` |
| `paymentMethod` | `String` enum | `"Pay at Hotel"` (default), `"UPI"`, `"Card"` |
| `isPaid` | `Boolean` | Set `true` after Razorpay success; default `false` |
| `createdAt` / `updatedAt` | `Date` | Auto-managed timestamps |

### Entity Relationship Overview

```
User --1:1--> Hotel --1:N--> Room
  |                            |
  +--1:N--> Booking <----------+
              |
              +--> refs Hotel (denormalized)
```

---

## API Reference

All routes are served from the backend base URL (default: `http://localhost:3000`).

> **Auth Header:** `Authorization: Bearer <jwt_token>`
> Lock icon = Requires authentication

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Returns `"API is working correctly"` |
| `GET` | `/health` | Returns `{ status: "ok", timestamp }` |

---

### Users — `/api/user/`

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| `POST` | `/api/user/google-auth` | `{ credential }` | No | Verify Google ID token, upsert User document, return signed JWT |
| `GET` | `/api/user/` | — | Lock | Return authenticated user's profile data and role |
| `POST` | `/api/user/store-recent-search` | `{ city }` | Lock | Append city to `recentSearchedCities` (max 5, deduplicated) |

---

### Hotels — `/api/hotels/`

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| `POST` | `/api/hotels/` | `{ name, address, contact, city }` | Lock | Register a new hotel; sets the caller's role to `"hotelOwner"` |

---

### Rooms — `/api/rooms/`

| Method | Endpoint | Body / Query | Auth | Description |
|---|---|---|---|---|
| `GET` | `/api/rooms/` | — | No | Fetch all available rooms, populated with hotel data |
| `GET` | `/api/rooms/owner` | — | Lock | Fetch all rooms for the authenticated owner's hotel |
| `POST` | `/api/rooms/` | `multipart/form-data: { roomType, pricePerNight, amenities[], images[] }` | Lock | Create room — upload up to 4 images to Cloudinary, save URLs to DB |
| `POST` | `/api/rooms/toggle-availability` | `{ roomId }` | Lock | Flip `isAvailable` boolean for a specific room |

---

### Bookings — `/api/bookings/`

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| `POST` | `/api/bookings/checkAvailability` | `{ room, checkInDate, checkOutDate }` | No | Check if room has no overlapping bookings for the given date range |
| `POST` | `/api/bookings/book` | `{ room, checkInDate, checkOutDate, guests }` | Lock | Create booking; re-validates availability, calculates `totalPrice = pricePerNight × nights` |
| `POST` | `/api/bookings/pay` | `{ bookingId }` | Lock | Mark `isPaid = true`, `status = "confirmed"`, send confirmation email |
| `GET` | `/api/bookings/user` | — | Lock | Return all bookings for the authenticated guest |
| `GET` | `/api/bookings/hotel` | — | Lock | Return all bookings for the owner's hotel + `totalBookings` and `totalRevenue` aggregates |

---

## Authentication Flow

CheckInPass uses **Google OAuth 2.0** as the sole authentication provider — no passwords needed.

```
1. Frontend: User clicks "Sign in with Google"
   +-- @react-oauth/google returns a Google credential (ID token)

2. Frontend: POST /api/user/google-auth { credential }

3. Backend (userController.googleAuth):
   +-- google-auth-library verifies the ID token against Google's public keys
   +-- Extracts { sub, name, email, picture } from the verified payload
   +-- Upsert: User.findByIdAndUpdate({ _id: sub }, ..., { upsert: true })
   +-- Signs and returns a JWT: { userId: sub, exp: 30 days }

4. Frontend (Auth.jsx):
   +-- Stores JWT in localStorage
   +-- jwt-decode decodes the token to extract user info
   +-- Provides { user, token } via AuthContext

5. Subsequent API calls:
   +-- Authorization: Bearer <jwt> header on all protected routes

6. Backend (authMiddleware.protect):
   +-- jwt.verify(token, JWT_SECRET)
   +-- User.findById(decoded.userId) -> attaches as req.user
   +-- next() -> controller runs
```

---

## Payment Flow (Razorpay)

CheckInPass integrates **Razorpay** for secure online payments (UPI, Cards, Netbanking).

```
1. Guest selects "Pay Online" on the booking confirmation page

2. Frontend: POST /api/bookings/book
   +-- receives { bookingId, totalPrice }

3. Backend: Creates Razorpay order
   +-- razorpay.orders.create({ amount: totalPrice * 100, currency: "INR" })
   +-- Returns { orderId, amount, currency, key }

4. Frontend: Opens Razorpay checkout modal
   +-- On payment success: receives { razorpay_payment_id, razorpay_order_id, razorpay_signature }

5. Frontend: POST /api/bookings/pay { bookingId, paymentId, orderId, signature }

6. Backend:
   +-- Verifies HMAC-SHA256 signature:
   |   crypto.createHmac("sha256", RAZORPAY_SECRET)
   |     .update(`${orderId}|${paymentId}`).digest("hex") === signature
   +-- booking.isPaid = true, booking.status = "confirmed"
   +-- booking.paymentMethod = "UPI" / "Card"
   +-- booking.save()
   +-- Sends booking confirmation email via Nodemailer

7. Frontend: Shows success toast and redirects to /my-bookings
```

> **Supported methods:** UPI, Credit/Debit Cards, Net Banking, Wallets (as enabled in your Razorpay dashboard)  
> **Test mode:** Use `rzp_test_*` credentials during development; never commit live keys to source control.

---

## Image Upload Flow (Cloudinary)

Room images are processed server-side via a **memory → Cloudinary** pipeline — no disk I/O:

```
POST /api/rooms/ (multipart/form-data, up to 4 images)
   |
   +-- Multer (memoryStorage): buffers files in memory
   |
   +-- roomController.createRoom:
       +-- For each file in req.files:
       |   +-- cloudinary.uploader.upload_stream(
       |         { folder: "checkinpass/rooms" },
       |         (err, result) => imageUrls.push(result.secure_url)
       |       )
       +-- Room.create({ ..., images: imageUrls })
```

Images are served via Cloudinary's global CDN with automatic WebP/AVIF optimization where supported.

---

## Environment Configuration

### Backend `server/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| `MONGODB_URL` | Required | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/checkinpass` |
| `JWT_SECRET` | Required | Secret for JWT signing & verification | Any 32+ character random string |
| `GOOGLE_CLIENT_ID` | Required | Google OAuth Client ID for token verification | `<id>.apps.googleusercontent.com` |
| `CLOUDINARY_CLOUD_NAME` | Required | Cloudinary cloud name | `dxxxxxxxx` |
| `CLOUDINARY_API_KEY` | Required | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Required | Cloudinary API secret | `xxxxxxxxxxxxxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_ID` | Required | Razorpay Key ID (from Razorpay dashboard) | `rzp_live_xxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Required | Razorpay Key Secret (for HMAC signature verification) | `xxxxxxxxxxxxxxxxxxxxxxxxx` |
| `SENDER_EMAIL` | Required | From-address for booking confirmation emails | `noreply@checkinpass.com` |
| `SMTP_HOST` | Required | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | Required | SMTP port | `465` |
| `SMTP_USER` | Required | SMTP username / email | `user@gmail.com` |
| `SMTP_PASS` | Required | SMTP password or Gmail app password | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | Optional | Comma-separated CORS allowed origins | `https://checkinpass.vercel.app` |
| `PORT` | Optional | HTTP server port (default: `3000`) | `3000` |

### Frontend `client/.env`

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_BACKEND_URL` | Required | Backend base URL — no trailing slash | `https://checkinpass.vercel.app` |
| `VITE_GOOGLE_CLIENT_ID` | Required | Google OAuth Client ID (same as backend) | `<id>.apps.googleusercontent.com` |
| `VITE_RAZORPAY_KEY_ID` | Required | Razorpay Key ID (public — safe to expose) | `rzp_live_xxxxxxxxxx` |
| `VITE_CURRENCY` | Optional | Currency symbol for price display (default: `$`) | `Rs.` |

---

## Local Development Setup

### Prerequisites

- **Node.js** `20.x` or later — [download](https://nodejs.org)
- **npm** `10.x` or later (bundled with Node)
- **MongoDB Atlas** account — free tier at [mongodb.com/atlas](https://mongodb.com/atlas)
- **Cloudinary** account — free tier at [cloudinary.com](https://cloudinary.com)
- **Razorpay** account — test mode at [razorpay.com](https://razorpay.com)
- **Google Cloud** project with OAuth 2.0 credentials configured

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Vans30m/CheckInPass.git
cd CheckInPass
```

### Step 2 — Install All Dependencies

```bash
npm run install:all
# Installs root, server, and client dependencies in one command
```

### Step 3 — Backend Configuration

```bash
cd server
# Create server/.env and populate with your credentials (see table above)
```

Minimum required for local dev:

```env
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/checkinpass
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
GOOGLE_CLIENT_ID=<your-google-client-id>.apps.googleusercontent.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
SENDER_EMAIL=your@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
```

### Step 4 — Frontend Configuration

```bash
cd ../client
# Create client/.env
```

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
VITE_CURRENCY=Rs.
```

### Step 5 — Run the Full Stack

From the **project root**:

```bash
npm run dev
# Starts backend (port 3000) + client (port 5173) concurrently
```

Or in separate terminals:

```bash
# Terminal 1 — Backend
cd server && npm run dev
# -> Server running on PORT: 3000

# Terminal 2 — Frontend
cd client && npm run dev
# -> Vite dev server at http://localhost:5173
```

### Step 6 — Verify the Stack

```bash
curl http://localhost:3000/health
# -> { "status": "ok", "timestamp": "..." }

curl http://localhost:3000/api/rooms
# -> { "success": true, "rooms": [...] }
```

Open **`http://localhost:5173`** in your browser.

---

## Deployment (Vercel)

### Backend — Vercel Serverless

The root `vercel.json` routes all requests to `server/server.js` as a `@vercel/node` serverless function:

```json
{
  "builds": [{ "src": "server/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server/server.js" }]
}
```

```bash
# From project root
vercel --prod
```

### Frontend — Vercel Static Site

```bash
cd client
npm run build   # vite build -> dist/
vercel --prod
```

### Cross-Service Wiring

After deploying both services:
1. Set `VITE_BACKEND_URL` in the **client** Vercel project → backend deployment URL
2. Set `FRONTEND_URL` in the **backend** Vercel project → client deployment URL
3. Add all remaining secrets via **Vercel Dashboard → Project → Settings → Environment Variables**

---

## Security Architecture

| Layer | Mechanism | Configuration |
|---|---|---|
| **Global Rate Limit** | `express-rate-limit` | 100 requests / 15 min per IP on all `/api/*` routes |
| **Auth Rate Limit** | `express-rate-limit` | 10 attempts / 15 min per IP on `/api/user/google-auth` |
| **JWT Authentication** | `jsonwebtoken` | 30-day access tokens; `{ userId }` payload; verified on every protected route |
| **Google Token Verification** | `google-auth-library` | Server-side `OAuth2Client.verifyIdToken()` — prevents token forgery |
| **Razorpay Signature Verification** | `crypto.createHmac('sha256', secret)` | HMAC-SHA256 over `orderId|paymentId` — prevents payment spoofing |
| **CORS** | Strict origin allowlist | `localhost:5173` (dev) + `FRONTEND_URL` env var; all others blocked |
| **Image Validation** | Multer field limits | Max 4 files per upload; processed in memory only, never written to disk |
| **Input Validation** | Mongoose schema enums | `role`, `status`, `paymentMethod` restricted to known enum values |
| **Environment Isolation** | `.env` + `dotenv` | Secrets never committed; `.gitignore` covers `server/.env` and `client/.env` |

---

## Upcoming Features

| Feature | Status | Description |
|---|---|---|
| **Experience Page** | In Progress | Curated travel experiences — day trips, city tours, adventure activities; browsable by destination and category; bookable with Razorpay |
| **Razorpay Webhooks** | In Progress | Server-side `payment.captured` event listener — auto-confirms bookings even if the browser closes during payment |
| **Review & Ratings** | Planned | Post-stay guest reviews with star ratings per room |
| **Advanced Filters** | Planned | Filter rooms by price range, amenities, and star rating on the All Rooms page |
| **Admin Dashboard** | Planned | Platform-wide analytics across all registered hotels |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Disclaimer

**For demonstration purposes.** Payment flows use Razorpay test credentials by default. Do not process real transactions without switching to live Razorpay credentials and completing KYC verification on your Razorpay account.

---

<div align="center">

Built with love by **Vans30m** — [Live App](https://checkinpass.vercel.app)

</div>