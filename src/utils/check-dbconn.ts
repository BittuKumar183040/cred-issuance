import logger from "@/utils/logger";
import { pool } from "@/utils/pool";

export async function checkDatabaseConnection(): Promise<{ status: string; code: number; details?: string }> {
  try {
    const res = await pool.query("SELECT 1");
    logger.info("✅ Database connection check successful", String(res));
    return { status: "ok", code: 200, details: "Database connection check successful" };
  }
  catch (err) {
    logger.error("Database connection failed:", err);
    return { status: "error", code: 500, details: String(err) };
  }
}
