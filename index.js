import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors"; 
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import router from "./routes/Route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
try {
  await db.authenticate();
  console.log("Database connected...");
} catch (err) {
  console.error("Database connection failed:", err);
}

// Sync models
import "./models/UsersModel.js";
import "./models/FormModel.js";
import "./models/Associations.js";
await db.sync();

// Session store
const SequelizeSessionStore = SequelizeStore(session.Store);
const store = new SequelizeSessionStore({ db });

// CORS setup (⬅️ Tambahkan ini SEBELUM router)
app.use(cors({
  origin: true,         // Izinkan semua origin (auto detect dari request)
  credentials: true     // Izinkan pengiriman cookie (connect.sid)
}));

// Session middleware
app.use(session({
  secret: "secret-pin",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: false, // set true kalau pakai HTTPS
    maxAge: 24 * 60 * 60 * 1000,
  }
}));
await store.sync();

// JSON middleware & routes
app.use(express.json());
app.use("/api", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
