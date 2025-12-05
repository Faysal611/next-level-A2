import type { Request, Response } from "express";
import { app } from "./app.js";
import config from "./config/config.js";

app.get("/", (req: Request, res: Response) => {
    res.send({message: "welcome to vehicle rental system"})
})

app.listen(config.port, () => {
    console.log(`listening at ${config.port}`);
})