import { Request, Response } from "express";
import { ApiErrorResponse } from "../lib/response";
import prisma from "../db/prisma";
import { verifyInputData } from "../types/orderVerify";

async function getEstimatedCount(): Promise<number> {
  try {
    const result = await prisma.$queryRaw`
      SELECT CAST(reltuples AS INTEGER) as estimate
      FROM pg_class
      WHERE relname = 'Order';
    `;
    return Number((result as any)[0]?.estimate) || 0;
  } catch (error) {
    console.error('Error getting estimated count:', error);
    return 0;
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { cursor, limit, sort, sortDirection } = verifyInputData(req);

    const query = {
      take: limit + 1,
      orderBy: { [sort]: sortDirection },
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1
      }),
      select: {
        id: true,
        customerName: true,
        orderAmount: true,
        status: true,
        createdAt: true,
      }
    };

    const items = await prisma.order.findMany(query);

    if (!items || items.length === 0) {
      return ApiErrorResponse(res, 404, "No items found");
    }

    const hasNextPage = items.length > limit;
    const data = hasNextPage ? items.slice(0, limit) : items;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    const totalCount = !cursor ? await getEstimatedCount() : undefined;

    res.json({
      data,
      nextCursor,
      totalCount,
      hasNextPage
    });
  } catch (error) {
    console.error('Error in getOrders:', error);
    ApiErrorResponse(res, 500, "Internal server Error");
  }
};
