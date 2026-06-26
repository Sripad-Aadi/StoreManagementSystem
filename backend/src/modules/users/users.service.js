import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

export const createUser = async (name, email, password, address, role) => {

    const checkStatement = 'SELECT id FROM users WHERE email = $1;';
    const checkParams = [email];

    const existingUser = await pool.query(checkStatement, checkParams);

    if(existingUser.rowCount > 0){
        const error = new Error('User already existed');
        error.status = 409;
        throw error;
    };

    const passwordHash = await bcrypt.hash(password, 10);

    const registerStatement = 'INSERT INTO users(name, email, password, address, role) VALUES($1,$2,$3,$4,$5) RETURNING *;';
    const registerParams = [name, email, passwordHash, address, role];

    const queryResult = await pool.query(registerStatement, registerParams);

    const user = queryResult.rows[0];
    delete user.password;

    return user;
};

export const getUsersService = async (filters) => {

    const { role, search, sortBy = 'name', sortOrder = 'asc' } = filters;
    
    let queryText = `
        SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.address, 
        u.role,
        COALESCE(AVG(r.value), 0.0) as average_rating
        FROM users u
        LEFT JOIN ratings r ON u.id = r.user_id
        WHERE u.role != 'owner'
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (role) {
        queryText += ` AND u.role = $${paramIndex}`;
        queryParams.push(role);
        paramIndex++;
    }

    if (search) {
        queryText += ` AND (u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
    }

    queryText += ` GROUP BY u.id`;

    const allowedSortFields = { name: 'u.name', email: 'u.email', role: 'u.role' };
    const SQLSortField = allowedSortFields[sortBy] || 'u.name';
    
    queryText += ` ORDER BY ${SQLSortField} ${sortOrder.toUpperCase()}`;


    const { rows } = await pool.query(queryText, queryParams);

    return rows.map(user => {
        const response = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
        };

        if (user.role === 'admin') {
        response.rating = parseFloat(parseFloat(user.average_rating).toFixed(1));
        }

        return response;
    });
};

