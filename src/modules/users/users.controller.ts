import type { Request, Response } from "express";
import { usersService } from "./users.service.js";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersService.getAllUsers();
        res.status(200).json({
            "success": true,
            "message": "Users retrieved successfully",
            "data": result.rows
        })
    } catch (err: any) {
        res.status(200).json({message: err.message})
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const result = await usersService.updateUser(req.body, req.params.userId as string, req.userTokenInfo)
        res.status(200).json(result)
    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await usersService.deleteUser(req.params.userId as string);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (err: any) {
        res.status(200).json({message: err.message})
    }
}

export const usersController = {
    getAllUsers,
    updateUser,
    deleteUser
}