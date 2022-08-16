import * as dotenv from "dotenv";

dotenv.config()

export const DB_HOST = process.env.DATABASES_IP;
export const DB_PORT: number = +process.env.DATABASES_PORT;
export const DB_USERNAME = process.env.POSTGRES_USER;
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
export const DB_DIALECT = "postgres"

export const defaultConfig = {
    type: DB_DIALECT,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
}