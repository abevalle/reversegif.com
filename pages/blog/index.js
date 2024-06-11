// pages/blog/index.js
import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import Hero from '../../components/Hero';
import BlogPostCard from '../../components/BlogPostCard';

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

  const posts = data?.posts?.nodes || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Blog | reversegif.com</title>
        <meta name="title" content="Blog | reversegif.com" />
        <meta name="description" content="Read our latest blog posts on reversegif.com." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Blog | reversegif.com" />
        <meta property="og:description" content="Read our latest blog posts on reversegif.com." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/blog" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | reversegif.com" />
        <meta name="twitter:description" content="Read our latest blog posts on reversegif.com." />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Hero title="Our Blog" description="We use an agile approach to test assumptions and connect with the needs of your audience early and often." />
        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map((post) => <BlogPostCard key={post.slug} post={post} />)
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
