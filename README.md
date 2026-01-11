# fifteen

A cribbage game tracking web application built with SvelteKit, Tailwind CSS, and Convex.

## Features

- 🎮 Track cribbage games with 2-4 players
- 🏆 View global leaderboard with win counts and statistics
- ✏️ Full CRUD operations for game records
- 👤 User authentication with Convex Auth
- ⏱️ Automatic duration calculation from timestamps
- 📊 Player points tracking
- 🎨 Clean, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: SvelteKit 2 with TypeScript, Tailwind CSS v4
- **Backend**: Convex (serverless backend)
- **Authentication**: Convex Auth with password provider

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- A Convex account (free at https://www.convex.dev/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/captainsafia/fifteen.git
   cd fifteen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   
   a. Install Convex CLI globally (optional):
   ```bash
   npm install -g convex
   ```
   
   b. Initialize your Convex project:
   ```bash
   npx convex dev
   ```
   
   This will:
   - Prompt you to create a Convex account or log in
   - Create a new project
   - Generate your deployment URL
   - Push your schema and functions to Convex
   
   c. Copy the deployment URL provided by Convex

4. **Configure environment variables**
   
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Convex deployment URL:
   ```
   VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:5173

### Additional Convex Setup

Keep the `npx convex dev` command running in a separate terminal while developing. This will:
- Watch for changes in your `convex/` directory
- Automatically deploy updates to your functions and schema
- Provide logs from your backend

## Usage

1. **Sign Up / Login**: Create an account or sign in at `/auth`
2. **Record a Game**: Click "Record New Game" to add a game with players, winner, points, and timestamps
3. **View Games**: Browse all recorded games at `/games`
4. **View Details**: Click on any game to see detailed information
5. **Edit/Delete**: Modify or remove games as needed
6. **Leaderboard**: View player rankings on the home page

## Project Structure

```
fifteen/
├── src/
│   ├── routes/              # SvelteKit routes
│   │   ├── +page.svelte     # Home page with leaderboard
│   │   ├── auth/            # Authentication pages
│   │   └── games/           # Game management pages
│   ├── lib/
│   │   └── convex.ts        # Convex client setup
│   └── app.css              # Tailwind styles
├── convex/
│   ├── schema.ts            # Database schema
│   ├── auth.ts              # Authentication configuration
│   ├── games.ts             # Game mutations (create, update, delete)
│   └── queries.ts           # Data queries (list games, leaderboard)
└── static/                  # Static assets
```

## Data Model

### Game Schema
- `players`: Array of player names (2-4 players)
- `winner`: Name of the winning player
- `points`: Object mapping player names to points scored
- `startTime`: Unix timestamp of game start
- `endTime`: Unix timestamp of game end
- `duration`: Computed field (endTime - startTime)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deployment

This app can be deployed to any SvelteKit-compatible platform:

- **Vercel**: Connect your GitHub repo to Vercel
- **Netlify**: Use the Netlify adapter
- **Cloudflare Pages**: Use the Cloudflare adapter

Make sure to:
1. Set the `VITE_CONVEX_URL` environment variable in your hosting platform
2. Deploy your Convex backend with `npx convex deploy`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

