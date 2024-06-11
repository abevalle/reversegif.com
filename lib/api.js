import client from './apollo-client';
import { gql } from '@apollo/client';

export const getAllPostsWithSlug = async () => {
  const { data } = await client.query({
    query: gql`
      query GetAllPostsWithSlug {
        posts {
          nodes {
            slug
          }
        }
      }
    `,
  });
  return data?.posts?.nodes || [];
};

export const getPost = async (slug) => {
  const { data } = await client.query({
    query: gql`
      query GetPost($slug: String!) {
        postBy(slug: $slug) {
          title
          content
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
    `,
    variables: { slug },
  });
  return data?.postBy || null;
};

export const getAllPosts = async () => {
  const { data } = await client.query({
    query: gql`
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
    `,
  });
  return data?.posts?.nodes || [];
};
