// pages/blog/index.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import BlogCard from '../../components/BlogCard';
import Header from '../../components/header';
import Footer from '../../components/footer';

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      nodes {
        slug
        title
        excerpt
        date
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

export default function Blog() {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const posts = data?.posts?.nodes || [];// components/BlogList.js
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    );
  };
  
  export default BlogList;
  

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
