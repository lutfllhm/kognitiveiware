 // ============================================
// Answers Routes
// ============================================

const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/answers — Upsert answer (auto-save)
router.post('/', async (req, res) => {
  try {
    const { participant_id, question_id, jawaban } = req.body;

    if (!participant_id || !question_id) {
      return res.status(400).json({ error: 'participant_id dan question_id wajib' });
    }

    // Upsert: insert or update on duplicate key
    await pool.execute(
      `INSERT INTO answers (participant_id, question_id, jawaban)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE jawaban = VALUES(jawaban), updated_at = CURRENT_TIMESTAMP`,
      [participant_id, question_id, jawaban || null]
    );

    res.json({ message: 'Jawaban tersimpan' });
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// POST /api/answers/bulk — Save multiple answers at once (for final submit)
router.post('/bulk', async (req, res) => {
  try {
    const { participant_id, answers } = req.body;

    if (!participant_id || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Data tidak valid' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const answer of answers) {
        await connection.execute(
          `INSERT INTO answers (participant_id, question_id, jawaban)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE jawaban = VALUES(jawaban), updated_at = CURRENT_TIMESTAMP`,
          [participant_id, answer.question_id, answer.jawaban || null]
        );
      }

      await connection.commit();
      res.json({ message: 'Semua jawaban tersimpan' });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving bulk answers:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET /api/answers/:participantId — Get all answers for a participant
router.get('/:participantId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, q.teks_soal, q.tipe
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.participant_id = ?
       ORDER BY a.question_id`,
      [req.params.participantId]
    );

    res.json({ answers: rows });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
