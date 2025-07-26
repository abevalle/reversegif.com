// components/BlogPostCard.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BlogPostCard = ({ post }) => {
  // Function to get the full image URL
  const getFullImageUrl = (src) => {
    if (!src) return '/default-image.png';
    
    // If it's already a full URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      // Convert DigitalOcean Spaces URLs to use CDN
      if (src.includes('nyc3.digitaloceanspaces.com')) {
        return src.replace('nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com');
      }
      return src;
    }
    
    // If it's a DigitalOcean Spaces path without protocol
    if (src.includes('vs-strapi.nyc3.digitaloceanspaces.com')) {
      // It's already a Digital Ocean path, just needs https://
      const cdnUrl = `https://${src}`.replace('nyc3.digitaloceanspaces.com', 'nyc3.cdn.digitaloceanspaces.com');
      return cdnUrl;
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

  // Get thumbnail URL - check various possible paths
  let thumbnailUrl = '/default-image.png';
  
  if (post.thumbnail) {
    thumbnailUrl = getFullImageUrl(post.thumbnail);
  } else if (post.image) {
    thumbnailUrl = getFullImageUrl(post.image);
  } else if (post.coverImage) {
    thumbnailUrl = getFullImageUrl(post.coverImage);
  } else if (post.SocialMediaMetaImage?.data?.attributes?.url) {
    thumbnailUrl = getFullImageUrl(post.SocialMediaMetaImage.data.attributes.url);
  } else if (post.SocialMediaMetaImage?.url) {
    thumbnailUrl = getFullImageUrl(post.SocialMediaMetaImage.url);
  }

  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image 
          src={thumbnailUrl}
          alt={post.title || 'Blog post thumbnail'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-5 text-gray-500">
          <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
            <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
            Article
          </span>
          <span className="text-sm">{post.date || '14 days ago'}</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="mb-5 font-light text-gray-500 dark:text-gray-400">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <Link 
            href={`/blog/${post.slug}`} 
            className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline"
          >
            Read more
            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
