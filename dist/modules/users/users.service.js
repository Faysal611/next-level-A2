import { pool } from "../../config/table.js";
const getAllUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};
const updateUser = async (payload, id, userTokenInfo) => {
    const keys = Object.keys(payload);
    const setKeys = keys.map((key, index) => key + ` = $${index + 1}`);
    const values = [...Object.values(payload), parseInt(id)];
    const { email, role } = userTokenInfo;
    let result;
    if (userTokenInfo.role === "admin") {
        result = await pool.query(`UPDATE users SET ${setKeys.join(", ")} WHERE id = $${values.length} RETURNING *`, values);
    }
    else {
        result = await pool.query(`UPDATE users SET ${setKeys.join(", ")} WHERE id = $${values.length} AND email = $${values.length + 2} RETURNING *`, [...values, email]);
    }
    console.log(result);
    return result;
};
const deleteUser = async (id) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE customer_id = ${id}`);
    const arr = result.rows.map(elem => elem.status);
    if (arr.includes("active")) {
        throw new Error("User has active booking(s)");
    }
    return await pool.query(`DELETE FROM users WHERE id = $1)`, [id]);
};
export const usersService = {
    getAllUsers,
    updateUser,
    deleteUser
};
