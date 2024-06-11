import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'node-fetch';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://rsvgif.quantum.nullweb.net/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
});

export default client;
