<div align="center">

# 🏨 QuickStay - Full Stack Hotel Booking Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](#)

A modern, fully responsive, role-based hotel booking system. Build with the **MERN stack**, featuring secure authentication, automated email confirmations, and integrated payment processing.

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents
* [About the Project](#-about-the-project)
* [Key Features](#-key-features)
* [Tech Stack & Integrations](#%EF%B8%8F-tech-stack--integrations)
* [System Architecture](#-system-architecture)
* [Environment Variables](#-environment-variables)
* [Installation & Setup](#-installation--setup)
* [Acknowledgments](#-acknowledgments)

---

## 📖 About the Project

**QuickStay** is a comprehensive solution designed to bridge the gap between travelers and hotel owners. It provides a seamless UI for users to discover, filter, and book rooms while offering a powerful, secure dashboard for property owners to manage their inventory and track revenue. 

> **Note:** Replace this blockquote with a screenshot or GIF of your project once uploaded to GitHub using `![Dashboard Preview](./assets/preview.gif)`.

---

## ✨ Key Features

### 👤 Guest (User) Features
* **Smart Search & Filters:** Dynamic search by city with advanced filtering by room type, price range, and amenities.
* **Real-time Availability:** Smart date-picking logic preventing double-booking.
* **Secure Checkout:** Integrated **Stripe** payment gateway for seamless online transactions.
* **Automated Emails:** Instant booking confirmation emails via **Brevo (NodeMailer)**.
* **Personalized Dashboard:** "My Bookings" page to track active and past reservations.

### 🏢 Hotel Owner Features
* **Role-Based Access Control (RBAC):** Dedicated owner dashboards accessible only to verified property admins.
* **Property Management:** Upload room images (via **Cloudinary**), set pricing, and define amenities.
* **Financial Overview:** Real-time metrics on total revenue and total bookings.
* **Inventory Control:** One-click toggles to mark rooms as available or unavailable.

---

## 🛠️ Tech Stack & Integrations

| Category | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication**| Google OAuth (`@react-oauth/google` & JWT) |
| **Payments** | Stripe API & Webhooks |
| **Media Storage** | Cloudinary, Multer |
| **Email Service** | Brevo (formerly Sendinblue), NodeMailer |
| **Deployment** | Vercel |

---

## 🏗 System Architecture

The application follows a decoupled client-server architecture:
1. **Client (`/client`):** Consumes RESTful APIs, handles UI state via Context API, and manages routing.
2. **Server (`/server`):** Express API serving JSON data. Uses middleware for authentication validation (verifying Google ID & JWT tokens).

---

## Environment Variables

To run this project, you will need to add the following environment variables to your respective `.env` files.

### Backend (`server/.env`)

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `JWT_SECRET` | Secret key for backend JWT tokens |
| `CLOUDINARY_CLOUD_NAME`| Your Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API Key |
| `CLOUDINARY_API_SECRET`| Your Cloudinary API Secret |
| `STRIPE_SECRET_KEY` | Stripe backend secret key |
| `STRIPE_WEBHOOK_SECRET`| Stripe webhook signing secret |
| `SMTP_USER` | Brevo SMTP login email |
| `SMTP_PASS` | Brevo SMTP generated password |
| `SENDER_EMAIL` | Verified sender email for NodeMailer |

### Frontend (`client/.env`)

| Variable | Description |
| :--- | :--- |
| `VITE_BACKEND_URL` | URL of your Express API (e.g., `http://localhost:3000`) |
| `VITE_GOOGLE_CLIENT_ID` | Client ID from Google Cloud Console |
| `VITE_CURRENCY` | Currency symbol (e.g., `$`) |

---

## Installation & Setup

Follow these steps to set up the project locally on your machine.

**1. Clone the repository**
```bash
git clone [https://github.com/yourusername/hotel-booking.git](https://github.com/yourusername/hotel-booking.git)
cd hotel-booking