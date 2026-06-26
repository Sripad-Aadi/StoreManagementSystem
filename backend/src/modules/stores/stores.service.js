import pool from "../../config/db.js";

export const createStore = async (name, email, address, owner_id) => {
  const statement = 'INSERT INTO stores(name, email, address, owner_id) VALUES($1, $2, $3, $4) RETURNING *;';
  const params = [name, email, address, owner_id];
  const queryResult = await pool.query(statement, params);
  const store = queryResult.rows[0];
  return store;
};

export const getAllStores = async (filters = {}) => {
  const { search } = filters;
  let queryText = `
    SELECT s.id, s.name, s.email, s.address, s.owner_id,
      COALESCE(AVG(r.value), 0)::numeric(10,2) as overall_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;
  if (search) {
    queryText += ` AND (s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }
  queryText += ` GROUP BY s.id ORDER BY s.name ASC`;
  const result = await pool.query(queryText, params);
  return result.rows.map(s => ({ ...s, overall_rating: parseFloat(s.overall_rating) }));
};