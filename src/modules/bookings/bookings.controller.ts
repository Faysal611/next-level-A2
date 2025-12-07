import type { Request, Response } from "express";
import { bookingsService } from "./bookings.service.js";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.createBooking(req.body);
        res.status(201).json(result)
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

const updateBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.updateBooking(req.params.bookingId as string, req.userTokenInfo.role, req.body);
        res.status(200).json(result)
    } catch (err: any) {
        res.status(500).json({message: err.message})
    }
}

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.getAllBookings(req.userTokenInfo.role, req.userTokenInfo.id);
        res.status(200).json(result)
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
}

export const bookingsController = {
    createBooking,
    updateBooking,
    getAllBookings
} 