import express, { type Request, type Response } from "express";
import { init } from "./config/table.js";
import { authRouter } from "./modules/auth/auth.route.js";

export const app = express();

app.use(express.json());

init();

app.get("/", (req: Request, res: Response) => {
    res.send({ message: "welcome to vehicle rental system" })
})

app.use("/api/v1/auth", authRouter);