import { faker } from '@faker-js/faker';
import prisma from './prisma';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

const BATCH_SIZE = 100;

async function generateOrders(totalCount: number) {
  console.log('Starting seed...');
  const startTime = Date.now();

  try {
    for (let i = 0; i < totalCount; i += BATCH_SIZE) {
      const batchOrders = Array.from({ length: Math.min(BATCH_SIZE, totalCount - i) }, () => {

        // Generate random items (1-5 items per order)
        const itemCount = faker.number.int({ min: 1, max: 5 });
        const items: OrderItem[] = Array.from({ length: itemCount }, () => ({
          name: faker.commerce.productName(),
          quantity: faker.number.int({ min: 1, max: 10 }),
          price: parseFloat(faker.commerce.price({ min: 10, max: 200 }))
        }));

        // Calculate total order amount
        const orderAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        return {
          customerName: faker.person.fullName(),
          orderAmount: orderAmount,
          status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'cancelled']),
          items: items,
          createdAt: faker.date.past({ years: 1 })
        };
      });

      await prisma.order.createMany({
        data: batchOrders.map(order => ({
          ...order,
          items: JSON.stringify(order.items),
        })),
        skipDuplicates: true,
      });

      console.log(`Progress: ${Math.min(i + BATCH_SIZE, totalCount)}/${totalCount} records`);
    }

    const endTime = Date.now();
    console.log(`Seeding completed in ${(endTime - startTime) / 1000} seconds`);

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateOrders(10000)
  .catch((error) => {
    console.error(error);
    process.exit(1);
});