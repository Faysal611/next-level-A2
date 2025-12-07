import { usersService } from "./users.service.js";
const getAllUsers = async (req, res) => {
    try {
        const result = await usersService.getAllUsers();
        res.status(200).json({
            "success": true,
            "message": "Users retrieved successfully",
            "data": result.rows
        });
    }
    catch (err) {
        res.status(200).json({ message: err.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const result = await usersService.updateUser(req.body, req.params.userId, req.userTokenInfo);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const deleteUser = async (req, res) => {
    try {
        const result = await usersService.deleteUser(req.params.userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (err) {
        res.status(200).json({ message: err.message });
    }
};
export const usersController = {
    getAllUsers,
    updateUser,
    deleteUser
};
