import pool from "../../config/db.js"
import bcrypt from "bcryptjs";

export async function register(name, email, password, address) {
    
    const checkStatement = 'SELECT id, name, email, address, role, created_at FROM users WHERE email = $1';
    const checkParams = [email];
    const existingUser = await pool.query(checkStatement, checkParams);

    if(existingUser.rowCount > 0){
        const error = new Error('User already existed');
        error.status = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const registerStatement = 'INSERT INTO users(name, email, password, address, role) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const registerParams = [name,email,passwordHash,address, "user"];

    const queryResult = await pool.query(registerStatement, registerParams);

    const user = queryResult.rows[0];
    return user;
    
}