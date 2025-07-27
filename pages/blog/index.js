// pages/blog/index.js
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Head from 'next/head';
import Hero from '../../components/Hero';
import StrapiPostCard from '../../components/StrapiPostCard';
import { fetchBlogPosts } from '../../lib/strapi-api';

// Number of posts per page
const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({ page: 1, pageSize: POSTS_PER_PAGE, pageCount: 1, total: 0 });
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setIsLoading(true);
        const result = await fetchBlogPosts(1, POSTS_PER_PAGE);
        
        setApiResponse(result);
        
        // Check if data exists and is an array
        if (result && result.data && Array.isArray(result.data)) {
          
          setPosts(result.data);
          setPaginationData(result.meta?.pagination || { page: 1, pageSize: POSTS_PER_PAGE, pageCount: 1, total: 0 });
        } else {
          setError('Received invalid data format from the API.');
        }
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Load more posts
  const loadMorePosts = async () => {
    if (isLoading || currentPage >= paginationData.pageCount) return;
    
    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const result = await fetchBlogPosts(nextPage, POSTS_PER_PAGE);
      
      // Check if data exists and is an array
      if (result && result.data && Array.isArray(result.data)) {
        setPosts([...posts, ...result.data]);
        setPaginationData(result.meta?.pagination || paginationData);
        setCurrentPage(nextPage);
      } else {
        setError('Received invalid data format from the API when loading more posts.');
      }
    } catch (err) {
      setError('Failed to load more posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Blog | reversegif.com</title>
        <meta name="title" content="Blog | reversegif.com" />
        <meta name="description" content="Read our latest blog posts on reversegif.com." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Blog | reversegif.com" />
        <meta property="og:description" content="Read our latest blog posts on reversegif.com." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/blog" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | reversegif.com" />
        <meta name="twitter:description" content="Read our latest blog posts on reversegif.com." />
        <meta name="twitter:image" content="/metaimg.webp" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Hero title="Our Blog" description="Insights, Updates, and Guides" />
        
        {isLoading && posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-500">{error}</p>
            {apiResponse && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-64 text-left">
                <p className="font-bold mb-2">API Response (for debugging):</p>
                <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No posts found.</p>
            {apiResponse && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-64 text-left">
                <p className="font-bold mb-2">API Response (for debugging):</p>
                <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {posts.map((post, index) => (
                <div key={post.id || index}>
                  <StrapiPostCard post={post} />
                </div>
              ))}
            </div>
            
            {currentPage < paginationData.pageCount && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isLoading ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

// Fetch initial posts at build time
export async function getStaticProps() {
  try {
    const result = await fetchBlogPosts(1, POSTS_PER_PAGE);
    
    return {
      props: {
        initialPosts: result.data || [],
        pagination: result.meta.pagination || { page: 1, pageSize: POSTS_PER_PAGE, pageCount: 1, total: 0 }
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: {
        initialPosts: [],
        pagination: { page: 1, pageSize: POSTS_PER_PAGE, pageCount: 1, total: 0 }
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
}
