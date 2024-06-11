import { useQuery, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import client from '../../lib/apollo-client';
import BlogCard from '../../components/BlogCard';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Head from 'next/head';

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      nodes {
        title
        excerpt
        slug
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

const BlogIndex = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Blog | reversegif.com</title>
        <meta name="description" content="Reverse GIF Blog" />
        <meta property="og:title" content="Blog | reversegif.com" />
        <meta property="og:description" content="Reverse GIF Blog" />
        <meta property="og:image" content="/metaimg.webp" />
        <meta property="og:url" content="https://reversegif.com/blog" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | reversegif.com" />
        <meta name="twitter:description" content="Reverse GIF Blog" />
        <meta name="twitter:image" content="/metaimg.webp" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.posts.nodes.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              slug={post.slug}
              date={post.date}
              featuredImage={post?.featuredImage?.node?.sourceUrl}
              author={post?.author?.node?.name}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BlogPage = () => (
  <ApolloProvider client={client}>
    <BlogIndex />
  </ApolloProvider>
);

export default BlogPage;
