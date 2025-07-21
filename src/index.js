import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

import connectDB from "./db/index.js";
import { app } from "./app.js";
console.log("ENV: ", process.env.MONGODB_URI);
connectDB()
  .then(
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log("MONGO DB connection FAILDED !!!", err);
  });
