import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://rsvgif.quantum.nullweb.net/graphql',
    // Browser will use native fetch automatically
  }),
  cache: new InMemoryCache(),
});

export default client;
