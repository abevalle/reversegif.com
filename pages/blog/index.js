import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import BlogCard from '../../components/BlogCard';

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      nodes {
        slug
        title
        excerpt
      }
    }
  }
`;

export default function Blog() {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { posts } = data;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Blog | reversegif.com</title>
        <meta name="title" content="Blog | reversegif.com" />
        <meta name="description" content="Read the latest posts on reversegif.com" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Blog | reversegif.com" />
        <meta property="og:description" content="Read the latest posts on reversegif.com" />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/blog" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | reversegif.com" />
        <meta name="twitter:description" content="Read the latest posts on reversegif.com" />
        <meta name="twitter:image" content="/metaimg.webp" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-4">Blog</h1>
            {posts.nodes.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
