import express from 'express';
import cors from 'cors';
import orderRouter from './route/orderRoute';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/v1/orders', orderRouter);

  return app;
}

export const app = createServer(); 