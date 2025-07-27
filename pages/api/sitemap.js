// pages/api/sitemap.js
import { fetchBlogPosts } from '../../lib/strapi-api';

const SITE_URL = 'https://reversegif.com';

// Define your static pages with their properties
const staticPages = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/faq', changefreq: 'monthly', priority: 0.8 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.5 },
  { path: '/terms', changefreq: 'monthly', priority: 0.5 },
  { path: '/blog', changefreq: 'weekly', priority: 0.9 },
  // Tool pages - high priority for SEO
  { path: '/video-2-gif', changefreq: 'weekly', priority: 0.9 },
  { path: '/gif-to-mp4', changefreq: 'weekly', priority: 0.9 },
  { path: '/video-to-jpg', changefreq: 'weekly', priority: 0.8 },
  { path: '/video-to-png', changefreq: 'weekly', priority: 0.8 },
];

async function getAllBlogPosts() {
  const allPosts = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const result = await fetchBlogPosts(page, 100); // Fetch 100 posts per page
      if (result && result.data && Array.isArray(result.data)) {
        allPosts.push(...result.data);
        hasMore = page < result.meta?.pagination?.pageCount;
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error('Error fetching blog posts for sitemap:', error);
      hasMore = false;
    }
  }
  
  return allPosts;
}

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Static pages -->
${staticPages.map(page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
  
  <!-- Blog posts -->
${posts.map(post => {
    const slug = post.attributes?.slug || post.slug;
    const updatedAt = post.attributes?.updatedAt || post.updatedAt || new Date().toISOString();
    
    return `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${new Date(updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n')}
</urlset>`;
}

export default async function handler(req, res) {
  try {
    // Fetch all blog posts
    const posts = await getAllBlogPosts();
    
    // Generate the XML sitemap
    const sitemap = generateSiteMap(posts);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
}