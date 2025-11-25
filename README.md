# REIT Investment Platform

A full-stack web application for simulating Real Estate Investment Trust (REIT) investments with fake money.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **REIT Browsing**: View available REITs with key metrics (price, returns, dividend yield)
- **Investment Simulation**: Invest fake money in REITs and track performance
- **Portfolio Management**: View holdings, profit/loss, and transaction history
- **REIT Comparison**: Compare up to 3 REITs side-by-side with charts
- **Community**: Post and view messages from other users
- **Real-time Updates**: Socket.io for live price updates and community posts

## Tech Stack

### Backend
- Node.js + Express
- MySQL database
- JWT authentication
- Socket.io for real-time features

### Frontend
- React
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- Socket.io-client

## Setup Instructions

### 1. Database Setup

```bash
# Install MySQL and create database
mysql -u root -p < server/config/schema.sql
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=reit_platform
# JWT_SECRET=your_secret_key
# PORT=5000
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Run the Application

```bash
# From root directory - run both backend and frontend
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Database Schema

### users
- id, username, email, password, balance, created_at

### reits
- id, name, symbol, price, annual_return, dividend_yield, sector, description, market_cap, created_at

### portfolio
- id, user_id, reit_id, shares, avg_price, created_at

### transactions
- id, user_id, reit_id, type, shares, price, total_amount, created_at

### community_posts
- id, user_id, content, created_at

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### REITs
- GET /api/reits - Get all REITs
- GET /api/reits/:id - Get single REIT
- POST /api/reits - Create REIT (admin)

### Portfolio
- GET /api/portfolio/:userId - Get user portfolio
- POST /api/portfolio/invest - Make investment
- GET /api/portfolio/transactions/:userId - Get transaction history

### Community
- GET /api/community - Get all posts
- POST /api/community - Create post

## Default User Balance

Each new user starts with $100,000 in fake money to invest.

## Sample REITs Included

- American Tower Corp (AMT) - Infrastructure
- Prologis Inc (PLD) - Industrial
- Crown Castle Inc (CCI) - Infrastructure
- Realty Income Corp (O) - Retail
- Equinix Inc (EQIX) - Data Centers
- Public Storage (PSA) - Self Storage

## Future Enhancements

- Admin panel for managing REITs
- Advanced charts and analytics
- Sell functionality
- Watchlist feature
- Email notifications
- Social features (likes, comments)
