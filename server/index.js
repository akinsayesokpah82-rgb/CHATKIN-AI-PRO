// server/index.js
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import routes from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Setup dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// ✅ Serve frontend from server/public
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ ChatKin AI running on port ${PORT}`);
});
