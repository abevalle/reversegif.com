// components/BlogCard.js
import React from 'react';
import Link from 'next/link';

const BlogCard = ({ post }) => {
  return (
    <article className="max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Link href={`/blog/${post.slug}`}>
        <a>
          <img src="https://via.placeholder.com/150" className="w-full h-48 object-cover" alt={post.title} />
        </a>
      </Link>
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          <Link href={`/blog/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{post.excerpt}</p>
        <div className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          By {post.author.node.name} on {new Date(post.date).toLocaleDateString()}
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
