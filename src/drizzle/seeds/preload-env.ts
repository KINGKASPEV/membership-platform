import * as dotenv from "dotenv";
import path from "path";

// Load .env.local first, then .env if needed
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("✅ Environment variables preloaded.");
