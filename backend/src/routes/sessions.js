// ============================================
// Sessions Routes
// ============================================

const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/sessions — Create new test session
router.post('/', async (req, res) => {
  try {
    const { participant_id } = req.body;

    if (!participant_id) {
      return res.status(400).json({ error: 'participant_id wajib' });
    }

    // Check if session already exists
    const [existing] = await pool.execute(
      'SELECT * FROM sessions WHERE participant_id = ?',
      [participant_id]
    );

    if (existing.length > 0) {
      return res.json({
        message: 'Sesi sudah ada',
        session: existing[0]
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO sessions (participant_id, waktu_mulai, status) VALUES (?, NOW(), ?)',
      [participant_id, 'berlangsung']
    );

    const [sessions] = await pool.execute(
      'SELECT * FROM sessions WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Sesi tes dimulai',
      session: sessions[0]
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// POST /api/sessions/finish — Finish test session (manual or timeout)
router.post('/finish', async (req, res) => {
  try {
    const { participant_id, status } = req.body;

    if (!participant_id) {
      return res.status(400).json({ error: 'participant_id wajib' });
    }

    const finishStatus = status === 'timeout' ? 'timeout' : 'selesai';

    // Calculate score from answers
    const [answers] = await pool.execute(
      'SELECT is_correct FROM answers WHERE participant_id = ? AND is_correct IS NOT NULL',
      [participant_id]
    );

    const skor = answers.filter(a => a.is_correct === 1).length;

    await pool.execute(
      'UPDATE sessions SET waktu_selesai = NOW(), status = ?, skor = ? WHERE participant_id = ? AND status = ?',
      [finishStatus, skor, participant_id, 'berlangsung']
    );

    res.json({
      message: 'Sesi tes selesai',
      status: finishStatus,
      skor
    });
  } catch (error) {
    console.error('Error finishing session:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET /api/sessions/:participantId — Get session info
router.get('/:participantId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sessions WHERE participant_id = ?',
      [req.params.participantId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
