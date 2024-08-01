import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import router from './router/index.jsx'
import { Toaster } from 'react-hot-toast';
import './index.css'

const client = new ApolloClient({
  uri: 'http://127.0.0.1:4003/',
  cache: new InMemoryCache(),
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
