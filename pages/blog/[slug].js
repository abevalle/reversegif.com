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
  let coverImageUrl = '/default-image.png'; // Default fallback image
  
  // Function to get the full image URL
  const getFullImageUrl = (src) => {
    if (!src) return '/default-image.png';
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Processing image URL:', src);
    }
    
    // If it's already a full URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      let finalUrl = src;
      
      // Convert DigitalOcean Spaces URLs to use CDN
      if (src.includes('nyc3.digitaloceanspaces.com')) {
        // Check specific patterns first, then general ones
        if (src.includes('/vs-strapi/')) {
          // Handle both CDN and non-CDN URLs with vs-strapi path
          // Transform: https://nyc3.digitaloceanspaces.com/vs-strapi/file.gif -> https://vs-strapi.nyc3.cdn.digitaloceanspaces.com/file.gif
          // Transform: https://nyc3.cdn.digitaloceanspaces.com/vs-strapi/file.gif -> https://vs-strapi.nyc3.cdn.digitaloceanspaces.com/file.gif
          const match = src.match(/https?:\/\/(nyc3\.(?:cdn\.)?digitaloceanspaces\.com)\/vs-strapi\/(.*)/);
          if (match) {
            finalUrl = `https://vs-strapi.nyc3.cdn.digitaloceanspaces.com/${match[2]}`;
          }
        } else if (!src.includes('nyc3.cdn.digitaloceanspaces.com')) {
          // For other patterns without /vs-strapi/, just add CDN
          // https://vs-strapi.nyc3.digitaloceanspaces.com/... -> https://vs-strapi.nyc3.cdn.digitaloceanspaces.com/...
          finalUrl = src.replace('nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com');
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Transformed URL:', finalUrl);
      }
      
      return finalUrl;
    }
    
    // If it's a DigitalOcean Spaces path without protocol
    if (src.includes('nyc3.digitaloceanspaces.com') || src.includes('nyc3.cdn.digitaloceanspaces.com')) {
      // It's already a Digital Ocean path, just needs https://
      return `https://${src}`;
    }
    
    // If it's a local image (starts with /)
    if (src.startsWith('/')) {
      // For relative paths, assume they're on DigitalOcean Spaces
      if (src.startsWith('/uploads/')) {
        // Remove /uploads/ prefix and construct DigitalOcean URL
        const filename = src.replace('/uploads/', '');
        return `https://vs-strapi.nyc3.cdn.digitaloceanspaces.com/${filename}`;
      }
      // Other local paths, return as is
      return src;
    }
    
    // For any other case, assume it's a filename on DigitalOcean Spaces
    return `https://vs-strapi.nyc3.cdn.digitaloceanspaces.com/${src}`;
  };
  
  if (SocialMediaMetaImage?.data?.attributes?.url) {
    const imageUrl = getFullImageUrl(SocialMediaMetaImage.data.attributes.url);
    if (imageUrl) coverImageUrl = imageUrl;
  } else if (SocialMediaMetaImage?.url) {
    const imageUrl = getFullImageUrl(SocialMediaMetaImage.url);
    if (imageUrl) coverImageUrl = imageUrl;
  }

  // For debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Cover Image URL:', coverImageUrl);
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
          // Handle different possible image URL structures from Strapi
          let imageUrl = block.url;
          
          // Check if URL is nested in image object
          if (!imageUrl && block.image) {
            if (block.image.url) {
              imageUrl = block.image.url;
            } else if (block.image.data && block.image.data.attributes && block.image.data.attributes.url) {
              imageUrl = block.image.data.attributes.url;
            }
          }
          
          // Log for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('Image block:', { 
              blockStructure: block, 
              extractedUrl: imageUrl 
            });
          }
          
          // Use the global getFullImageUrl function to handle all URL transformations
          const processedImageUrl = getFullImageUrl(imageUrl);
          
          return (
            <div key={blockIndex} className="my-6">
              <img 
                src={processedImageUrl} 
                alt={block.alt || block.image?.alternativeText || 'Image'} 
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  console.error('Image failed to load:', {
                    processed: processedImageUrl,
                    original: imageUrl,
                    block: block
                  });
                }}
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
    p: ({ children }) => {
      // Check if the paragraph contains only an image
      if (children && children.length === 1 && children[0]?.type === 'img') {
        return <>{children}</>;
      }
      return <p>{children}</p>;
    },
    img: ({ node, ...props }) => {
      console.log('Markdown img component received:', props.src);
      
      // Get image dimensions or use defaults
      const width = 800;  // Default width
      const height = 450; // Default height (16:9 aspect ratio)
      
      // Function to get the full image URL - using the global one instead
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
        'u488cwcco0gw00048g4wgoo0.coolify.valle.us',
        'vs-strapi.nyc3.digitaloceanspaces.com',
        'vs-strapi.nyc3.cdn.digitaloceanspaces.com',
        'nyc3.digitaloceanspaces.com',
        'nyc3.cdn.digitaloceanspaces.com'
      ];
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Image domain check:', {
          extractedDomain: domain,
          isTrusted: trustedDomains.includes(domain),
          fullUrl: fullImageUrl
        });
      }
      
      // If the domain is trusted
      if (trustedDomains.includes(domain)) {
        // For GIFs or external domains that might have CORS issues, use regular img tag
        const isGif = fullImageUrl.toLowerCase().endsWith('.gif');
        const isExternalDomain = domain.includes('coolify.valle.us');
        
        if (isGif || isExternalDomain) {
          // Use regular img tag to avoid CORS issues
          return (
            <span className="block my-6">
              <img 
                src={fullImageUrl}
                alt={props.alt || 'Image'} 
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  console.error('Image failed to load:', {
                    src: fullImageUrl,
                    alt: props.alt,
                    originalSrc: props.src
                  });
                  // Don't immediately replace with default - let's see the actual error
                  // e.currentTarget.src = '/default-image.png';
                }}
              />
            </span>
          );
        }
        
        // For non-GIF images from trusted domains, use Next Image
        return (
          <span className="block my-6">
            <Image
              src={fullImageUrl}
              alt={props.alt || 'Image'}
              width={width}
              height={height}
              className="max-w-full h-auto rounded"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.src = '/default-image.png';
              }}
              unoptimized={false}
            />
          </span>
        );
      }
      
      // Fallback to regular img tag for other domains
      console.warn('Image using fallback renderer (untrusted domain):', {
        domain: domain,
        url: fullImageUrl
      });
      return (
        <span className="block my-6">
          <img 
            src={fullImageUrl}
            alt={props.alt || 'Image'} 
            className="max-w-full h-auto rounded"
            onError={(e) => {
              e.currentTarget.src = '/default-image.png';
            }}
          />
        </span>
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
            fill
            sizes="100vw"
            priority={true}
            style={{ objectFit: 'cover' }}
            className="transition-opacity opacity-0 duration-500"
            onLoad={(e) => {
              e.currentTarget.classList.remove('opacity-0');
            }}
            onError={(e) => {
              e.currentTarget.src = '/default-image.png';
            }}
            unoptimized={false}
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
    
    
    // Create paths for each post using slug if available
    const paths = posts
      .filter(post => post.attributes && post.attributes.slug) // Only include posts with slugs
      .map(post => ({
        params: { slug: post.attributes.slug }
      }));
    
    
    return {
      paths,
      fallback: 'blocking' // Generate pages for new posts on-demand
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

// Fetch data for a specific blog post
export async function getStaticProps({ params }) {
  try {
    
    // Fetch the post by slug
    const post = await fetchBlogPostBySlug(params.slug);
    
    // If post not found, return 404
    if (!post) {
      return {
        notFound: true
      };
    }
    
    
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
    return {
      notFound: true
    };
  }
}
