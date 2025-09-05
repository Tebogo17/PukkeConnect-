//imports
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
  const { FName, LName, email, field, campus, password } = req.body;
//check all fileds are filled
    if (!FName || !LName || !email || !field || !campus || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@mynwu\.ac\.za$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email must be a @mynwu.ac.za address" });
    }
   //check if the email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);// hash password

    const newUser = await User.create({
      FName,
      LName,
      email,
      field,
      campus,
      password: hashed
    });

    res.status(201).json({
      message: "User registered",
      id: newUser.id,
      user: {
        FName: newUser.FName,
        LName: newUser.LName,
        email: newUser.email,
        field: newUser.field,
        campus: newUser.campus
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    // JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Session
    req.session.userId = user.id;

    res.json({
      message: "Login successful",
      token,
      
      user: {//store user on browser
        id: user.id,
        FName: user.FName,
        LName: user.LName,
        email: user.email,
        field: user.field,
        campus: user.campus
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile (session protected)
router.get("/profile", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json({ message: "Profile data", userId: req.session.userId });
});

// EITHER JWT OR SESSION 
const eitherAuth = (req, res, next) => {
  // Check session
  if (req.session && req.session.userId) {
    req.authUserId = req.session.userId;
    return next();
  }

  // Check JWT
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.authUserId = decoded.id;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  return res.status(401).json({ message: "Not authenticated" });
};

router.get("/profile-any", eitherAuth, (req, res) => {
  res.json({ message: "You are authenticated!", userId: req.authUserId });
});


export default router;