// components/BlogPostCard.js
import React from 'react';
import Link from 'next/link';

const BlogPostCard = ({ post }) => (
  <div key={post.slug} className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-2">
      <Link href={`/blog/${post.slug}`}>
        <a>{post.title}</a>
      </Link>
    </h2>
    <p>{post.excerpt}</p>
  </div>
);

export default BlogPostCard;
