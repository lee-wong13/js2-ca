# COMMONS - JS2 SOCIAL APP

COMMONS is a social media application built with vanilla JavaScript, HTML, and CSS for the JS2 course assignment. Users can register, log in, create and manage posts, view individual posts, browse profiles, and follow or unfollow users.

## Live Site

https://lee-wong13.github.io/js2-ca/

## Features

- User registration and login
- Protected feed, profile, and post pages
- Create, edit, and delete posts
- Search posts
- View individual posts
- View user profiles and profile posts
- Follow and unfollow users
- Responsive interface for desktop and mobile screens

## Technologies

- HTML
- CSS
- JavaScript modules
- Vite
- Noroff Social API

## Getting Started

### Requirements

- Node.js 20 or newer
- npm

### Install and run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

### Production build

```bash
npm run build
npm run preview
```

The production files are generated in the `dist` directory.

## API Key

The application uses the Noroff Social API. A valid Noroff API key is required for social features such as loading posts and profiles. The key is stored in the browser's local storage and is not included in this repository.

## Project Structure

```text
pages/       HTML pages for authentication, feed, posts, and profiles
src/api/     API request functions and endpoint constants
src/ui/      Page-specific UI logic
src/utils/   Shared storage, authentication, and rendering helpers
src/css/     Application styles
public/      Public static assets
```

## Deployment

The project is deployed to GitHub Pages using the workflow in `.github/workflows/deploy-pages.yml`. The workflow installs dependencies, runs the Vite production build, and publishes the `dist` directory.
