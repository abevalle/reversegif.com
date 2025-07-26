import React, { useMemo, useState, useEffect } from 'react';
import { fetchFeaturedBlogPosts } from '../lib/strapi-api';
import CompactBlogCard from '../components/CompactBlogCard';
import Link from 'next/link';

// Move the GIF selection logic outside the component to prevent re-initialization
const allGifs = [
  'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
  'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
  'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
  'https://media.giphy.com/media/l0HlUOry8A07NfL5q/giphy.gif',
  'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif',
  'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
  'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
  'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
];

// Use a deterministic selection to prevent hydration mismatch
const selectedGifs = allGifs.slice(0, 4);

const ExampleGifs = ({ hideExamples = false }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // State for client-side GIF randomization
  const [displayGifs, setDisplayGifs] = useState(selectedGifs);
  
  // Randomize GIFs after initial mount to avoid hydration mismatch
  useEffect(() => {
    const shuffleArray = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    
    setDisplayGifs(shuffleArray(allGifs).slice(0, 4));
  }, []);

  // Fetch featured blog posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const posts = await fetchFeaturedBlogPosts(3);
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="text-center p-4">
      {!hideExamples && (
        <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4">
          <div className="mb-4 md:mb-0">
            <p className="text-lg text-gray-900 dark:text-gray-100">No GIF?</p>
            <p className="text-lg text-gray-900 dark:text-gray-100">Try one of these:</p>
          </div>
          <div className="flex space-x-4">
            {displayGifs.map((gif, index) => (
              <div key={index} className="w-16 h-16 relative rounded-lg overflow-hidden">
                <img
                  src={gif}
                  alt={`Example GIF ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
        By uploading a GIF you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a>. To learn more about how reversegif handles your personal data, check our <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
      </p>

      {/* Blog Posts Section */}
      {blogPosts.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col gap-3 text-left max-w-3xl mx-auto">
            {blogPosts.map((post, index) => (
              <CompactBlogCard key={post.id || index} post={post} />
            ))}
          </div>
          <Link 
            href="/blog"
            className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all posts
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExampleGifs;
