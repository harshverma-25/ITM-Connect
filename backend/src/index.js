import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Force load backend/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import app from "./app.js";
import connectDB from "./config/db.js";

// ✅ Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
