import express from "express";
import { register, login, logout } from "../controllers/UsersController.js";
import { submitForm, checkForm } from "../controllers/FormController.js";
import sessionAuth from "../middleware/Session.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Form
router.post("/form", sessionAuth, submitForm);
router.get("/form", sessionAuth, checkForm);

export default router;
