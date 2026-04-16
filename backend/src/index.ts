import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './types/schema';
import { resolvers } from './resolvers/index';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import './models/index';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { startCharacterSyncJob } from './jobs/character-sync.job';
import { swaggerSpec } from './config/swagger';

const PORT = process.env.PORT ?? 4000;

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(loggerMiddleware);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  startCharacterSyncJob();

  app.use('/graphql', expressMiddleware(server));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
