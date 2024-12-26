import { Request } from "express";
import { querySchema } from "./order";

const allowedSortFields = ['createdAt', 'status', 'orderAmount', 'customerName']

export const verifyInputData = (req: Request) => {
    const inputData = querySchema.safeParse({
        cursor: req.query.cursor,
        limit: Number(req.query.limit) || 50,
        sort: allowedSortFields.includes(String(req.query.sort)) ? String(req.query.sort) : 'createdAt',
        sortDirection: String(req.query.sortDirection || 'desc')
    });

    if (!inputData.success) {
        throw inputData.error;
    }
    
    return inputData.data;
}