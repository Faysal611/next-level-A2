import type { Request, Response } from "express";
import { vehicleService } from "./vehicle.service.js";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.createVehicle(req.body);
        res.status(200).json(result.rows[0])
    } catch (err: any) {
        res.send(500).json({message: err.message})
    }
}

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles();
        if (result.rows.length === 0) {
            res.status(200).json({
                success: true,
                message: "No vehicles found",
                data: []
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicles retrived successfully",
                data: result.rows
            })
        }
    } catch (err: any) {
        res.send(500).json({ message: err.message })
    }
}

const getSignelVehicle = async (req: Request, res: Response) => {
    const id = req.params.vehicleId;

    try {
        const result = await vehicleService.getSignelVehicle(id as string);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {

        const result = await vehicleService.updateVehicle(req.body, req.params.vehicleId as string);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        await vehicleService.deleteVehicle(req.params.vehicleId as string)
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        })
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

export const vehicleController = {
    createVehicle,
    getAllVehicles,
    getSignelVehicle,
    updateVehicle,
    deleteVehicle
}