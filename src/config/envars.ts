import dotenv from 'dotenv';

dotenv.config();

const envVars = {
  PORT: process.env.PORT as string,
  DB_URL: process.env.DB_URL as string,
  NODE_ENV: process.env.NODE_ENV as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
};

export = envVars;