import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory user store
const users = [];

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Registration endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, password, FName, LName, field, campus } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword, FName, LName, field, campus });
  res.status(201).json({ message: "User registered successfully" });
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, FName: user.FName, LName: user.LName, field: user.field, campus: user.campus },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );
  res.json({ message: "Login successful", token });
});

// Profile endpoint (protected)
app.get("/api/auth/profile-any", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.json({ message: "Profile data", user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
