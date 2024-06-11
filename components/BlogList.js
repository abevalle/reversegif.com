// components/BlogList.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import BlogCard from './BlogCard';

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      nodes {
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

const BlogList = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const posts = data?.posts?.nodes || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {posts.map(post => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
