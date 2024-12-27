import express, { Response } from "express";
import {ENV} from "./config/index"
import orderRoute from "./route/orderRoute";
import cors from "cors"
import { createLogger, format, transports } from 'winston'; 

const app = express();

app.use(cors());
app.use(express.json());

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'combined.log' })
    ]
});

app.get('/', (_, res: Response) => {
    res.send("server is healthy")
})

app.use('/api/v1/orders', orderRoute);

app.listen(ENV.PORT, () => {
    logger.info(`Server is running on port: ${ENV.PORT}`);
});