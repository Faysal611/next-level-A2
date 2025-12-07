import { pool } from "../../config/table.js";
const createVehicle = async (payload) => {
    try {
        return await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [payload.vehicle_name, payload.type, payload.registration_number, payload.daily_rent_price, payload.availability_status]);
    }
    catch (err) {
        throw new Error(err.message);
    }
};
const getAllVehicles = async () => {
    return await pool.query(`SELECT * FROM vehicles`);
};
const getSignelVehicle = async (id) => {
    return await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
};
const updateVehicle = async (payload, id) => {
    const key = Object.keys(payload);
    for (let i = 0; i < key.length; i++) {
        key[i] = key[i] + ` = $${i + 1}`;
    }
    const values = Object.values(payload);
    try {
        return await pool.query(`UPDATE vehicles SET ${key.join(", ")} WHERE id = $${key.length + 1} RETURNING *`, [...values, id]);
    }
    catch (err) {
        console.log(err.message);
        throw new Error(err.message);
    }
};
const deleteVehicle = async (id) => {
    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 AND availability_status != 'booked'`, [id]);
    if (result.rowCount === 0)
        throw new Error("couldnt delete vehicle");
};
export const vehicleService = {
    createVehicle,
    getAllVehicles,
    getSignelVehicle,
    updateVehicle,
    deleteVehicle
};
