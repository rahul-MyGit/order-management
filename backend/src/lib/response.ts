import { Response } from "express"

export const ApiErrorResponse = (res: Response, code: number, message: string) => {
    res.status(code).json({
        success: false,
        message: message
    });
    return;
}