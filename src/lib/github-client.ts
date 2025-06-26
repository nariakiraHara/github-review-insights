import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

export const githubClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});