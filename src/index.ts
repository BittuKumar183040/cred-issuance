import app from "./app.js";
import { env } from "./env.js";
import logger from "./utils/logger.js";

const port = env.PORT;
const server = app.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    logger.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    logger.error("Failed to start server:", err);
  }
  process.exit(1);
});
