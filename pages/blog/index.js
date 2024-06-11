import React from 'react';
import Header from '../../components/header.js';
import Footer from '../../components/footer.js';
import Head from 'next/head';
import { getAllPosts } from '../../lib/api';
import BlogCard from '../../components/BlogCard';

export default function Blog({ posts }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Blog | reversegif.com</title>
        <meta name="title" content="Blog | reversegif.com" />
        <meta name="description" content="Explore our blog for the latest updates and insights." />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Blog | reversegif.com" />
        <meta property="og:description" content="Explore our blog for the latest updates and insights." />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/blog" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | reversegif.com" />
        <meta name="twitter:description" content="Explore our blog for the latest updates and insights." />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.nodes.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: {
      posts,
    },
    revalidate: 10, // Revalidate at most once every 10 seconds
  };
}
