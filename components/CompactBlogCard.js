import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CompactBlogCard = ({ post }) => {
  if (!post) return null;

  // Debug log to see the post structure
  if (process.env.NODE_ENV === 'development') {
    console.log('CompactBlogCard received post:', post);
  }

  const attributes = post.attributes || post;
  const { Title, Metadescription, slug, SocialMediaMetaImage } = attributes;
  
  if (!Title) return null;
  
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
  
  // Get image URL
  let imageUrl = '/default-image.png';
  
  // Debug log to see the image structure
  if (process.env.NODE_ENV === 'development') {
    console.log('SocialMediaMetaImage:', SocialMediaMetaImage);
  }
  
  if (SocialMediaMetaImage?.data?.attributes?.url) {
    const url = SocialMediaMetaImage.data.attributes.url;
    imageUrl = getFullImageUrl(url);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found image URL:', url, '-> Full URL:', imageUrl);
    }
  } else if (SocialMediaMetaImage?.url) {
    // Handle case where image data might be directly in SocialMediaMetaImage
    const url = SocialMediaMetaImage.url;
    imageUrl = getFullImageUrl(url);
    if (process.env.NODE_ENV === 'development') {
      console.log('Found direct image URL:', url, '-> Full URL:', imageUrl);
    }
  }
  
  const postUrl = slug ? `/blog/${slug}` : `/blog/${post.id}`;
  
  return (
    <Link 
      href={postUrl}
      className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group"
      style={{ minHeight: '80px', maxHeight: '120px' }}
    >
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded">
        <Image
          src={imageUrl}
          alt={Title}
          fill
          sizes="80px"
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src = '/default-image.png';
          }}
          unoptimized={false}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {Title}
        </h4>
        {Metadescription && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
            {Metadescription}
          </p>
        )}
      </div>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </Link>
  );
};

export default CompactBlogCard;