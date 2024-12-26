import { z } from "zod";

export const querySchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(50),
    sort: z.enum(['createdAt', 'orderAmount', 'customerName', 'status']).default('createdAt'),
    sortDirection: z.enum(['asc', 'desc']).default('desc'),
});
