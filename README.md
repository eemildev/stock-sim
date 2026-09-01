# Stock Sim

Stock Sim is a full-stack investing simulator designed to provide a realistic trading experience without real financial risk. The project focuses on authentication, transactional portfolio management, third-party market-data integration, and historical performance visualization.

[Live Demo](https://stock-sim-phi.vercel.app)

<img width="1920" height="1080" alt="output" src="https://github.com/user-attachments/assets/bbf0f900-e711-4b0d-ae13-acd9c367bef3" />

## Features
- Email and Google authentication
- Create portfolios with simulated funds
- Browse and search stocks
- Buy stocks using simulated funds
- Sell stocks from your portfolio
- View detailed stock information with historical price charts
- Track portfolio holdings, transactions, and performance over time
- Dark / Light mode
  
## Tech Stack
- Next.js (App Router) & React 19
- TypeScript
- Drizzle ORM & Neon PostgreSQL
- Better Auth
- Tailwind CSS v4
- shadcn/ui & Base UI
- Recharts
- Lucide React & Sonner
- next-themes
- Playwright
- Vitest

## Data
- Finnhub
- Twelve Data
- Logo.dev

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

## Testing

Run unit and integration tests:
   ```bash
   pnpm test
   ```

Run end-to-end tests:
   ```bash
   pnpm test:e2e
   ```
