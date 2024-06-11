import React from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Head from 'next/head';
import PostMetadata from '../../components/PostMetadata';
import stripHtmlTags from '../../lib/utils';
import BlogList from '../../components/BlogList';

const GET_POST = gql`
  query GetPost($slug: String!) {
    postBy(slug: $slug) {
      title
      content
      date
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { slug },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const post = data?.postBy;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 antialiased">
      <Head>
        <title>{post.title} | reversegif.com</title>
        <meta name="description" content={post.title} />
      </Head>
      <Header />
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-2xl">
            <header className="mb-4 lg:mb-6">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <img className="mr-4 w-16 h-16 rounded-full" src={post.author.node.avatar.url} alt={post.author.node.name} />
                  <div>
                    <a href="#" rel="author" className="text-xl font-bold text-gray-900 dark:text-white">{post.author.node.name}</a>
                    <p className="text-base text-gray-500 dark:text-gray-400"><time pubdate datetime={post.date}>{new Date(post.date).toLocaleDateString()}</time></p>
                  </div>
                </div>
              </address>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">{post.title}</h1>
            </header>
            <div className="prose dark:prose-dark">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>
        </div>
      </main>
      <aside aria-label="Related articles" className="py-8 lg:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-screen-xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Related articles</h2>
          <div className="grid gap-12 sm:grid-cols-2">
            <BlogList/>
          </div>
        </div>
      </aside>
      <Footer />
    </div>
  );
};

export default BlogPost;
