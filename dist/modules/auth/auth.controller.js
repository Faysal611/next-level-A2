import { authService } from "./auth.service.js";
const createUser = async (req, res) => {
    try {
        const result = await authService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                ...result.rows[0]
            }
        });
    }
    catch (err) {
        res.status(500).json();
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                ...result
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const authController = {
    createUser,
    loginUser
};
