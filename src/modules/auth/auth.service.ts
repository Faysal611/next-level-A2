import bcrypt from "bcryptjs";
import { pool } from "../../config/table.js";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, phone, password, role } = payload;
    const hash = bcrypt.hashSync(password as string, 10);

    return await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, hash, phone, role])
}

const loginUser = async (email: string, password: string) => {
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
    if (result.rowCount === 0) {
        return null;
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        throw new Error("Password incorrect!")
    }

    const token = jwt.sign({name: user.email, role: user.role}, config.jwt_secret as string);
    return {user, token}
}

export const authService = {
    createUser,
    loginUser
}