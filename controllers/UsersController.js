import Users from "../models/UsersModel.js";
import bcrypt from "bcrypt";

// Register
export const register = async (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password and confirmation do not match" });
  }

  const userExist = await Users.findOne({ where: { username } });
  if (userExist) return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await Users.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

// Login
export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Incorrect password" });

  req.session.userId = user.id;
  res.json({ message: "Login successful", userId: user.id });
};

// Logout
export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};
