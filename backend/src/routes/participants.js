// ============================================
// Participants Routes
// ============================================

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { buildParticipantExcel, buildParticipantPdf } = require('../services/exportService');

async function getParticipantDetail(id) {
  const [participants] = await pool.execute(
    'SELECT * FROM participants WHERE id = ?',
    [id]
  );

  if (participants.length === 0) {
    return null;
  }

  const [answers] = await pool.execute(
    `SELECT a.*, q.teks_soal, q.tipe, q.opsi
     FROM answers a
     JOIN questions q ON a.question_id = q.id
     WHERE a.participant_id = ?
     ORDER BY a.question_id`,
    [id]
  );

  const [sessions] = await pool.execute(
    'SELECT * FROM sessions WHERE participant_id = ?',
    [id]
  );

  return {
    participant: participants[0],
    answers,
    session: sessions[0] || null
  };
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'peserta';
}

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
      `SELECT p.*, s.status as session_status, s.waktu_mulai, s.waktu_selesai
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
    const detail = await getParticipantDetail(req.params.id);

    if (!detail) {
      return res.status(404).json({ error: 'Peserta tidak ditemukan' });
    }

    res.json(detail);
  } catch (error) {
    console.error('Error fetching participant detail:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET /api/participants/:id/export/excel — Download participant answers as Excel
router.get('/:id/export/excel', async (req, res) => {
  try {
    const detail = await getParticipantDetail(req.params.id);

    if (!detail) {
      return res.status(404).json({ error: 'Peserta tidak ditemukan' });
    }

    const workbook = await buildParticipantExcel(detail);
    const filename = `${sanitizeFilename(detail.participant.nama_lengkap)}-jawaban.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting participant to Excel:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET /api/participants/:id/export/pdf — Download participant answers as PDF
router.get('/:id/export/pdf', async (req, res) => {
  try {
    const detail = await getParticipantDetail(req.params.id);

    if (!detail) {
      return res.status(404).json({ error: 'Peserta tidak ditemukan' });
    }

    if (detail.answers[0]) {
      const sample = detail.answers[0].teks_soal;
      console.log('[DEBUG export/pdf] sample teks_soal:', JSON.stringify(sample));
      console.log('[DEBUG export/pdf] sample bytes (hex):', Buffer.from(sample, 'utf8').toString('hex').slice(0, 200));
    }

    const filename = `${sanitizeFilename(detail.participant.nama_lengkap)}-jawaban.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const doc = buildParticipantPdf(detail);
    const stream = await doc.getStream();
    stream.pipe(res);
    stream.end();
  } catch (error) {
    console.error('Error exporting participant to PDF:', error);
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
