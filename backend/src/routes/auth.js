// ============================================
// Auth Routes (Admin Login)
// ============================================

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const pool = require('../db');

// Simple token storage (in production, use JWT or sessions)
const activeTokens = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// POST /api/auth/login — Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    // Check credentials from database
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const admin = rows[0];

    // Hash the input password and compare
    const hashedInput = crypto.createHash('sha256').update(password).digest('hex');

    if (hashedInput !== admin.password_hash) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Generate token
    const token = generateToken();
    activeTokens.set(token, {
      admin_id: admin.id,
      username: admin.username,
      created_at: Date.now()
    });

    // Clean old tokens (older than 24 hours)
    for (const [t, data] of activeTokens) {
      if (Date.now() - data.created_at > 24 * 60 * 60 * 1000) {
        activeTokens.delete(t);
      }
    }

    res.json({
      message: 'Login berhasil',
      token,
      admin: { id: admin.id, username: admin.username, nama: admin.nama }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// POST /api/auth/verify — Verify token
router.post('/verify', (req, res) => {
  const { token } = req.body;

  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ valid: false, error: 'Token tidak valid' });
  }

  const data = activeTokens.get(token);

  // Check if token is older than 24 hours
  if (Date.now() - data.created_at > 24 * 60 * 60 * 1000) {
    activeTokens.delete(token);
    return res.status(401).json({ valid: false, error: 'Token expired' });
  }

  res.json({ valid: true, admin: data });
});

// POST /api/auth/logout — Logout
router.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token) {
    activeTokens.delete(token);
  }
  res.json({ message: 'Logout berhasil' });
});

module.exports = router;
