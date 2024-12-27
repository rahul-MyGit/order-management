import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from '../server';
import prisma from '../db/prisma';
import request from 'supertest';
import type { Order, Status } from '@prisma/client';

const app = createServer();

describe('Order API Endpoints', () => {
  let testOrders: Order[];

  beforeAll(async () => {

    testOrders = await Promise.all([
      prisma.order.create({
        data: {
          customerName: 'Test Customer 1',
          orderAmount: 100.50,
          status: 'pending' as Status,
          items: JSON.stringify([{ name: 'Item 1', quantity: 1, price: 100.50 }])
        }
      }),
      prisma.order.create({
        data: {
          customerName: 'Test Customer 2',
          orderAmount: 200.75,
          status: 'completed' as Status,
          items: JSON.stringify([{ name: 'Item 2', quantity: 2, price: 100.375 }])
        }
      }),
      prisma.order.create({
        data: {
          customerName: 'Test Customer 3',
          orderAmount: 300.25,
          status: 'processing' as Status,
          items: JSON.stringify([{ name: 'Item 3', quantity: 3, price: 100.083 }])
        }
      })
    ]);
  });

  afterAll(async () => {

    await prisma.order.deleteMany({
      where: {
        id: {
          in: testOrders.map(order => order.id)
        }
      }
    });
    await prisma.$disconnect();
  });

  describe('GET /api/v1/orders', () => {
    it('should return orders with default pagination', async () => {
      const response = await request(app)
        .get('/api/v1/orders')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('hasNextPage');
      expect(response.body).toHaveProperty('nextCursor');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });    
  });
}); 