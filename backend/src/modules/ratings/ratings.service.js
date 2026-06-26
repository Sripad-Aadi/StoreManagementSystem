import pool from '../../config/db.js';

// Create a rating (one per user per store)
export const createRating = async (userId, storeId, value) => {
  const insertStmt = `INSERT INTO ratings (store_id, user_id, value)
    VALUES ($1, $2, $3) RETURNING *;`;
  const params = [storeId, userId, value];
  const result = await pool.query(insertStmt, params);
  return result.rows[0];
};

// Update a rating (only by the owner of the rating)
export const updateRating = async (userId, ratingId, value) => {
  const updateStmt = `UPDATE ratings SET value = $1 WHERE id = $2 AND user_id = $3 RETURNING *;`;
  const params = [value, ratingId, userId];
  const result = await pool.query(updateStmt, params);
  if (result.rowCount === 0) {
    const err = new Error('Rating not found or not owned by user');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
};

// Get all ratings for a specific store
export const getRatingsByStore = async (storeId) => {
  const stmt = `SELECT r.id, r.value, r.created_at, u.id as user_id, u.name as user_name
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    WHERE r.store_id = $1
    ORDER BY r.created_at DESC;`;
  const result = await pool.query(stmt, [storeId]);
  return result.rows;
};

// Get average rating for a store
export const getAverageRating = async (storeId) => {
  const stmt = `SELECT COALESCE(AVG(value), 0)::numeric(10,2) as average
    FROM ratings WHERE store_id = $1;`;
  const result = await pool.query(stmt, [storeId]);
  return parseFloat(result.rows[0].average);
};

// Get all ratings (for system admin)
export const getAllRatings = async () => {
  const stmt = `SELECT r.id, r.store_id, r.user_id, r.value, r.created_at, 
    u.name as user_name, s.name as store_name
    FROM ratings r
    JOIN users u ON r.user_id = u.id
    JOIN stores s ON r.store_id = s.id
    ORDER BY r.created_at DESC;`;
  const result = await pool.query(stmt);
  return result.rows;
};

// Get all ratings by a specific user
export const getUserRatings = async (userId) => {
  const stmt = `SELECT r.id, r.store_id, r.value FROM ratings r WHERE r.user_id = $1;`;
  const result = await pool.query(stmt, [userId]);
  return result.rows;
};
