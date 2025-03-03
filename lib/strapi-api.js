/**
 * Strapi API client for blog functionality
 */

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://u488cwcco0gw00048g4wgoo0.coolify.valle.us';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '8535e06cbdc083b2e8801aeaa3082bdf04ced2f6ad0e513a403be3e7c38c32ecb59feec4142015f3696d7d28b1d517d520465512626e2587cc361a8772dec55f1b88cd928c0df02c411d0e98c2de07998ab373903fb15d15abaca6037825f9ad326871b2d6cf8a9b5a4fc8a85a3788041c3a9ab2edc32b4537b9d2bcda1f3f17';

// Helper function for conditional logging
const log = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
};

// Helper function for conditional error logging
const logError = (message, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  }
};

/**
 * Fetch all blog posts with pagination
 * @param {number} page - Page number (starts at 1)
 * @param {number} pageSize - Number of items per page
 * @returns {Promise<Object>} - Blog posts data
 */
export async function fetchBlogPosts(page = 1, pageSize = 10) {
  try {
    log(`Fetching posts: page=${page}, pageSize=${pageSize}`);
    
    const response = await fetch(
      `${STRAPI_API_URL}/api/reverse-gif-blog-posts?populate=SocialMediaMetaImage&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching blog posts: ${response.status}`);
    }
    
    const result = await response.json();
    log('API response for fetchBlogPosts:', result);
    
    return result;
  } catch (error) {
    logError('Error fetching blog posts:', error);
    return { data: [], meta: { pagination: { total: 0 } } };
  }
}

/**
 * Fetch a single blog post by ID or slug
 * @param {string} idOrSlug - The post ID or slug
 * @returns {Promise<Object>} - Blog post data
 */
export async function fetchBlogPostBySlug(idOrSlug) {
  try {
    let url;
    
    // Check if idOrSlug is a number (ID) or string (slug)
    if (isNaN(idOrSlug)) {
      // It's a slug
      log(`Fetching post by slug: ${idOrSlug}`);
      url = `${STRAPI_API_URL}/api/reverse-gif-blog-posts?populate=SocialMediaMetaImage&filters[slug][$eq]=${idOrSlug}`;
    } else {
      // It's an ID
      log(`Fetching post by ID: ${idOrSlug}`);
      url = `${STRAPI_API_URL}/api/reverse-gif-blog-posts/${idOrSlug}?populate=SocialMediaMetaImage`;
    }
    
    log('Request URL:', url);
    
    const response = await fetch(
      url,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching blog post: ${response.status}`);
    }
    
    const data = await response.json();
    log('API response for fetchBlogPostBySlug:', JSON.stringify(data, null, 2));
    
    // Handle different response formats based on whether we used ID or slug
    if (isNaN(idOrSlug)) {
      // For slug queries, we get an array of matching posts
      return data.data && data.data.length > 0 ? data.data[0] : null;
    } else {
      // For ID queries, Strapi returns a different structure
      // The data is directly in data object, not in an array
      if (!data.data) {
        logError('Invalid API response structure for ID query:', data);
        return null;
      }
      return data.data;
    }
  } catch (error) {
    logError('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Fetch featured blog posts
 * @param {number} limit - Number of featured posts to fetch
 * @returns {Promise<Array>} - Featured blog posts
 */
export async function fetchFeaturedBlogPosts(limit = 3) {
  try {
    log(`Fetching featured posts: limit=${limit}`);
    
    const response = await fetch(
      `${STRAPI_API_URL}/api/reverse-gif-blog-posts?populate=SocialMediaMetaImage&pagination[pageSize]=${limit}&sort=publishedAt:desc`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching featured blog posts: ${response.status}`);
    }
    
    const data = await response.json();
    log('API response for fetchFeaturedBlogPosts:', data);
    
    return data.data || [];
  } catch (error) {
    logError('Error fetching featured blog posts:', error);
    return [];
  }
}

/**
 * Check if a post exists by ID
 * @param {string} id - The post ID
 * @returns {Promise<boolean>} - Whether the post exists
 */
export async function checkPostExists(id) {
  try {
    log(`Checking if post with ID ${id} exists`);
    
    const response = await fetch(
      `${STRAPI_API_URL}/api/reverse-gif-blog-posts?filters[id][$eq]=${id}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch (error) {
    logError('Error checking if post exists:', error);
    return false;
  }
} 