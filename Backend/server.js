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
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10); // hash password
  const newUser = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// PROTECTED ROUTE EXAMPLE
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: 'Protected data accessed!', user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
//START THE EXPRESS APP
app.listen(port, '0.0.0.0', ()=> console.log("Server Started",port))