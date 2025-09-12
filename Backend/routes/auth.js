import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// --- REGISTER ---
router.post("/register", async (req, res) => {
  try {
    const { FName, LName, email, field, campus, password } = req.body;

    // Check all fields
    if (!FName || !LName || !email || !field || !campus || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Restrict email to @mynwu.ac.za
    if (!email.endsWith("@mynwu.ac.za")) {
      return res.status(400).json({ message: "Invalid email domain" });
    }

    // Check if user exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      FName,
      LName,
      email,
      field,
      campus,
      password: hashed
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set session
    req.session.userId = user.id;

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFILE (protected) ---
const authMiddleware = (req, res, next) => {
  // Session check
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // JWT check
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.id;
      return next();
    } catch (e) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  return res.status(401).json({ message: "Not authenticated" });
};

router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.userId, { attributes: { exclude: ["password"] } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});

export default router;
