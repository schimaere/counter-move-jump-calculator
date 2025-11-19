# Counter Move Jump Calculator

A Next.js web application for calculating jump performance metrics including jump height, takeoff velocity, and force measurements. The calculator is designed for analyzing countermovement jumps with support for user authentication, saved measurements, and customizable settings.

## Features

- **Jump Calculations**
  - Time in flight calculation from frame data
  - Jump height calculation
  - Takeoff velocity calculation
  - Average force (Fm) calculation
  - Relative force (Frel) calculation

- **User Management**
  - Google OAuth authentication via NextAuth.js
  - Optional authentication (calculator is publicly accessible)
  - Protected pages for authenticated users

- **Measurement Management** (Authenticated users only)
  - Save and manage measurement data (name, leg length, height at 90°, weight)
  - Create, update, and delete measurements
  - Select saved measurements to pre-fill calculator inputs

- **User Settings** (Authenticated users only)
  - Save default frames per second for quick calculations

- **Mobile Responsive**
  - Optimized for mobile devices
  - Responsive grid layouts
  - Touch-friendly interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Neon Postgres (serverless PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Google Cloud project with OAuth credentials
- A Neon Postgres database (or any PostgreSQL database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd counter-move-jump-calculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_neon_postgres_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Environment Variables

- `DATABASE_URL`: Your Neon Postgres connection string
- `NEXTAUTH_URL`: The base URL of your application (use `http://localhost:3000` for local development)
- `NEXTAUTH_SECRET`: A random secret string for NextAuth.js (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (for local) and `https://your-domain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret to your `.env.local` file

### Database Setup

1. Create a Neon Postgres database (or use any PostgreSQL database)
2. Copy the connection string to `DATABASE_URL` in `.env.local`
3. Run the schema SQL to create the necessary tables:

```bash
# Connect to your database and run the SQL from lib/schema.sql
# Or use a database client to execute the schema
```

The schema creates two tables:
- `measurements`: Stores user measurement data
- `user_settings`: Stores user preferences (e.g., default frames per second)

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
counter-move-jump-calculator/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth.js authentication
│   │   ├── measurements/ # Measurement CRUD operations
│   │   └── settings/     # User settings
│   ├── auth/             # Authentication pages
│   ├── components/       # React components
│   ├── settings/         # Settings page
│   ├── view-data/        # Measurements management page
│   └── page.tsx          # Main calculator page
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── formatNumber.ts   # Number formatting utility
│   └── schema.sql        # Database schema
└── public/               # Static assets
```

## Usage

### Calculator (Public Access)

1. Navigate to the home page
2. Enter your calculation parameters:
   - **Frames per Second**: The frame rate of your video
   - **Frame Input Mode**: Choose between:
     - **Direct Input**: Enter the number of frames directly
     - **Frame Range**: Enter start and end frame numbers
   - **Body Weight** (optional): For force calculations
   - **Leg Length** (optional): For force calculations
   - **Height 90°** (optional): For force calculations
3. View the calculated results:
   - Time in Flight
   - Jump Height
   - Takeoff Velocity
   - Average Force (if body measurements provided)
   - Relative Force (if body measurements provided)

### Measurements Management (Authenticated Users)

1. Sign in with your Google account
2. Navigate to "Measurements" from the menu
3. Click "Add New" to create a measurement entry
4. Fill in the measurement data and save
5. Use saved measurements in the calculator by selecting them from the dropdown

### Settings (Authenticated Users)

1. Sign in with your Google account
2. Navigate to "Settings" from the menu
3. Set your default frames per second
4. This value will be pre-filled in the calculator

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
4. Update Google OAuth redirect URI to include your production URL
5. Deploy!

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## License

This project is private and intended for personal use.

## Support

For issues or questions, please contact the project maintainer.
