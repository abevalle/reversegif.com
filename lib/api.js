import fetch from 'isomorphic-unfetch';

const API_URL = 'https://rsvgif.quantum.nullweb.net/graphql';

async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseText = await res.text();

  // Log the response for debugging
  console.log('Response:', responseText);

  // Handle non-JSON responses
  if (!res.ok) {
    throw new Error(`Network response was not ok: ${responseText}`);
  }

  const json = JSON.parse(responseText);
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getAllPosts() {
  const data = await fetchAPI(`
    {
      posts {
        nodes {
          id
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
  `);
  return data?.posts;
}
