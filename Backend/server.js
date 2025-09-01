import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//app config
const app = express()
const port = process.env.PORT || 4000

// temporary in-memory "database"
let users = [];

//MIDDLEWARES
app.use(express.json()) //act as the middleware when the request is published  
app.use(cors())       //it allows frontend to connect to backend


//api endpoint
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  const { FName, LName, name, email, password, field, campus } = req.body;

  // build name from FName + LName if provided
  const fullName = name || [FName, LName].filter(Boolean).join(' ');
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { 
    id: users.length + 1, 
    name: fullName, 
    email, 
    field, 
    campus, 
    password: hashedPassword 
  };
  users.push(newUser);

  res.status(201).json({ 
    id: newUser.id, 
    name: newUser.name, 
    email: newUser.email,
    field: newUser.field,
    campus: newUser.campus
  });
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  res.json({ token });
});

// JWT authentication and user lookup middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// PROTECTED ROUTE
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data accessed!', user: {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  }});
});

// PROFILE ROUTE (matches your test: /api/auth/profile-any)
app.get('/api/auth/profile-any', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    field: req.user.field,
    campus: req.user.campus
  });
});

//START THE EXPRESS APP
app.listen(port, '0.0.0.0', () => console.log("Server Started", port))