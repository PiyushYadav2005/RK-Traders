import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] RK Traders API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
