import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

// ✅ FORCE LOAD .env RIGHT HERE (NO DEPENDENCY ON index.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

// ✅ NOW CONFIGURE CLOUDINARY (ENV IS 100% READY)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ HARD PROOF LOG
console.log("✅ CLOUDINARY FINAL CONFIG:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  keyExists: !!process.env.CLOUDINARY_API_KEY,
  secretExists: !!process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
