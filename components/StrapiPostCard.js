import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const StrapiPostCard = ({ post }) => {
  // Check if post is undefined
  if (!post) {
    console.log("Post is undefined");
    return null; // Don't render anything if data is missing
  }

  console.log("Post data:", post);

  // Extract data from Strapi's response structure
  // Handle both possible structures: with attributes or direct properties
  const attributes = post.attributes || post;
  const { Title, Metadescription, publishedAt, SocialMediaMetaImage, slug } = attributes;
  
  if (!Title) {
    console.log("Title is missing in post:", post);
    return null;
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
  
  // Use slug if available, otherwise use ID
  const postId = post.id || attributes.id;
  const postUrl = slug ? `/blog/${slug}` : `/blog/${postId}`;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image 
          src={coverImageUrl}
          alt={Title}
          layout="fill"
          objectFit="cover"
          priority={false}
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