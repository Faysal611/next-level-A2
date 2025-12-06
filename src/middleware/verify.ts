import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/config.js";

export const verify = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token= req.headers.authorization?.split(" ")[1];

        if(!token) {
            return res.status(500).json({ message: "jwt not found" })
        }

        try {
            const decoded = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload;
            
            if (!roles.includes(decoded.role)) {
                return res.status(500).json({ message: "unauthorized" })
            }

            req.userTokenInfo = decoded;
            next();
        } catch (err: any) {
            res.status(500).json({message: err.message})
        }
    }
}