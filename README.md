# AI Fitness Assistant - FlyRank Internship Capstone

## Project Brief

AI Fitness Assistant is a web app that gives people instant, personalized fitness and nutrition guidance through a conversational AI chat. Many beginners struggle to build workout routines or eat well because personal trainers are expensive and generic online advice doesn't fit their goals, so this app lets them ask questions anytime and get tailored answers, with their conversations saved to their account for easy follow-up. It is built for beginners and busy people who want affordable, always-available support on their fitness journey. I chose this idea because fitness is something I'm personally interested in, and it was a practical way to combine AI, authentication, and a real-time database in a project that solves an everyday problem.

This project is a Next.js front-end application built for the FlyRank Front-end AI Engineer Intern track. It serves as a practical capstone foundation for building modern React applications with AI-assisted workflows, clean architecture, and professional development habits.

## Project Overview

The app currently includes a small multi-page experience with:

- a main landing page
- a settings page with a validated account settings form
- a health check route that fetches live data from an external advice API

This structure reflects the early stages of a larger capstone product and provides a solid base for future expansion.

## Tech Stack

- Next.js 16
- React 19
- JavaScript (ES6+)
- Tailwind CSS
- ESLint

## Features

- App Router-based page structure
- Responsive navigation between pages
- Client-side form validation for account settings
- Save confirmation state for the settings form
- Health check page that demonstrates server-side data fetching

## Prerequisites

- Node.js (LTS recommended)
- npm (included with Node.js)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the [live app](https://ai-fitness-assistant-nine.vercel.app/) in your browser to view it.

## Available Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| npm run dev   | Start the Next.js development server |
| npm run build | Create a production build            |
| npm run start | Start the production server          |
| npm run lint  | Run ESLint                           |

## Project Structure

```text
src/
  app/
    layout.jsx          # Root layout
    page.jsx            # Home page
    health/page.jsx     # Health check page
    settings/page.jsx   # Settings page
  components/
    Nav.jsx             # Navigation component
    SettingsForm.jsx    # Settings form UI
    SettingsForm.css    # Form styles
    validation.js       # Client-side validation helpers
```

## Development Notes

- Use Server Components by default.
- Use Client Components only when browser interactivity is required.
- Keep reusable UI logic in the components folder.
- Run linting and production builds before committing major changes.

## Deployment Documentation

- [Production Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)
- [Rollback Plan](docs/ROLLBACK_PLAN.md)

## Author

Nour Nasir — Front-end AI Engineer Intern
