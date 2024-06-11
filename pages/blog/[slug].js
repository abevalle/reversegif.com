import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Head from 'next/head';
import PostMetadata from '../../components/PostMetadata';
import stripHtmlTags from '../../lib/utils';

const GET_POST = gql`
  query GetPost($slug: String!) {
    postBy(slug: $slug) {
      title
      excerpt
      content
      date
      author {
        node {
          name
        }
      }
      tags {
        nodes {
          name
        }
      }
    }
  }
`;

export default function Post() {
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { slug },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data?.postBy;

  if (!post) return <p>Post not found</p>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>{post.title} | reversegif.com</title>
        <meta name="title" content={`${post.title} | reversegif.com`} />
        <meta name="description" content={stripHtmlTags(post.excerpt)} />
        <meta property="og:title" content={`${post.title} | reversegif.com`} />
        <meta property="og:description" content={stripHtmlTags(post.excerpt)} />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content={`https://reversegif.com/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | reversegif.com`} />
        <meta name="twitter:description" content={stripHtmlTags(post.excerpt)} />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
            <PostMetadata 
              author={post.author.node.name} 
              date={post.date} 
              tags={post.tags.nodes || []} 
            />
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="prose dark:prose-dark max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
