#!/usr/bin/env node

/**
 * Pre-build optimization script
 * Run this before building the app for production
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running pre-build optimizations...');

// Ensure environment variables are set
if (!process.env.NEXT_PUBLIC_STRAPI_API_URL) {
  console.log('⚠️ Warning: NEXT_PUBLIC_STRAPI_API_URL is not set. Using default value from .env.production');
}

if (!process.env.NEXT_PUBLIC_STRAPI_API_TOKEN) {
  console.log('⚠️ Warning: NEXT_PUBLIC_STRAPI_API_TOKEN is not set. Using default value from .env.production');
}

// Check if the blog directory exists
const blogDir = path.join(__dirname, '..', 'pages', 'blog');
if (!fs.existsSync(blogDir)) {
  console.error('❌ Error: Blog directory not found! Make sure pages/blog directory exists.');
  process.exit(1);
}

// Clean .next directory if it exists
const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  console.log('🧹 Cleaning .next directory...');
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ .next directory cleaned successfully.');
  } catch (err) {
    console.warn('⚠️ Could not clean .next directory:', err.message);
  }
}

console.log('✅ Pre-build optimizations completed successfully!');
console.log('🚀 You can now run "npm run build" to build the app for production.'); 