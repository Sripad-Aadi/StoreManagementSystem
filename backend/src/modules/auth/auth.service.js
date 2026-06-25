import pool from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function generateAccessToken(user){
    return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
      algorithm: "HS256",
    },
  );
}

export const register = async (name, email, password, address)=> {
    
    const checkStatement = 'SELECT id FROM users WHERE email = $1';
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
    
};

export const login = async (email, password)=>{

    const checkStatement = 'SELECT *  FROM users WHERE email = $1';
    const checkParams = [email];

    const queryResult = await pool.query(checkStatement,checkParams);

    if(queryResult.rowCount === 0){
        const error = new Error('Invalid Email or Password');
        error.status = 401;
        throw error;
    };

    const match = await bcrypt.compare(password, queryResult.rows[0].password);

    if(!match){
        const error = new Error('Invalid Email or Password');
        error.status = 401;
        throw error;
    }

    const user = queryResult.rows[0];
    delete user.password;

    const accessToken = generateAccessToken(user);
    return {
        accessToken, 
        user
    };
};

export const updatePassword = async(userId, currentPassword, newPassword)=>{

    const checkStatement = 'SELECT id, password from users where id = $1';
    console.log(userId);
    const checkParams = [userId];

    const queryResult = await pool.query(checkStatement, checkParams);

    if(queryResult.rowCount === 0){
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    };

    const match = await bcrypt.compare(currentPassword, queryResult.rows[0].password);

    if(!match){
        const error = new Error('Invalid Password');
        error.status = 401;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateStatement = 'UPDATE users SET password = $1 WHERE id = $2;'
    const updateParams = [hashedPassword, userId];
    await pool.query(updateStatement, updateParams);

    return true;
}