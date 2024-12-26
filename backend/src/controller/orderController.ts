import { Request, Response } from "express";
import { ApiErrorResponse } from "../lib/response";
import { get, setex, exists } from "../lib/redis";
import prisma from "../db/prisma";
import { verifyInputData } from "../types/orderVerify";

export const getOrders = async (req: Request, res: Response) => {
    try {
        const {cursor, limit, sort, sortDirection} = verifyInputData(req);
    
        const cacheKey = `orders:${cursor}:${limit}:${sort}:${sortDirection}`;
    
        const cachedData = await get(cacheKey);
        if (cachedData) {
          res.json(JSON.parse(cachedData));
          return;
        }
    
        const query: any = {
          take: limit + 1,
          orderBy: { [sort]: sortDirection },
          ...(cursor && {
            cursor: {
              id: cursor
            },
            skip: 1
          })
        };

        const items = await prisma.order.findMany(query);
        if(!items) return ApiErrorResponse(res,401,"Items not found");
    
        const hasNextPage = items.length > limit;
        const data = items.slice(0, limit);
        const nextCursor = hasNextPage ? data[data.length - 1].id : null;
    
        const result = {
          data,
          nextCursor,
          totalCount: await get('orders:total-count').then(count => 
            count ? Number(count) : prisma.order.count()
          )
        };
    
        await setex(cacheKey, 300, JSON.stringify(result));
    
        if (!await exists('orders:total-count')) {
          const count = await prisma.order.count();
          await setex('orders:total-count', 3600, String(count)); 
        }
    
        res.json(result);
        return;
    
      } catch (error) {
        ApiErrorResponse(res, 500, "Internal server Error")
      }
}
