# Project Overview

This project is the frontend for an RC Kiosk application, built with Vite, React, and Tailwind CSS. It integrates with Firebase for certain functionalities and Supabase for data management.

# Building and Running

## Prerequisites

*   Node.js version 18 or higher.

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Development Server

To start the development server, run:

```bash
npm run dev
```

This will typically open the application in your browser at `http://localhost:5173` (or a similar address).

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This command compiles the project into the `dist` directory, ready for deployment.

## Previewing the Production Build

To preview the production build locally, run:

```bash
npm run preview
```

## Deployment

To deploy the application to Firebase Hosting, first ensure you have built the application for production:

```bash
npm run build
```

Then, run the deploy command:

```bash
npm run deploy
```

This command will deploy the contents of the `dist` directory to Firebase Hosting.

**Note on Firebase Hosting Configuration:**
The `firebase.json` file is configured to serve the `dist` directory and includes rewrite rules to handle client-side routing for single-page applications, ensuring that all paths are routed to `index.html`.

# Development Conventions

## Supabase Configuration

This project uses Supabase for data. You need to configure your Supabase service URL and anonymous key in a `.env` file at the project root. Create a file named `.env` with the following content, replacing the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important:** Ensure that your `.env` file is not committed to version control. It is already included in `.gitignore`.

## Firebase Integration

The project includes `src/firebase.jsx`, indicating integration with Firebase services.

## Supabase Integration

The project includes `src/lib/supabaseConfig.ts`, indicating the configuration and initialization of the Supabase client.
