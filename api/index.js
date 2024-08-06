import express from 'express';
// import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import resolvers from './src/graphql/resolvers.js';
import mongodbConnections from './src/config/mongodbConnections.js';
import { testConnectionMySQL } from './src/config/mysqlConnections.js';
import { WebSocket, WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

dotenv.config();
// import express from 'express';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4003;
const typeDefs = loadSchemaSync('./src/graphql/typeDefs.gql', {
  loaders: [new GraphQLFileLoader()]
});

app.use(cors());
// app.use(morgan('dev'));
app.use(express.json());

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subs'
})

const wsServerCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
  {
    async serverWillStart() {
      return {
        async drainServer() {
          await wsServerCleanup.dispose();
        }
      }
    }
  }
  ]
})

await server.start();

app.use(
  '/',
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
)

try {
  await mongodbConnections();
  await testConnectionMySQL();
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
} catch (error) {
  console.log(error);
}
