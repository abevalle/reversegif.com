// components/BlogCard.js
import React from 'react';
import Link from 'next/link';

const BlogCard = ({ post }) => {
  const { slug, title, excerpt, date, featuredImage, author } = post;

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      {featuredImage && (
        <img className="w-full h-48 object-cover rounded-t-lg" src={featuredImage.node.sourceUrl} alt={title} />
      )}
      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-gray-500 dark:text-gray-400">
            <span>By {author.node.name}</span> | <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <Link href={`/blog/${slug}`}>
            <a className="text-primary-600 dark:text-primary-500 hover:underline">Read more</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
