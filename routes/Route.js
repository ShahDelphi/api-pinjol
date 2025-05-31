import express from "express";
import { register, login, logout } from "../controllers/UsersController.js";
import sessionAuth from "../middleware/Session.js";
import { uploadMiddleware, submitForm, checkForm, editForm } from "../controllers/FormController.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Form
router.post("/form", sessionAuth, uploadMiddleware, submitForm);
router.get("/form", sessionAuth, checkForm);
router.put("/form", sessionAuth, uploadMiddleware, editForm);

export default router;
