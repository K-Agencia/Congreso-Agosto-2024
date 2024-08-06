import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { createClient } from 'graphql-ws';
import router from './router/index.jsx'
import { Toaster } from 'react-hot-toast';
import './index.css'
// import { getMainDefinition } from '@apollo/client/utilities';

// const httpLink = new HttpLink({
//   // uri: 'https://127.0.0.1:4003/api/',
//   uri: 'https://colgatesiemprecontigo.col1.co/api/',
// });

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: 'ws://127.0.0.1:4003/subs',
//     // url: 'ws://colgatesiemprecontigo.col1.co/api/',
//   }),
// );

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// );

const client = new ApolloClient({
  uri: 'http://127.0.0.1:4003/',
  // link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
    <Toaster
      toastOptions={{
        duration: 8000
      }}
    />
  </ApolloProvider>,
)
