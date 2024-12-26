import { Router } from "express";
import { getOrders } from "../controller/orderController";

const orderRoute = Router();

orderRoute.get('/', getOrders);

export default orderRoute;