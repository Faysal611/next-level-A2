import { pool } from "../../config/table.js"

type CreateBooking = {
    customer_id: number,
    vehicle_id: number,
    rent_start_date: string,
    rent_end_date: string
}

type UpdateBooking = {
    status: string
}

const createBooking = async (payload: CreateBooking) => {
    if (new Date(payload.rent_end_date as string).getTime() <= new Date(payload.rent_start_date as string).getTime()) {
        throw new Error("Invalid rent date")
    }

    const date1 = new Date(payload.rent_start_date as string).setHours(0, 0, 0, 0);
    const date2 = new Date(payload.rent_end_date as string).setHours(0, 0, 0, 0);
    const days = (date2 - date1) / (1000 * 60 * 60 * 24);

    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [payload.vehicle_id])
    const total_price = result.rows[0].daily_rent_price * days;

    const vehicle = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [...Object.values(payload), total_price, "active"]);
    await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, ["booked", payload.vehicle_id])
    return {
        success: true,
        message: "Booking created successfully",
        data: vehicle.rows[0],
        vehicle: {
            vehicle_name: result.rows[0].vehicle_name,
            daily_rent_price: result.rows[0].daily_rent_price
        }
    };
}

const updateBooking = async (bookingId: string, role: string, payload: UpdateBooking) => {

    if ((role === "customer" && payload.status === "returned") || (role === "admin" && payload.status === "cancelled")) {
        throw new Error("Invalid body")
    }

    if (role === "customer") {
        const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [payload.status, bookingId])
        await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, ["available", result.rows[0].vehicle_id])
        return {
            success: true,
            message: "Booking cancelled successfully",
            data: result.rows[0]
        }
    }

    if (role === "admin") {
        const result = await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`, [payload.status, bookingId])
        await pool.query(`UPDATE vehicles SET availability_status = $1 WHERE id = $2`, ["available", result.rows[0].vehicle_id])
        return {
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: result.rows[0],
            vehicle: {
                "availability_status": "available"
            }
        }
    }
}

const getAllBookings = async (role: string, userId: string) => {
    if (role === "admin") {
        const temp = await pool.query(`SELECT * FROM bookings`)

        const result = await Promise.all(
            temp.rows.map(async item => {
                const { rows: customerRow } = await pool.query(`SELECT name, email FROM users WHERE id = ${item.customer_id}`)
                const { rows: vehicleRow } = await pool.query(`SELECT vehicle_name, registration_number FROM vehicles WHERE id = ${item.vehicle_id}`)

                return { ...item, customer: customerRow[0], vehicle: vehicleRow[0] }
            })
        )

        return {
            success: true,
            message: "Bookings retrieved successfully",
            data: result
        };
    } else {
        const temp = await pool.query(`SELECT * FROM bookings WHERE customer_id = ${userId}`)
        const result = await Promise.all(temp.rows.map(async item => {
            const vehicle = await pool.query(`SELECT vehicle_name, registration_number, type FROM vehicles WHERE id = ${item.vehicle_id}`)
            return { ...item, vehicle }
        }))

        return {
            success: true,
            message: "Your bookings retrieved successfully",
            data: result
        };
    }
}

export const bookingsService = {
    createBooking,
    updateBooking,
    getAllBookings
}