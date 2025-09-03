import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  const { page = 1, pageSize = 6, sort = 'publishedAt:desc' } = req.query;
  
  // Use the working Strapi configuration
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://u488cwcco0gw00048g4wgoo0.coolify.valle.us';
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '8535e06cbdc083b2e8801aeaa3082bdf04ced2f6ad0e513a403be3e7c38c32ecb59feec4142015f3696d7d28b1d517d520465512626e2587cc361a8772dec55f1b88cd928c0df02c411d0e98c2de07998ab373903fb15d15abaca6037825f9ad326871b2d6cf8a9b5a4fc8a85a3788041c3a9ab2edc32b4537b9d2bcda1f3f17';
  
  try {
    // Create an axios instance with custom HTTPS agent
    const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // For development - allows self-signed certificates
      }),
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const url = `${STRAPI_API_URL}/api/reverse-gif-blog-posts`;
    const params = {
      populate: 'SocialMediaMetaImage',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      sort: sort
    };
    
    const response = await axiosInstance.get(url, { params });
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // Return empty data structure on error
    const fallbackData = {
      data: [],
      meta: {
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          pageCount: 0,
          total: 0
        }
      }
    };
    
    res.setHeader('Cache-Control', 's-maxage=10');
    res.status(200).json(fallbackData);
  }
}