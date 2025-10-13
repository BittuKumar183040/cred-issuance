import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
  DATABASE_URL: z.string().default("postgresql://postgres:password@localhost:port/database"),
  WORKER_ID: z.string().default("worker-1"),
  DB_SSL: z.string().default("true"),
  VERIFICATION_SERVICE_URL: z.string().default("http://localhost:3001"),
  SCHEDULER_INTERVAL_MIN: z.coerce.number().default(1),
});

try {
  envSchema.parse(process.env);
}
catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Missing environment variables:", error.issues.flatMap(issue => issue.path));
  }
  else {
    console.error(error);
  }
  process.exit(1);
}

export const env = envSchema.parse(process.env);
