import React from 'react';
import Link from 'next/link';
import { stripHtmlTags } from '../lib/utils';

export default function BlogCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      {post.featuredImage && (
        <img
          src={post.featuredImage.node.sourceUrl}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-4">
        <span className="bg-purple-200 text-purple-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Article</span>
        <h2 className="text-xl font-bold my-2">
          <Link href={`/blog/${post.slug}`}>
            <span className="text-blue-600 dark:text-blue-400 hover:underline">{post.title}</span>
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{stripHtmlTags(post.excerpt)}</p>
        <div className="flex items-center">
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.author.node.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
