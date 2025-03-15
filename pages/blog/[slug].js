import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { fetchBlogPosts, fetchBlogPostBySlug, checkPostExists } from '../../lib/strapi-api';
import StrapiPostCard from '../../components/StrapiPostCard';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query; // This will be the slug
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  // Fetch post data when slug is available
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetching post with slug:', slug);
        }
        
        // Fetch the post
        const postData = await fetchBlogPostBySlug(slug);
        if (process.env.NODE_ENV === 'development') {
          console.log('Post API Response:', postData);
        }
        setApiResponse(postData);
        
        if (!postData) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Post not found for slug:', slug);
          }
          setError('Post not found');
          setIsLoading(false);
          return;
        }
        
        setPost(postData);
        
        // Fetch related posts
        const relatedResult = await fetchBlogPosts(1, 3);
        if (process.env.NODE_ENV === 'development') {
          console.log('Related posts API response:', relatedResult);
        }
        
        // Filter out the current post from related posts
        if (relatedResult && relatedResult.data && Array.isArray(relatedResult.data)) {
          const filteredRelated = relatedResult.data.filter(p => {
            // Using slug for comparison
            return p.attributes?.slug !== slug;
          });
          setRelatedPosts(filteredRelated.slice(0, 3));
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching post data:', err);
        }
        setError(`Failed to load the blog post: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Loading post...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-xl text-red-500">{error}</p>
          {apiResponse && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-64 text-left">
              <p className="font-bold mb-2">API Response (for debugging):</p>
              <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          )}
          <div className="mt-8">
            <Link 
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If post not found
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/blog"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract post data - handle both possible structures
  const attributes = post.attributes || post;
  const { Title, Body, Metadescription, Keywords, publishedAt, SocialMediaMetaImage, slug: postSlug } = attributes;

  if (!Title || !Body) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Invalid Post Data</h1>
          <p className="mb-8">The post data is incomplete or in an unexpected format.</p>
          <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-64 text-left">
            <p className="font-bold mb-2">Post Data Structure:</p>
            <pre className="text-xs">{JSON.stringify(post, null, 2)}</pre>
          </div>
          {apiResponse && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-64 text-left">
              <p className="font-bold mb-2">API Response (for debugging):</p>
              <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          )}
          <div className="mt-8">
            <Link 
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format date
  const formattedDate = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'No date';

  // Get cover image URL if available
  let coverImageUrl = '/placeholder-blog.jpg'; // Default fallback image
  
  if (SocialMediaMetaImage?.data?.attributes?.url) {
    coverImageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${SocialMediaMetaImage.data.attributes.url}`;
  } else if (SocialMediaMetaImage?.url) {
    coverImageUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${SocialMediaMetaImage.url}`;
  }

  // Determine if Body is structured content or markdown
  const isStructuredContent = Array.isArray(Body) && Body.length > 0 && typeof Body[0] === 'object';
  
  // For debugging
  console.log('Body type:', typeof Body);
  console.log('Is structured content:', isStructuredContent);
  console.log('Body preview:', typeof Body === 'string' ? Body.substring(0, 100) : 'Not a string');

  // Helper function to render Strapi structured content
  const renderStructuredContent = (content) => {
    if (!content || !Array.isArray(content)) {
      return <p>No content available</p>;
    }

    return content.map((block, blockIndex) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={blockIndex} className="mb-4">
              {block.children.map((child, childIndex) => {
                if (child.type === 'link') {
                  return (
                    <a 
                      key={childIndex}
                      href={child.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {child.children[0]?.text || child.url}
                    </a>
                  );
                }
                return (
                  <span 
                    key={childIndex}
                    className={`
                      ${child.bold ? 'font-bold' : ''}
                      ${child.italic ? 'italic' : ''}
                      ${child.underline ? 'underline' : ''}
                    `}
                  >
                    {child.text}
                  </span>
                );
              })}
            </p>
          );
        case 'heading':
          const HeadingTag = `h${block.level}`;
          return (
            <HeadingTag 
              key={blockIndex} 
              className={`
                font-bold 
                ${block.level === 1 ? 'text-3xl mb-6' : ''}
                ${block.level === 2 ? 'text-2xl mb-4 mt-8' : ''}
                ${block.level === 3 ? 'text-xl mb-3 mt-6' : ''}
                ${block.level === 4 ? 'text-lg mb-2 mt-4' : ''}
              `}
            >
              {block.children.map((child, childIndex) => (
                <span 
                  key={childIndex}
                  className={`
                    ${child.bold ? 'font-bold' : ''}
                    ${child.italic ? 'italic' : ''}
                    ${child.underline ? 'underline' : ''}
                  `}
                >
                  {child.text}
                </span>
              ))}
            </HeadingTag>
          );
        case 'image':
          return (
            <div key={blockIndex} className="my-6">
              <img 
                src={block.url} 
                alt={block.alt || 'Image'} 
                className="max-w-full h-auto rounded"
              />
              {block.caption && (
                <p className="text-sm text-gray-600 mt-2">{block.caption}</p>
              )}
            </div>
          );
        case 'list':
          const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={blockIndex} className={block.format === 'ordered' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4'}>
              {block.children.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.children.map((child, childIndex) => (
                    <span key={childIndex}>{child.text}</span>
                  ))}
                </li>
              ))}
            </ListTag>
          );
        default:
          return null;
      }
    });
  };

  // Custom components for ReactMarkdown
  const customComponents = {
    img: ({ node, ...props }) => {
      // Get image dimensions or use defaults
      const width = 800;  // Default width
      const height = 450; // Default height (16:9 aspect ratio)
      
      // Function to get the full image URL
      const getFullImageUrl = (src) => {
        if (!src) return '';
        // If it's already a full URL, return it
        if (src.startsWith('http://') || src.startsWith('https://')) {
          return src;
        }
        // Otherwise, prepend the Strapi URL
        return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${src}`;
      };
      
      // Get the full image URL
      const fullImageUrl = getFullImageUrl(props.src);
      
      // Check if the image URL is valid
      if (!fullImageUrl) {
        console.error('Invalid image URL:', props.src);
        return null;
      }
      
      // Extract domain from src
      let domain = '';
      try {
        const url = new URL(fullImageUrl);
        domain = url.hostname;
      } catch (error) {
        console.error('Error parsing URL:', error);
        return null;
      }
      
      // List of trusted domains
      const trustedDomains = [
        'blg01.coolify.valle.us',
        'media.giphy.com',
        'u488cwcco0gw00048g4wgoo0.coolify.valle.us'
      ];
      
      // If the domain is trusted, use Next Image component
      if (trustedDomains.includes(domain)) {
        return (
          <div className="my-6">
            <Image
              src={fullImageUrl}
              alt={props.alt || 'Image'}
              width={width}
              height={height}
              className="max-w-full h-auto rounded"
              style={{ objectFit: 'contain' }}
            />
          </div>
        );
      }
      
      // Fallback to regular img tag for other domains
      return (
        <div className="my-6">
          <img 
            src={fullImageUrl}
            alt={props.alt || 'Image'} 
            className="max-w-full h-auto rounded"
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>{Title} | reversegif.com</title>
        <meta name="description" content={Metadescription || Title} />
        {Keywords && <meta name="keywords" content={Keywords} />}
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${Title} | reversegif.com`} />
        <meta property="og:description" content={Metadescription || Title} />
        <meta property="og:image" content={coverImageUrl} />
        <meta property="og:type" content="article" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={Title} />
        <meta name="twitter:description" content={Metadescription || Title} />
        <meta name="twitter:image" content={coverImageUrl} />
        {/* Canonical URL - use slug if available */}
        {postSlug && <link rel="canonical" href={`https://reversegif.com/blog/${postSlug}`} />}
      </Head>

      <Header />

      <main className="flex-grow">
        {/* Hero section with cover image */}
        <div className="relative w-full h-64 md:h-96">
          <Image
            src={coverImageUrl}
            alt={Title}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{Title}</h1>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Date info */}
            <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {isStructuredContent ? (
                renderStructuredContent(Body)
              ) : typeof Body === 'string' ? (
                <ReactMarkdown components={customComponents}>{Body}</ReactMarkdown>
              ) : (
                <div>
                  <p className="text-red-500">Unable to render content. Content type: {typeof Body}</p>
                  <pre className="text-xs bg-gray-100 p-4 rounded mt-4 overflow-auto">
                    {JSON.stringify(Body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related posts section */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-800 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">Related Posts</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((post, index) => (
                  <div key={post.id || index}>
                    <StrapiPostCard post={post} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Generate static paths for all blog posts
export async function getStaticPaths() {
  try {
    // Fetch all blog posts (limit to 100 for build time)
    const result = await fetchBlogPosts(1, 100);
    const posts = result.data || [];
    
    console.log(`Found ${posts.length} posts for static paths generation`);
    
    // Create paths for each post using slug if available
    const paths = posts
      .filter(post => post.attributes && post.attributes.slug) // Only include posts with slugs
      .map(post => ({
        params: { slug: post.attributes.slug }
      }));
    
    console.log(`Generated ${paths.length} static paths for blog posts`);
    
    return {
      paths,
      fallback: 'blocking' // Generate pages for new posts on-demand
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

// Fetch data for a specific blog post
export async function getStaticProps({ params }) {
  try {
    console.log('getStaticProps for blog post with slug:', params.slug);
    
    // Fetch the post by slug
    const post = await fetchBlogPostBySlug(params.slug);
    
    // If post not found, return 404
    if (!post) {
      console.log('Post not found for slug:', params.slug);
      return {
        notFound: true
      };
    }
    
    console.log('Post found:', post.id || (post.attributes && post.attributes.id));
    
    // Fetch related posts (simple implementation - just get latest 3 posts)
    const relatedResult = await fetchBlogPosts(1, 3);
    
    // Filter out the current post from related posts
    let relatedPosts = [];
    if (relatedResult && relatedResult.data) {
      relatedPosts = relatedResult.data.filter(p => {
        // Using slug for comparison
        return p.attributes?.slug !== params.slug;
      }).slice(0, 3); // Limit to 3 related posts
    }
    
    return {
      props: {
        post,
        relatedPosts
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true
    };
  }
}
