# Anime Search App

A React-based anime search application built with TypeScript, Redux, and the Jikan API. Search for anime, browse results with pagination, and view detailed information about your favorite shows.

## Features

- **Instant Search**: Debounced search (250ms) for responsive user experience
- **Server-side Pagination**: Efficient pagination with the Jikan API
- **Anime Details**: Comprehensive detail pages with synopsis, genres, studios, and more
- **Redux State Management**: Centralized state management with Redux Toolkit
- **TypeScript**: Fully typed codebase for better developer experience
- **Responsive Design**: Mobile-first design that works on all devices

## Setup Instructions

### Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4000`

The app should now be running and ready to use!

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Jikan API** - Anime data source

## Project Structure

```
src/
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components (Button, Card, Input)
│   └── app/               # App-specific components (SearchBar, AnimeCard, Pagination, LoadingSkeleton, EmptyState, ErrorMessage)
├── pages/                 # Page components
│   ├── anime-list.tsx     # Anime list page
│   └── anime-details.tsx  # Anime details page
├── store/                 # Redux store configuration
│   ├── store.ts           # Redux store configuration
│   ├── hooks.ts           # Redux hooks
│   └── slices/            # Redux slices
│       ├── animeSlice.ts  # Anime slice
│       └── animeDetailsSlice.ts # Anime details slice
├── services/              # API service layer
│   └── jikanApi.ts
├── types/                 # TypeScript type definitions
└── App.tsx                # Main app component
```

## Submission Checklist

Before submitting, ensure:

- [x] Project uses npm only (no yarn/pnpm)
- [x] `npm install` and `npm run dev` starts the app successfully
- [x] Dev server runs on port 4000
- [x] No environment variables required
- [x] Project is deployed and accessible via live URL [https://jikanime.pages.dev/](https://jikanime.pages.dev/)
- [x] All core functionality works as described
  - [x] Instant search
  - [x] Display search results
  - [x] Server-side pagination
  - [x] Anime details
- [x] Code is written in TypeScript
- [x] Redux is properly implemented for state management
- [x] If bonus features implemented, they are listed in README under "Bonus Implementation" header

## Bonus Implementation

The following bonus features have been implemented to enhance the user experience:

### User Experience Enhancements

1. **Skeleton Loaders**: Animated skeleton loaders displayed during data fetching to provide visual feedback
2. **Empty States**: Helpful empty state messages when no results are found
3. **Error Handling**: Comprehensive error handling with user-friendly error messages and retry functionality
4. **Mobile Responsive Design**: Fully responsive layout that adapts to different screen sizes (mobile, tablet, desktop)
5. **Smooth Animations**: Hover effects and transitions for better interactivity
6. **Loading States**: Clear loading indicators for both search and detail pages
7. **Request Cancellation**: In-flight API requests are automatically cancelled when new searches are initiated to prevent race conditions

### Technical Excellence

1. **Race Condition Handling**: Proper handling of race conditions by cancelling previous requests when new ones are made
2. **Error Recovery**: Retry functionality for failed API requests
3. **TypeScript Best Practices**: Minimal use of `any` types, comprehensive type definitions for all API responses
4. **Code Organization**: Clean separation of concerns with dedicated folders for components, pages, store, services, and types
5. **Reusable Components**: Modular component architecture for easy maintenance and extension
6. **Debounced Search**: Efficient debouncing implementation (250ms) to reduce API calls while maintaining responsiveness

## API Information

This app uses the [Jikan API](https://docs.api.jikan.moe/) - a free, open-source API for MyAnimeList data. No authentication is required.
