import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';

// import { typeDefs } from './types/schema';
// import { resolvers } from './resolvers';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import './models';

const PORT = process.env.PORT ?? 4000;

async function bootstrap(): Promise<void> {
  // Connect to PostgreSQL
  await connectDatabase();

  // Connect to Redis
  await connectRedis();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Apollo Server setup
  // const server = new ApolloServer({ typeDefs, resolvers });
  // await server.start();

  // app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
