import dotenv from "dotenv";
dotenv.config();

const config = {
    connection_str: process.env.CONNECTION_STRING,
    port: process.env.PORT
}

export default config;