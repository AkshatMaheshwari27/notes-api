const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// REGISTER
const register = (req, res) => {
  const { username, email, password } = req.body;

  // Check if fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Hash the password
  const password_hash = bcrypt.hashSync(password, 10);

  // Save user to database
  const result = db.prepare(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
  ).run(username, email, password_hash);

  res.status(201).json({ message: 'User registered successfully', userId: result.lastInsertRowid });
};

// LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  // Check if fields are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Find user
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Check password
  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ message: 'Login successful', token });
};

module.exports = { register, login };