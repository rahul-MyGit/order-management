import express, { Request, Response } from "express";
import {ENV} from "./config/index"

const app = express()

app.use(express.json())

app.get('/', (_, res: Response) => {
    res.send("server is healthy")
})

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port: ${ENV.PORT}`);
    
})