import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const StrapiPostCard = ({ post }) => {
  // Check if post is undefined
  if (!post) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Post is undefined");
    }
    return null; // Don't render anything if data is missing
  }

  if (process.env.NODE_ENV === 'development') {
    console.log("Post data:", post);
  }

  // Extract data from Strapi's response structure
  // Handle both possible structures: with attributes or direct properties
  const attributes = post.attributes || post;
  const { Title, Metadescription, publishedAt, SocialMediaMetaImage, slug } = attributes;
  
  if (!Title) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Title is missing in post:", post);
    }
    return null;
  }
  
  // Format date
  const formattedDate = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'No date';
  
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
  
  // Get cover image URL if available
  let coverImageUrl = '/default-image.png'; // Default fallback image
  
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
  
  // Use slug if available, otherwise use ID
  const postId = post.id || attributes.id;
  const postUrl = slug ? `/blog/${slug}` : `/blog/${postId}`;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image 
          src={coverImageUrl}
          alt={Title}
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
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{formattedDate}</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {Title}
        </h2>
        {Metadescription && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {Metadescription}
          </p>
        )}
        <Link 
          href={postUrl}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default StrapiPostCard; 