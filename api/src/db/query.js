import { pool } from "../config/mysqlConnections.js";

export const QUERY_DB = async ({ sql, values }) => {

  const data = [];

  try {
    const connection = await pool().getConnection();
    const [rows] = await connection.query(sql, values);
    data.push(rows);
    connection.release();
    // console.log("release");
  } catch (err) {
    console.log(err);
  }

  return data;
}