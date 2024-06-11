import React from 'react';
import Header from '../../components/header.js';
import Footer from '../../components/footer.js';
import Head from 'next/head';
import { getPost, getAllPosts } from '../../lib/api';
import BlogList from '../../components/BlogList';
import PostMetadata from '../../components/PostMetadata';
import { stripHtmlTags } from '../../lib/utils';

export default function Post({ post }) {
  const excerpt = post.excerpt ? stripHtmlTags(post.excerpt) : '';
  const authorName = post.author ? post.author.node.name : 'Unknown Author';
  const postDate = post.date ? new Date(post.date).toLocaleDateString() : 'Unknown Date';
  const tags = post.tags ? post.tags.nodes : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>{post.title} | reversegif.com</title>
        <meta name="title" content={`${post.title} | reversegif.com`} />
        <meta name="description" content={excerpt} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${post.title} | reversegif.com`} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content={`https://reversegif.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | reversegif.com`} />
        <meta name="twitter:description" content={excerpt} />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <PostMetadata 
              author={authorName} 
              date={postDate} 
              tags={tags} 
            />
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="prose dark:prose-dark max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            <BlogList currentPostId={post.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return {
    props: {
      post,
    },
    revalidate: 10, // Revalidate at most once every 10 seconds
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.nodes.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // See the "fallback" section below
  };
}
