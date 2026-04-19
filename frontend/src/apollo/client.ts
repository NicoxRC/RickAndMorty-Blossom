import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;

const httpLink = new HttpLink({
  uri: graphqlUrl,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
