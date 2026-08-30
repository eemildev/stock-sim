# stock-sim

A real-time stock market simulation platform built with Next.js and React. This application leverages modern web technologies to provide stock data visualization, secure authentication, and a scalable database architecture.

## Features
- Email and Google authentication
- Create portfolios with simulated funds
- Browse and search stocks with pagination
- Buy stocks using simulated funds
- Sell stocks from your portfolio
- View detailed stock information with historical price charts
- Track portfolio holdings, transactions, and performance over time

## Tech Stack
**Core Framework**
* [Next.js (App Router)](https://nextjs.org/) - React framework
* [React 19](https://react.dev/) - UI library

**Database & Authentication**
* [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database ORM
* [Neon Database](https://neon.tech/) - Serverless Postgres database
* [Better Auth](https://better-auth.com/) - Secure authentication (with Drizzle adapter)

**Data & APIs**
* [Twelve Data](https://twelvedata.com/) - Historical stock data (free-tier limits 8 requests/min, 800/day)
* [Finnhub](https://finnhub.io/) - Fresh stock data (free-tier limits 60 requests/min) 
* [Logo.dev](https://www.logo.dev/) - Company logos API

**Styling & UI Components**
* [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
* [Shadcn UI](https://ui.shadcn.com/) - Accessible UI components
* [Recharts](https://recharts.org/) - Composable charting library
* [Base UI](https://base-ui.com/) - Unstyled UI components for React
* [Lucide React](https://lucide.dev/) - Beautiful icons
* [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
* [Next Themes](https://github.com/pacocoursey/next-themes) - Dark/Light mode support

## Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v20+ recommended)
* **pnpm** (v11.21.0+ recommended)

## Environment Variables

Create a `.env` file in the root directory and add the following variables based on your dependencies:

```env
# Database configuration
DATABASE_URL=your_db_url

# BetterAuth configuration
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=base_url_of_your_app

# Google OAuth configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twelve Data API configuration
TWELVEDATA_SECRET=your_twelvedata_secret

# Finnhub API configuration
FINNHUB_API_KEY=your_finnhub_api_key
FINNHUB_API_SECRET=your_finnhub_api_secret

# Logo API configuration
LOGO_DEV_TOKEN=your_logo_dev_token
```

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate and push the database schema:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.