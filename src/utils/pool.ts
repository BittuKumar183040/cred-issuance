import { Pool } from "pg";
import { env } from "../env.js";

const connectionString = env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl:
    env.DB_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

export { pool };
