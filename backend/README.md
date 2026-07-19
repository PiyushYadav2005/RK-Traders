# RK Traders Backend

> Robust RESTful backend API powering the RK Traders Electrical Store website.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Overview

The RK Traders Backend is a production-ready REST API built using **Node.js**, **Express.js**, and **MongoDB**. It provides secure authentication, product management, order processing, dealer registration, quotation requests, enquiry handling, and automated business notifications.

Designed with scalability, maintainability, and security in mind, the backend serves as the central API for the RK Traders e-commerce platform.

---

# Features

### Authentication

- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected Routes
- Role-Based Authorization
- User Profile APIs

### Product Management

- Product CRUD
- Category CRUD
- Brand CRUD
- Search Products
- Filtering
- Sorting
- Pagination
- Featured Products

### Order Management

- Guest Checkout
- Automatic Price Validation
- Wholesale Pricing
- Order Tracking
- Order Status Management
- Order History

### Dealer & Wholesale

- Dealer Registration
- Approval Workflow
- Wholesale Request Handling

### Customer Services

- Contact Enquiries
- Quote Requests
- Business Notifications

### Notifications

- Order Confirmation Email
- Business Email Alerts
- WhatsApp Notifications (Twilio)
- SMTP Support

### Security

- Helmet
- CORS Protection
- JWT Authentication
- Rate Limiting
- Password Encryption
- Centralized Error Handling

---

# Technology Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Nodemailer | Email Notifications |
| Twilio API | WhatsApp Notifications |
| Helmet | Security Headers |
| Express Rate Limit | API Protection |

---

# Project Structure

```
backend
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed
│   ├── utils
│   ├── app.js
│   └── server.js
│
├── package.json
├── package-lock.json
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/RK-Traders.git

cd RK-Traders/backend
```

Install dependencies

```bash
npm install
```

Create environment file

```bash
cp .env.example .env
```

Configure your environment variables.

Run the seed script

```bash
npm run seed
```

Start development server

```bash
npm run dev
```

Server

```
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

BUSINESS_EMAIL=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

BUSINESS_WHATSAPP=
```

> Never commit your `.env` file to GitHub.

---

# Database Setup

## Option 1 — MongoDB Atlas (Recommended)

1. Create a free MongoDB Atlas account.
2. Create a cluster.
3. Click **Connect → Drivers**.
4. Copy the connection string.
5. Paste it into

```
MONGO_URI=
```

---

## Option 2 — Local MongoDB

```
mongodb://127.0.0.1:27017/rk-traders
```

---

# API Base URL

```
http://localhost:5000/api
```

---

# API Modules

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| GET | /auth/me | Current user |

---

## Categories

| Method | Endpoint |
|---------|----------|
| GET | /categories |
| GET | /categories/:slug |
| POST | /categories |
| PUT | /categories/:id |
| DELETE | /categories/:id |

---

## Products

| Method | Endpoint |
|---------|----------|
| GET | /products |
| GET | /products/featured |
| GET | /products/:slug |
| POST | /products |
| PUT | /products/:id |
| DELETE | /products/:id |

### Supported Query Parameters

```
category
brand
search
sort
page
limit
minPrice
maxPrice
inStock
```

---

## Orders

| Method | Endpoint |
|---------|----------|
| POST | /orders/guest |
| GET | /orders/:orderNumber |
| GET | /orders |
| PATCH | /orders/:id/status |

### Features

- Guest Checkout
- Server-side Price Validation
- Wholesale Pricing
- Automatic Customer Creation
- Order Tracking
- Email Notifications
- WhatsApp Notifications

---

## Enquiries

| Method | Endpoint |
|---------|----------|
| POST | /enquiries |
| GET | /enquiries |

---

## Dealers

| Method | Endpoint |
|---------|----------|
| POST | /dealers |
| GET | /dealers/me |
| GET | /dealers |
| PATCH | /dealers/:id/status |

---

# Authentication

Protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Notification System

## Email Notifications

Supports SMTP providers including:

- Gmail App Password
- Outlook
- Zoho
- Custom SMTP

Notifications include:

- Customer Order Confirmation
- Business Order Alert
- Contact Form Alert
- Quote Request Alert

---

## WhatsApp Notifications

Powered by Twilio WhatsApp API.

Required variables:

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_FROM
BUSINESS_WHATSAPP
```

If Twilio credentials are not configured, the API continues functioning normally while WhatsApp notifications are skipped.

---

# Security Features

- JWT Authentication
- Password Encryption
- Helmet
- Rate Limiting
- CORS Protection
- Mongoose Validation
- Centralized Error Handling
- Secure Environment Variables

---

# Error Handling

The application uses a centralized error middleware to return consistent JSON responses.

Example:

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

# Future Improvements

- Admin Analytics Dashboard
- Sales Reports
- Invoice Generation
- Razorpay Integration
- Payment History
- Coupon System
- Wishlist
- Reviews & Ratings
- Inventory Alerts
- Audit Logs

---

# License

This project is licensed under the MIT License.

---

# Author

**RK Traders**

Electrical Products & Solutions

Built with ❤️ using Node.js, Express, MongoDB and modern web technologies.
