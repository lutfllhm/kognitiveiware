// ============================================
// Participants Routes
// ============================================

const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/participants — Create new participant
router.post('/', async (req, res) => {
  try {
    const { nama_lengkap, usia, tanggal, pendidikan_terakhir, posisi, lokasi_kerja } = req.body;

    // Validation
    if (!nama_lengkap || !usia || !tanggal || !pendidikan_terakhir || !posisi || !lokasi_kerja) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    if (isNaN(usia) || usia < 15 || usia > 65) {
      return res.status(400).json({ error: 'Usia harus berupa angka antara 15-65' });
    }

    const [result] = await pool.execute(
      'INSERT INTO participants (nama_lengkap, usia, tanggal, pendidikan_terakhir, posisi, lokasi_kerja) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_lengkap, parseInt(usia), tanggal, pendidikan_terakhir, posisi, lokasi_kerja]
    );

    res.status(201).json({
      message: 'Biodata berhasil disimpan',
      participant_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET /api/participants — List all participants (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, s.status as session_status, s.waktu_mulai, s.waktu_selesai, s.skor
       FROM participants p
       LEFT JOIN sessions s ON p.id = s.participant_id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET /api/participants/:id — Get participant detail with answers
router.get('/:id', async (req, res) => {
  try {
    const [participants] = await pool.execute(
      'SELECT * FROM participants WHERE id = ?',
      [req.params.id]
    );

    if (participants.length === 0) {
      return res.status(404).json({ error: 'Peserta tidak ditemukan' });
    }

    const [answers] = await pool.execute(
      `SELECT a.*, q.teks_soal, q.tipe, q.opsi, q.kunci_jawaban
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.participant_id = ?
       ORDER BY a.question_id`,
      [req.params.id]
    );

    const [sessions] = await pool.execute(
      'SELECT * FROM sessions WHERE participant_id = ?',
      [req.params.id]
    );

    res.json({
      participant: participants[0],
      answers,
      session: sessions[0] || null
    });
  } catch (error) {
    console.error('Error fetching participant detail:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// DELETE /api/participants/:id — Delete a participant (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if participant exists
    const [participants] = await pool.execute(
      'SELECT id FROM participants WHERE id = ?',
      [id]
    );

    if (participants.length === 0) {
      return res.status(404).json({ error: 'Peserta tidak ditemukan' });
    }

    // Delete participant (cascades to answers and sessions automatically)
    await pool.execute(
      'DELETE FROM participants WHERE id = ?',
      [id]
    );

    res.json({ message: 'Peserta berhasil dihapus beserta seluruh data tesnya' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
