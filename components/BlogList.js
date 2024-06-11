import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllPosts } from '../lib/api';
import { stripHtmlTags } from '../lib/utils';

export default function BlogList({ currentPostId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const allPosts = await getAllPosts();
      const filteredPosts = allPosts.nodes.filter(post => post.id !== currentPostId);
      setPosts(filteredPosts);
    }
    fetchPosts();
  }, [currentPostId]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Other Blog Posts</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="flex items-start border-b border-gray-200 pb-2">
            {post.featuredImage && (
              <img
                src={post.featuredImage.node.sourceUrl}
                alt={post.title}
                className="w-24 h-24 object-cover mr-4"
              />
            )}
            <div>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stripHtmlTags(post.excerpt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
