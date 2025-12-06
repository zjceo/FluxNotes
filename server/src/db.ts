import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'fluxnotes',
    password: process.env.DB_PASSWORD || '', // ⚠️ Configura tu password en el archivo .env
    port: parseInt(process.env.DB_PORT || '5432'),
};

const pool = new Pool(dbConfig);

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const checkConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
        return {
            connected: true,
            timestamp: result.rows[0].current_time,
            version: result.rows[0].pg_version.split(',')[0], // Primera línea de la versión
            database: dbConfig.database,
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
        };
    } catch (err: any) {
        return {
            connected: false,
            error: err.message,
            database: dbConfig.database,
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
        };
    }
};

export const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};
