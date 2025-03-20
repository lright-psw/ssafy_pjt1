import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// console.log("🔹 MySQL 연결 정보:");
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
await connection.end();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



(async () => {
    const dbConn = await pool.getConnection();
    await dbConn.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `);
    dbConn.release();
    console.log("users 테이블 확인 완료");
})();

process.on("SIGINT", async () => {
    try {
        console.log("서버 종료 감지, users 테이블 삭제 ");

        const dbConn = await pool.getConnection();
        await dbConn.query("DROP TABLE IF EXISTS users");
        dbConn.release();

        console.log("users 테이블 삭제 완료");
        
        await pool.end(); // 연결 풀 종료
        console.log("MySQL 연결 종료");

        process.exit(0);
    } catch (error) {
        console.error("테이블 삭제 오류:", error);
        process.exit(1);
    }
});

export default pool;
