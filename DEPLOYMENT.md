# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- A Convex account (free at https://www.convex.dev/)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Convex Backend

```bash
npx convex dev
```

This will:
- Prompt you to log in or create a Convex account
- Create a new project called "fifteen"
- Deploy your schema and functions
- Provide a deployment URL

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Add your Convex deployment URL:

```env
VITE_CONVEX_URL=https://your-actual-deployment.convex.cloud
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## Production Deployment

### Deploy Convex Backend

```bash
npx convex deploy
```

This creates a production deployment and provides a production URL.

### Deploy Frontend

The app can be deployed to any SvelteKit-compatible platform:

#### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_CONVEX_URL=https://your-production-deployment.convex.cloud`
3. Deploy automatically on push

#### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set environment variable: `VITE_CONVEX_URL=https://your-production-deployment.convex.cloud`

#### Cloudflare Pages

1. Install adapter: `npm install -D @sveltejs/adapter-cloudflare`
2. Update `svelte.config.js` to use the Cloudflare adapter
3. Connect your GitHub repository to Cloudflare Pages
4. Set environment variable: `VITE_CONVEX_URL=https://your-production-deployment.convex.cloud`

## Testing the Application

### 1. Create an Account

Navigate to `/auth` and sign up with email and password.

### 2. Record a Game

1. Click "Record New Game"
2. Enter 2-4 player names
3. Select the winner
4. Enter points for each player
5. Set start and end times
6. Click "Save Game"

### 3. View Leaderboard

The home page shows:
- Recent games
- Global leaderboard with player rankings

### 4. Manage Games

- View all games at `/games`
- Click a game to see details
- Edit or delete games as needed

## Troubleshooting

### "Cannot read properties of null" Error

This means the Convex backend is not properly configured. Make sure:
1. You've run `npx convex dev`
2. The deployment URL is correct in `.env.local`
3. The Convex development server is running

### Styles Not Loading

If Tailwind styles aren't applied:
1. Make sure `@tailwindcss/postcss` is installed
2. Check that `vite.config.ts` includes the PostCSS configuration
3. Restart the dev server

### Build Failures

Run the type checker:
```bash
npm run check
```

Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Environment Variables

- `VITE_CONVEX_URL`: Your Convex deployment URL (required)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run check`: Run TypeScript type checking
- `npx convex dev`: Start Convex development backend
- `npx convex deploy`: Deploy Convex to production
