-- ============================================
-- Tes Kognitif IWARE — Database Schema
-- ============================================
-- Jalankan script ini di phpMyAdmin atau MySQL CLI
-- ============================================

CREATE DATABASE IF NOT EXISTS tesiware
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tesiware;

-- ============================================
-- Tabel: participants (Biodata Peserta)
-- ============================================
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    usia INT NOT NULL,
    tanggal DATE NOT NULL,
    pendidikan_terakhir VARCHAR(50) NOT NULL,
    posisi VARCHAR(255) NOT NULL,
    lokasi_kerja VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Tabel: questions (Bank Soal)
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipe ENUM('pilihan_ganda', 'isian') NOT NULL,
    teks_soal TEXT NOT NULL,
    opsi JSON DEFAULT NULL COMMENT 'Array of options for pilihan_ganda, e.g. ["a. Option A", "b. Option B"]',
    kunci_jawaban VARCHAR(255) DEFAULT NULL COMMENT 'Correct answer key for auto-scoring'
) ENGINE=InnoDB;

-- ============================================
-- Tabel: sessions (Sesi Tes)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    waktu_mulai DATETIME NOT NULL,
    waktu_selesai DATETIME DEFAULT NULL,
    status ENUM('berlangsung', 'selesai', 'timeout') DEFAULT 'berlangsung',
    skor INT DEFAULT NULL COMMENT 'Auto-calculated score if answer keys available',
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Tabel: answers (Jawaban Peserta)
-- ============================================
CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    question_id INT NOT NULL,
    jawaban TEXT DEFAULT NULL,
    is_correct TINYINT(1) DEFAULT NULL COMMENT 'Auto-checked if answer key exists',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_answer (participant_id, question_id)
) ENGINE=InnoDB;

-- ============================================
-- Insert 50 Soal ke tabel questions
-- ============================================

INSERT INTO questions (id, tipe, teks_soal, opsi, kunci_jawaban) VALUES

-- Soal 1: Pilihan Ganda
(1, 'pilihan_ganda',
 'Jumlah jam dalam setengah hari, sama dengan bulan…',
 '["a. Juni", "b. Juli", "c. Desember", "d. Januari"]',
 'c'),

-- Soal 2: Pilihan Ganda
(2, 'pilihan_ganda',
 'PASCA dan PASKA, apakah kata ini:',
 '["a. Memiliki arti sama", "b. Memiliki arti berlawanan", "c. Tidak memiliki arti sama atau berlawanan"]',
 'a'),

-- Soal 3: Isian
(3, 'isian',
 'Berapa banyak yang sama dari duplikasi di bawah ini?\nHJNBKL – HJNBKL\nAYKLMNO – AYKLMHO\nDBGAYEFE – DBAGYFFE\nJTXHGIKLM – JTXHGIKLM\nHIHMPKDQW – HINPKMDQW',
 NULL,
 '2'),

-- Soal 4: Pilihan Ganda
(4, 'pilihan_ganda',
 'TIBA adalah lawan kata dari…',
 '["a. Datang", "b. Pulang", "c. Muncul", "d. Terbit"]',
 'b'),

-- Soal 5: Pilihan Ganda
(5, 'pilihan_ganda',
 'Angka selanjutnya dari deretan di bawah ini adalah\n12  1  9  1  6  1  ….',
 '["a. 6", "b. 2", "c. 3", "d. 12"]',
 'c'),

-- Soal 6: Pilihan Ganda
(6, 'pilihan_ganda',
 'Dari 5 peribahasa di bawah ini manakah yang serupa?\na. Bagai menuangkan garam ke lautan\nb. Air pun ada pasang surutnya\nc. Bergantung pada akar lapuk\nd. Gali lubang, tutup lubang\ne. Habis manis sepah dibuang',
 '["a. a dan b", "b. a dan d", "c. b dan c", "d. c dan d", "e. a dan e"]',
 NULL),

-- Soal 7: Isian
(7, 'isian',
 'Manakah angka yang terkecil dari kelompok angka ini?\n10  1  0.99  2  0.9  0.33  3',
 NULL,
 '0.33'),

-- Soal 8: Isian
(8, 'isian',
 'Berapa duplikasi dari pasangan di bawah ini?\nRaxford, S.J – Raxford, S.J.\nSilverstein, A.M – Silverstain, A.M\nJohnhansen, D.C – Johnhansen, D.C\nWood, L.A – Wood, L.A\nHarringtons, K.B – Haringtons, K.B.',
 NULL,
 '2'),

-- Soal 9: Pilihan Ganda
(9, 'pilihan_ganda',
 'Amati 2 kalimat berikut:\nHidup dikandung adat, mati dikandung tanah.\nLain ladang lain belalang, lain lubuk lain ikannya.\nApakah 2 kalimat tersebut memiliki arti yang….',
 '["a. Sama", "b. Berlawanan", "c. Tidak sama atau berlawanan"]',
 'c'),

-- Soal 10: Isian
(10, 'isian',
 'Sebuah jam terlambat 1 menit 12 detik dalam 24 hari. Berapa detik ia terlambat setiap harinya?',
 NULL,
 '3'),

-- Soal 11: Isian
(11, 'isian',
 'Berapa angka selanjutnya dari deretan ini?\n5  6  8  11  15  20  …….',
 NULL,
 '26'),

-- Soal 12: Pilihan Ganda
(12, 'pilihan_ganda',
 'MUSIM HUJAN adalah lawan kata dari…',
 '["a. Musim panas", "b. Musim kemarau", "c. Musim kering", "d. Musim semi"]',
 'b'),

-- Soal 13: Pilihan Ganda
(13, 'pilihan_ganda',
 'Dari kata di bawah ini manakah kata yang berbeda dari lainnya?',
 '["a. Tim", "b. Kelompok", "c. Komunitas", "d. Liga", "e. Pasukan"]',
 'c'),

-- Soal 14: Isian
(14, 'isian',
 'Susun kata-kata di bawah ini menjadi kalimat yang tepat. Huruf terakhir dari rangkaian kalimat tersebut adalah….\nOrang  hidup  yang  pasti  setiap  bernafas',
 NULL,
 's'),

-- Soal 15: Isian
(15, 'isian',
 '3 buah buku tulis seharga Rp 100,-. Berapakah harga 2 lusinnya?',
 NULL,
 '800'),

-- Soal 16: Pilihan Ganda
(16, 'pilihan_ganda',
 'Anak laki-laki ini adalah anak yang normal.\nSemua anak normal sifatnya aktif.\nAnak laki-laki ini sifatnya aktif.\nAnggaplah dua pernyataan pertama adalah benar. Apakah yang terakhir',
 '["a. Benar", "b. Salah", "c. Tidak tahu"]',
 'a'),

-- Soal 17: Isian
(17, 'isian',
 'Sebuah kotak segi empat yang terisi penuh memuat 8.000 kubik kaki buah jeruk. Jika satu kotak lebarnya 10 kaki dan panjangnya 20 kaki. Berapa kedalaman kotak itu?',
 NULL,
 '40'),

-- Soal 18: Isian
(18, 'isian',
 'Berapa angka selanjutnya dari deret ini?\n1  0.5  0.25  0.125  ……….',
 NULL,
 '0.0625'),

-- Soal 19: Pilihan Ganda
(19, 'pilihan_ganda',
 'GENERAL – GENEROUS apakah kedua kata ini memiliki arti…',
 '["a. Sama", "b. Berlawanan", "c. Tidak memiliki arti sama atau berlawanan"]',
 'c'),

-- Soal 20: Pilihan Ganda
(20, 'pilihan_ganda',
 'LIBURAN – KERJA apakah kedua kata ini memiliki arti….',
 '["a. Sama", "b. Berlawanan", "c. Tidak memiliki arti sama atau berlawanan"]',
 'b'),

-- Soal 21: Isian
(21, 'isian',
 'Kalau 6 orang harus membagi Rp 4.800,- berapakah yang didapat masing-masing orang?',
 NULL,
 '800'),

-- Soal 22: Isian
(22, 'isian',
 'Susunlah kata-kata ini hingga benar. Tuliskan (B) jika benar dan (S) jika salah.\nTimur di terbit matahari',
 NULL,
 'S'),

-- Soal 23: Pilihan Ganda
(23, 'pilihan_ganda',
 'Semua anak bertopi menyukai balon.\nNini adalah gadis bertopi baret.\nNini menyukai balon.\nAnggaplah dua pernyataan ini benar. Pernyataan terakhir adalah….',
 '["a. Benar", "b. Salah", "c. Tidak tahu"]',
 'a'),

-- Soal 24: Pilihan Ganda
(24, 'pilihan_ganda',
 'Amati 2 kalimat berikut:\nKalau tidak angin bertiup, tidak akan pohon bergoyang.\nTak ada asap kalau tak ada api.\nApakah kalimat tersebut memiliki arti yang….',
 '["a. Sama", "b. Berlawanan", "c. Tidak sama atau berlawanan"]',
 'a'),

-- Soal 25: Pilihan Ganda
(25, 'pilihan_ganda',
 'BIASA adalah lawan kata dari….',
 '["a. Jarang", "b. Terbiasa", "c. Tetap", "d. Berhenti", "e. Selalu"]',
 'a'),

-- Soal 26: Pilihan Ganda
(26, 'pilihan_ganda',
 'Sebagian besar dari kelompok kata di bawah ini adalah sama, yang berbeda adalah…',
 '["a. Selasa", "b. Minggu", "c. Kamis", "d. Juni", "e. Rabu"]',
 'd'),

-- Soal 27: Isian
(27, 'isian',
 'Berapa jam yang akan ditempuh sebuah kereta yang kecepatannya 70 km/jam dengan panjang jalan 910 km?',
 NULL,
 '13'),

-- Soal 28: Pilihan Ganda
(28, 'pilihan_ganda',
 'DEKAT adalah lawan kata dari….',
 '["a. Asing", "b. Terpencil", "c. Jauh", "d. Panjang", "e. Terburu-buru"]',
 'c'),

-- Soal 29: Pilihan Ganda
(29, 'pilihan_ganda',
 'Dewa seusia dengan Deni.\nDeni lebih tua dari Dewi.\nDewi lebih tua dari Dewa.\nJika kedua pernyataan pertama benar, maka pernyataan ketiga adalah…',
 '["a. Benar", "b. Salah", "c. Tidak tahu"]',
 'b'),

-- Soal 30: Isian
(30, 'isian',
 'Seorang anak berumur 6 tahun, saudaranya dua kali lebih tua darinya. Saat anak tersebut berumur 10 tahun, berapa umur saudaranya?',
 NULL,
 '16'),

-- Soal 31: Pilihan Ganda
(31, 'pilihan_ganda',
 'PRA – PRE apakah dua kata ini memiliki arti yang…',
 '["a. Sama", "b. Berlawanan", "c. Tidak sama atau berlawanan"]',
 'a'),

-- Soal 32: Isian
(32, 'isian',
 'Sebuah kemeja membutuhkan 2½ meter kain. Berapa banyak potong yang dihasilkan dari 60 meter kain?',
 NULL,
 '24'),

-- Soal 33: Isian
(33, 'isian',
 'Dua orang menangkap 36 ikan. A menangkap 5 kali lebih banyak daripada B. Berapa yang ditangkap B?',
 NULL,
 '6'),

-- Soal 34: Isian
(34, 'isian',
 'Tim bisbol kalah 9 permainan dalam musim ini. Ini merupakan 3/8 bagian dari semua pertandingan mereka. Berapa banyak pertandingan yang mereka mainkan musim ini?',
 NULL,
 '24'),

-- Soal 35: Isian
(35, 'isian',
 'Sebuah jam menunjukkan tepat pukul 12 siang pada hari Senin. Pada pukul 8 malam hari Selasa, jam itu terlambat 32 detik. Pada rata-rata yang sama, berapa banyak jam itu terlambat dalam ½ jam?',
 NULL,
 '0.5'),

-- Soal 36: Isian
(36, 'isian',
 'Seorang dealer membeli beberapa box apel seharga 4.000 rupiah. Ia menjual dengan harga 5.000 rupiah, mendapat untung 50 rupiah setiap boxnya. Berapa banyak box yang dijualnya?',
 NULL,
 '20'),

-- Soal 37: Pilihan Ganda
(37, 'pilihan_ganda',
 'Dalam kumpulan kata berikut mana yang berbeda dari lainnya?',
 '["a. Kumpulan", "b. Konvoi", "c. Sekumpulan", "d. Seorang teman", "e. Angkatan"]',
 'd'),

-- Soal 38: Pilihan Ganda
(38, 'pilihan_ganda',
 'Tidak ada orang jujur yang meminta maaf atas kejujurannya. Kejujuran dihormati dan lapar pujian.\nApakah dua kalimat di atas memiliki arti yang…',
 '["a. Sama", "b. Berlawanan", "c. Tidak sama atau berlawanan"]',
 'c'),

-- Soal 39: Pilihan Ganda
(39, 'pilihan_ganda',
 'Semua pemimpin progresif. Sebagian besar pemimpin adalah wiraswastawan. Orang yang progresif adalah wiraswastawan.\nApabila kedua pernyataan pertama adalah benar. Maka, pernyataan ketiga adalah…',
 '["a. Benar", "b. Salah", "c. Tidak tahu"]',
 'c'),

-- Soal 40: Isian
(40, 'isian',
 'Dengan harga 1.80 dolar, seorang grosir membeli satu kardus yang berisi 12 lusin wortel. Ia tahu 2 lusin akan busuk sebelum dijualnya. Berapa harga per lusin jika ia harus menjual wortel tersebut 1/3 dari harga sebelumnya?',
 NULL,
 NULL),

-- Soal 41: Isian
(41, 'isian',
 'Tiga orang membentuk kemitraan dan setuju membagi keuntungan secara rata. X menginvestasikan 5.500 dolar, Y 3.500 dolar dan Z 1.000 dolar. Jika keuntungan mencapai 3.000 dolar, lebih kurang berapa yang diterima Z jika keuntungan dibagi berdasarkan besarnya investasi?',
 NULL,
 '300'),

-- Soal 42: Isian
(42, 'isian',
 'Seorang pembuat jalan memasang batu tegel yang panjangnya 6 dm dan lebarnya 40 cm. Ia membutuhkan 600 tegel. Berapa meter-persegikah jalan itu?',
 NULL,
 '144'),

-- Soal 43: Pilihan Ganda
(43, 'pilihan_ganda',
 'Klien dan pelanggan apakah kedua kata ini…',
 '["a. Memiliki arti yang sama", "b. Memiliki arti berlawanan", "c. Tidak memiliki arti sama atau berlawanan"]',
 'a'),

-- Soal 44: Pilihan Ganda
(44, 'pilihan_ganda',
 'Manakah dari kata berikut yang berhubungan dengan mengunyah?',
 '["a. Manis", "b. Bau tak sedap", "c. Wangi", "d. Hidung", "e. Bersih"]',
 'a'),

-- Soal 45: Isian
(45, 'isian',
 'Jawablah dengan YA atau TIDAK.\nP.S. artinya melakukan registrasi.',
 NULL,
 'TIDAK'),

-- Soal 46: Isian (Visual - deskripsi verbal)
(46, 'isian',
 '[Soal Gambar] Perhatikan gambar pada soal no. 46. Tuliskan jawaban Anda.',
 NULL,
 NULL),

-- Soal 47: Isian (Visual - deskripsi verbal)
(47, 'isian',
 '[Soal Gambar] Perhatikan gambar pada soal no. 47. Tuliskan jawaban Anda.',
 NULL,
 NULL),

-- Soal 48: Isian (Visual - geometri)
(48, 'isian',
 'Bentuk geometris ini dapat dibagi oleh sebuah garis lurus menjadi dua bagian yang dapat digabungkan untuk membentuk segi empat yang sempurna. Tariklah garis itu dengan menghubungkan dua angka. Tulislah angka itu sebagai jawaban.',
 NULL,
 NULL),

-- Soal 49: Isian (Visual - geometri)
(49, 'isian',
 'Bentuk geometris ini dapat dibagi menjadi dua bagian yang dapat disatukan untuk membuat bujur sangkar yang sempurna. Tariklah garis itu dengan menghubungkan dua nomor. Tulislah angka itu sebagai jawaban.',
 NULL,
 NULL),

-- Soal 50: Isian (Visual - segitiga)
(50, 'isian',
 'Empat dari 5 bagian ini dapat digabungkan untuk membuat segitiga. Manakah keempat gambar yang dimaksud? (Tuliskan nomor-nomornya, contoh: 1,2,3,4)',
 NULL,
 NULL);

-- ============================================
-- Tabel: admins (Akun Admin)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash of password',
    nama VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Insert Default Admin Account
-- Username: admin
-- Password: admin123
-- SHA-256 hash of "admin123" = 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- ============================================
INSERT INTO admins (username, password_hash, nama) VALUES
('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Administrator IWARE');
