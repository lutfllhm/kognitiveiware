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

    // Check if answer key exists for auto-scoring
    const [questions] = await pool.execute(
      'SELECT kunci_jawaban FROM questions WHERE id = ?',
      [question_id]
    );

    let is_correct = null;
    if (questions.length > 0 && questions[0].kunci_jawaban) {
      const keys = questions[0].kunci_jawaban.split('|').map(k => k.trim().toLowerCase());
      const answer = (jawaban || '').trim().toLowerCase();
      is_correct = keys.includes(answer) ? 1 : 0;
    }

    // Upsert: insert or update on duplicate key
    await pool.execute(
      `INSERT INTO answers (participant_id, question_id, jawaban, is_correct)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE jawaban = VALUES(jawaban), is_correct = VALUES(is_correct), updated_at = CURRENT_TIMESTAMP`,
      [participant_id, question_id, jawaban || null, is_correct]
    );

    res.json({ message: 'Jawaban tersimpan', is_correct });
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
        const [questions] = await connection.execute(
          'SELECT kunci_jawaban FROM questions WHERE id = ?',
          [answer.question_id]
        );

        let is_correct = null;
        if (questions.length > 0 && questions[0].kunci_jawaban) {
          const keys = questions[0].kunci_jawaban.split('|').map(k => k.trim().toLowerCase());
          const ans = (answer.jawaban || '').trim().toLowerCase();
          is_correct = keys.includes(ans) ? 1 : 0;
        }

        await connection.execute(
          `INSERT INTO answers (participant_id, question_id, jawaban, is_correct)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE jawaban = VALUES(jawaban), is_correct = VALUES(is_correct), updated_at = CURRENT_TIMESTAMP`,
          [participant_id, answer.question_id, answer.jawaban || null, is_correct]
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
      `SELECT a.*, q.teks_soal, q.tipe, q.kunci_jawaban
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.participant_id = ?
       ORDER BY a.question_id`,
      [req.params.participantId]
    );

    // Calculate score
    const totalWithKey = rows.filter(r => r.kunci_jawaban !== null).length;
    const correct = rows.filter(r => r.is_correct === 1).length;

    res.json({
      answers: rows,
      score: { correct, total: totalWithKey }
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
