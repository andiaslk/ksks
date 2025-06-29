//auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');

const router = express.Router();

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Please provide a valid email' });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    next();
};

// Register a new user
router.post('/register', validateRegistration, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const checkQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.length > 0) {
                return res.status(409).json({ error: 'User already exists' });
            }
            
            // Hash the password with salt rounds
            const hashedPassword = await bcrypt.hash(password, 12);

            // Insert the new user into the database
            const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Error registering user' });
                }
                res.status(201).json({ 
                    message: 'User registered successfully',
                    userId: result.insertId 
                });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// User login
router.post('/login', validateLogin, (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];

            try {
                // Compare the hashed password
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    res.status(200).json({ 
                        message: 'Login successful',
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            } catch (error) {
                console.error('Password comparison error:', error);
                res.status(500).json({ error: 'Login error' });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

module.exports = router;