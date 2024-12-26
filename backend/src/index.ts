import express, { Response } from "express";
import {ENV} from "./config/index"
import orderRoute from "./route/orderRoute";
import rateLimit from "express-rate-limit";
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimit());

app.get('/', (_, res: Response) => {
    res.send("server is healthy")
})

app.use('/api/v1/orders', orderRoute);

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port: ${ENV.PORT}`);
});