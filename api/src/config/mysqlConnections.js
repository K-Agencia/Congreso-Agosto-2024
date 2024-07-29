import mysql from 'mysql2/promise';

export const pool = () => {
  return mysql.createPool({
    connectionLimit: 10,
    port: 3306,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  })
};

export const testConnectionMySQL = async () => {
  try {
    const connectionPool = pool();
    const connection = await connectionPool.getConnection();
    console.log("Database MySQL Successfull");
    connection.release();
  } catch (error) {
    throw error;
  }
};