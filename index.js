import express from "express";
import session from "express-session";
import dotenv from "dotenv";
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

// Session
const SequelizeSessionStore = SequelizeStore(session.Store);
const store = new SequelizeSessionStore({ db });

app.use(session({
  secret: "secret-pin",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: false, // set true kalau HTTPS
    maxAge: 24 * 60 * 60 * 1000,
  }
}));

await store.sync();

// Middleware
app.use(express.json());
app.use("/api", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
