// ============================================
// Export Service — PDF & Excel generation per participant
// ============================================

const path = require('path');
const ExcelJS = require('exceljs');
const pdfMake = require('pdfmake');
const fonts = require('pdfmake/fonts/Roboto');

const FONTS_DIR = path.dirname(require.resolve('pdfmake/fonts/Roboto'));

pdfMake.setUrlAccessPolicy(() => false);
pdfMake.setLocalAccessPolicy((filePath) => path.resolve(filePath).startsWith(FONTS_DIR));
pdfMake.addFonts(fonts);

const BIODATA_LABELS = [
  ['Nama Lengkap', 'nama_lengkap'],
  ['Usia', 'usia'],
  ['Pendidikan Terakhir', 'pendidikan_terakhir'],
  ['Posisi', 'posisi'],
  ['Lokasi Kerja', 'lokasi_kerja'],
  ['Tanggal', 'tanggal'],
];

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function buildParticipantExcel({ participant, session, answers }) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Jawaban Peserta');

  sheet.columns = [
    { width: 22 },
    { width: 60 },
    { width: 40 },
  ];

  for (const [label, key] of BIODATA_LABELS) {
    sheet.addRow([label, String(participant[key])]);
  }
  sheet.addRow(['Status Sesi', session ? session.status : '-']);
  sheet.addRow(['Waktu Mulai', session ? formatDate(session.waktu_mulai) : '-']);
  sheet.addRow(['Waktu Selesai', session && session.waktu_selesai ? formatDate(session.waktu_selesai) : '-']);
  sheet.addRow([]);

  const headerRow = sheet.addRow(['No', 'Soal', 'Jawaban Peserta']);
  headerRow.font = { bold: true };

  for (const answer of answers) {
    sheet.addRow([answer.question_id, answer.teks_soal, answer.jawaban || '-']);
  }

  sheet.getColumn(2).alignment = { wrapText: true, vertical: 'top' };
  sheet.getColumn(3).alignment = { wrapText: true, vertical: 'top' };

  return workbook;
}

function buildParticipantPdf({ participant, session, answers }) {
  const biodataBody = BIODATA_LABELS.map(([label, key]) => [
    { text: label, bold: true },
    String(participant[key]),
  ]);
  biodataBody.push([{ text: 'Status Sesi', bold: true }, session ? session.status : '-']);
  biodataBody.push([{ text: 'Waktu Mulai', bold: true }, session ? formatDate(session.waktu_mulai) : '-']);
  biodataBody.push([
    { text: 'Waktu Selesai', bold: true },
    session && session.waktu_selesai ? formatDate(session.waktu_selesai) : '-',
  ]);

  const answersBody = [
    [{ text: 'No', bold: true }, { text: 'Soal', bold: true }, { text: 'Jawaban Peserta', bold: true }],
    ...answers.map((a) => [String(a.question_id), a.teks_soal, a.jawaban || '-']),
  ];

  const docDefinition = {
    content: [
      { text: 'Hasil Tes Kognitif IWARE', style: 'title' },
      { text: participant.nama_lengkap, style: 'subtitle' },
      {
        style: 'biodataTable',
        table: { widths: ['auto', '*'], body: biodataBody },
        layout: 'noBorders',
      },
      { text: 'Jawaban', style: 'sectionHeader' },
      {
        table: { widths: [30, '*', '*'], headerRows: 1, body: answersBody },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
      subtitle: { fontSize: 12, color: '#555555', margin: [0, 0, 0, 12] },
      biodataTable: { margin: [0, 0, 0, 16] },
      sectionHeader: { fontSize: 13, bold: true, margin: [0, 0, 0, 8] },
    },
    defaultStyle: { fontSize: 9 },
  };

  return pdfMake.createPdf(docDefinition);
}

module.exports = { buildParticipantExcel, buildParticipantPdf };
