![Vercel](https://vercelbadge.vercel.app/api/abevalle/reversegif-com)

# 🔄 reversegif.com

This NextJS application is a learning experience for me and a terrible financial decision, lol. This document will walk you through the project, features, and setup instructions. 


## Features
* Upload and process GIF files to reverse their playback.
* Use FFmpeg WASM to preform video processing locally in the browser.
* Easy to use UI
* Preview your reversed GIF in realtime

## Prerequisites 📋

Before you embark on the ReverseGIF.com Next.js web app adventure, let's make sure you have the following prerequisites covered:
* Node.js (version 12 or higher) 📦
* Yarn or NPM 📥

## Setup Instructions 🛠️

To set up the ReverseGIF.com Next.js web app on your local machine, follow these GIFtastic steps:
1. Clone the repository:

```bash
git clone git@github.com:abevalle/reversegif.com.git
```

2. Navigate to the project directory:

```bash
cd reversegif.com
```

3. Install the project dependencies:

```bash
yarn install
```

4. Build the project:
```bash
yarn build
```
5. Start the development server:
```bash
yarn dev
```

Open your web browser and visit http://localhost:3000 to embark on your reversegIF journey! 🚀🌐

## Blog Functionality

The application now includes a blog feature powered by Strapi CMS. Blog posts are fetched from the Strapi API and displayed in a dedicated blog section.

### Features

- Blog index page with paginated posts
- Individual blog post pages with rich content
- SEO optimizations for blog content
- Related posts suggestions

### Routes

- `/blog` - Blog index page
- `/blog/[slug]` - Individual blog post page

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Production Deployment

```bash
# Optimize and build for production
npm run build:prod

# Start the production server
npm run start
```

### Environment Variables

Create a `.env.production` file with the following variables:

```
NEXT_PUBLIC_STRAPI_API_URL=your-strapi-api-url
NEXT_PUBLIC_STRAPI_API_TOKEN=your-strapi-api-token
```

## Scripts

- `npm run dev` - Start development server
- `npm run optimize` - Run pre-build optimizations
- `npm run build` - Build the application
- `npm run build:prod` - Run optimizations and build for production
- `npm run start` - Start production server
- `npm run analyze` - Analyze the bundle size (requires @next/bundle-analyzer)