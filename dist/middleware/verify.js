import jwt, {} from "jsonwebtoken";
import config from "../config/config.js";
export const verify = (...roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(500).json({ message: "jwt not found" });
        }
        try {
            const decoded = jwt.verify(token, config.jwt_secret);
            if (!roles.includes(decoded.role)) {
                return res.status(500).json({ message: "unauthorized" });
            }
            req.userTokenInfo = decoded;
            next();
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};
