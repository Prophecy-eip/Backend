import * as dotenv from "dotenv";

dotenv.config()

const JWT_SECRET : string = process.env.JWT_SECRET;

export const jwtConstants = {
    secret: JWT_SECRET
};