// ============================================
// Tes Kognitif IWARE — Data Soal (50 Soal)
// ============================================

export interface Question {
  id: number;
  type: "pilihan_ganda" | "isian";
  text: string;
  options?: string[];
  image?: string;
  headerImage?: string;
}

export const questions: Question[] = [
  {
    id: 1,
    type: "pilihan_ganda",
    text: "Jumlah jam dalam setengah hari, sama dengan bulan…",
    options: ["a. Juni", "b. Juli", "c. Desember", "d. Januari"],
  },
  {
    id: 2,
    type: "pilihan_ganda",
    text: "PASCA dan PASKA, apakah kata ini:",
    options: [
      "a. Memiliki arti sama",
      "b. Memiliki arti berlawanan",
      "c. Tidak memiliki arti sama atau berlawanan",
    ],
  },
  {
    id: 3,
    type: "isian",
    text: "Berapa banyak yang sama dari duplikasi di bawah ini?\nHJNBKL – HJNBKL\nAYKLMNO – AYKLMHO\nDBGAYEFE – DBAGYFFE\nJTXHGIKLM – JTXHGIKLM\nHIHMPKDQW – HINPKMDQW",
  },
  {
    id: 4,
    type: "pilihan_ganda",
    text: "TIBA adalah lawan kata dari…",
    options: ["a. Datang", "b. Pulang", "c. Muncul", "d. Terbit"],
  },
  {
    id: 5,
    type: "pilihan_ganda",
    text: "Angka selanjutnya dari deretan di bawah ini adalah\n12  1  9  1  6  1  ….",
    options: ["a. 6", "b. 2", "c. 3", "d. 12"],
  },
  {
    id: 6,
    type: "pilihan_ganda",
    text: "Dari 5 peribahasa di bawah ini manakah yang serupa?\na. Bagai menuangkan garam ke lautan\nb. Air pun ada pasang surutnya\nc. Bergantung pada akar lapuk\nd. Gali lubang, tutup lubang\ne. Habis manis sepah dibuang",
    options: ["a. a dan b", "b. a dan d", "c. b dan c", "d. c dan d", "e. a dan e"],
  },
  {
    id: 7,
    type: "isian",
    text: "Manakah angka yang terkecil dari kelompok angka ini?\n10  1  0.99  2  0.9  0.33  3",
  },
  {
    id: 8,
    type: "isian",
    text: "Berapa duplikasi dari pasangan di bawah ini?\nRaxford, S.J – Raxford, S.J.\nSilverstein, A.M – Silverstain, A.M\nJohnhansen, D.C – Johnhansen, D.C\nWood, L.A – Wood, L.A\nHarringtons, K.B – Haringtons, K.B.",
  },
  {
    id: 9,
    type: "pilihan_ganda",
    text: "Amati 2 kalimat berikut:\nHidup dikandung adat, mati dikandung tanah.\nLain ladang lain belalang, lain lubuk lain ikannya.\nApakah 2 kalimat tersebut memiliki arti yang….",
    options: ["a. Sama", "b. Berlawanan", "c. Tidak sama atau berlawanan"],
  },
  {
    id: 10,
    type: "isian",
    text: "Sebuah jam terlambat 1 menit 12 detik dalam 24 hari. Berapa detik ia terlambat setiap harinya?",
  },
  {
    id: 11,
    type: "isian",
    text: "Berapa angka selanjutnya dari deretan ini?\n5  6  8  11  15  20  …….",
  },
  {
    id: 12,
    type: "pilihan_ganda",
    text: "MUSIM HUJAN adalah lawan kata dari…",
    options: [
      "a. Musim panas",
      "b. Musim kemarau",
      "c. Musim kering",
      "d. Musim semi",
    ],
  },
  {
    id: 13,
    type: "pilihan_ganda",
    text: "Dari kata di bawah ini manakah kata yang berbeda dari lainnya?",
    options: [
      "a. Tim",
      "b. Kelompok",
      "c. Komunitas",
      "d. Liga",
      "e. Pasukan",
    ],
  },
  {
    id: 14,
    type: "isian",
    text: "Susun kata-kata di bawah ini menjadi kalimat yang tepat. Huruf terakhir dari rangkaian kalimat tersebut adalah….\nOrang  hidup  yang  pasti  setiap  bernafas",
  },
  {
    id: 15,
    type: "isian",
    text: "3 buah buku tulis seharga Rp 100,-. Berapakah harga 2 lusinnya?",
  },
  {
    id: 16,
    type: "pilihan_ganda",
    text: "Anak laki-laki ini adalah anak yang normal.\nSemua anak normal sifatnya aktif.\nAnak laki-laki ini sifatnya aktif.\nAnggaplah dua pernyataan pertama adalah benar. Apakah yang terakhir",
    options: ["a. Benar", "b. Salah", "c. Tidak tahu"],
  },
  {
    id: 17,
    type: "isian",
    text: "Sebuah kotak segi empat yang terisi penuh memuat 8.000 kubik kaki buah jeruk. Jika satu kotak lebarnya 10 kaki dan panjangnya 20 kaki. Berapa kedalaman kotak itu?",
  },
  {
    id: 18,
    type: "isian",
    text: "Berapa angka selanjutnya dari deret ini?\n1  0.5  0.25  0.125  ……….",
  },
  {
    id: 19,
    type: "pilihan_ganda",
    text: "GENERAL – GENEROUS apakah kedua kata ini memiliki arti…",
    options: [
      "a. Sama",
      "b. Berlawanan",
      "c. Tidak memiliki arti sama atau berlawanan",
    ],
  },
  {
    id: 20,
    type: "pilihan_ganda",
    text: "LIBURAN – KERJA apakah kedua kata ini memiliki arti….",
    options: [
      "a. Sama",
      "b. Berlawanan",
      "c. Tidak memiliki arti sama atau berlawanan",
    ],
  },
  {
    id: 21,
    type: "isian",
    text: "Kalau 6 orang harus membagi Rp 4.800,- berapakah yang didapat masing-masing orang?",
  },
  {
    id: 22,
    type: "isian",
    text: "Susunlah kata-kata ini hingga benar. Tuliskan (B) jika benar dan (S) jika salah.\nTimur di terbit matahari",
  },
  {
    id: 23,
    type: "pilihan_ganda",
    text: "Semua anak bertopi menyukai balon.\nNini adalah gadis bertopi baret.\nNini menyukai balon.\nAnggaplah dua pernyataan ini benar. Pernyataan terakhir adalah….",
    options: ["a. Benar", "b. Salah", "c. Tidak tahu"],
  },
  {
    id: 24,
    type: "pilihan_ganda",
    text: "Amati 2 kalimat berikut:\nKalau tidak angin bertiup, tidak akan pohon bergoyang.\nTak ada asap kalau tak ada api.\nApakah kalimat tersebut memiliki arti yang….",
    options: ["a. Sama", "b. Berlawanan", "c. Tidak sama atau berlawanan"],
  },
  {
    id: 25,
    type: "pilihan_ganda",
    text: "BIASA adalah lawan kata dari….",
    options: [
      "a. Jarang",
      "b. Terbiasa",
      "c. Tetap",
      "d. Berhenti",
      "e. Selalu",
    ],
  },
  {
    id: 26,
    type: "pilihan_ganda",
    text: "Sebagian besar dari kelompok kata di bawah ini adalah sama, yang berbeda adalah…",
    options: [
      "a. Selasa",
      "b. Minggu",
      "c. Kamis",
      "d. Juni",
      "e. Rabu",
    ],
  },
  {
    id: 27,
    type: "isian",
    text: "Berapa jam yang akan ditempuh sebuah kereta yang kecepatannya 70 km/jam dengan panjang jalan 910 km?",
  },
  {
    id: 28,
    type: "pilihan_ganda",
    text: "DEKAT adalah lawan kata dari….",
    options: [
      "a. Asing",
      "b. Terpencil",
      "c. Jauh",
      "d. Panjang",
      "e. Terburu-buru",
    ],
  },
  {
    id: 29,
    type: "pilihan_ganda",
    text: "Dewa seusia dengan Deni.\nDeni lebih tua dari Dewi.\nDewi lebih tua dari Dewa.\nJika kedua pernyataan pertama benar, maka pernyataan ketiga adalah…",
    options: ["a. Benar", "b. Salah", "c. Tidak tahu"],
  },
  {
    id: 30,
    type: "isian",
    text: "Seorang anak berumur 6 tahun, saudaranya dua kali lebih tua darinya. Saat anak tersebut berumur 10 tahun, berapa umur saudaranya?",
  },
  {
    id: 31,
    type: "pilihan_ganda",
    text: "PRA – PRE apakah dua kata ini memiliki arti yang…",
    options: [
      "a. Sama",
      "b. Berlawanan",
      "c. Tidak sama atau berlawanan",
    ],
  },
  {
    id: 32,
    type: "isian",
    text: "Sebuah kemeja membutuhkan 2½ meter kain. Berapa banyak potong yang dihasilkan dari 60 meter kain?",
  },
  {
    id: 33,
    type: "isian",
    text: "Dua orang menangkap 36 ikan. A menangkap 5 kali lebih banyak daripada B. Berapa yang ditangkap B?",
  },
  {
    id: 34,
    type: "isian",
    text: "Tim bisbol kalah 9 permainan dalam musim ini. Ini merupakan 3/8 bagian dari semua pertandingan mereka. Berapa banyak pertandingan yang mereka mainkan musim ini?",
  },
  {
    id: 35,
    type: "isian",
    text: "Sebuah jam menunjukkan tepat pukul 12 siang pada hari Senin. Pada pukul 8 malam hari Selasa, jam itu terlambat 32 detik. Pada rata-rata yang sama, berapa banyak jam itu terlambat dalam ½ jam?",
  },
  {
    id: 36,
    type: "isian",
    text: "Seorang dealer membeli beberapa box apel seharga 4.000 rupiah. Ia menjual dengan harga 5.000 rupiah, mendapat untung 50 rupiah setiap boxnya. Berapa banyak box yang dijualnya?",
  },
  {
    id: 37,
    type: "pilihan_ganda",
    text: "Dalam kumpulan kata berikut mana yang berbeda dari lainnya?",
    options: [
      "a. Kumpulan",
      "b. Konvoi",
      "c. Sekumpulan",
      "d. Seorang teman",
      "e. Angkatan",
    ],
  },
  {
    id: 38,
    type: "pilihan_ganda",
    text: "Tidak ada orang jujur yang meminta maaf atas kejujurannya. Kejujuran dihormati dan lapar pujian.\nApakah dua kalimat di atas memiliki arti yang…",
    options: [
      "a. Sama",
      "b. Berlawanan",
      "c. Tidak sama atau berlawanan",
    ],
  },
  {
    id: 39,
    type: "pilihan_ganda",
    text: "Semua pemimpin progresif. Sebagian besar pemimpin adalah wiraswastawan. Orang yang progresif adalah wiraswastawan.\nApabila kedua pernyataan pertama adalah benar. Maka, pernyataan ketiga adalah…",
    options: ["a. Benar", "b. Salah", "c. Tidak tahu"],
  },
  {
    id: 40,
    type: "isian",
    text: "Dengan harga 1.80 dolar, seorang grosir membeli satu kardus yang berisi 12 lusin wortel. Ia tahu 2 lusin akan busuk sebelum dijualnya. Berapa harga per lusin jika ia harus menjual wortel tersebut 1/3 dari harga sebelumnya?",
  },
  {
    id: 41,
    type: "isian",
    text: "Tiga orang membentuk kemitraan dan setuju membagi keuntungan secara rata. X menginvestasikan 5.500 dolar, Y 3.500 dolar dan Z 1.000 dolar. Jika keuntungan mencapai 3.000 dolar, lebih kurang berapa yang diterima Z jika keuntungan dibagi berdasarkan besarnya investasi?",
  },
  {
    id: 42,
    type: "isian",
    text: "Seorang pembuat jalan memasang batu tegel yang panjangnya 6 dm dan lebarnya 40 cm. Ia membutuhkan 600 tegel. Berapa meter-persegikah jalan itu?",
  },
  {
    id: 43,
    type: "pilihan_ganda",
    text: "Klien dan pelanggan apakah kedua kata ini…",
    options: [
      "a. Memiliki arti yang sama",
      "b. Memiliki arti berlawanan",
      "c. Tidak memiliki arti sama atau berlawanan",
    ],
  },
  {
    id: 44,
    type: "pilihan_ganda",
    text: "Manakah dari kata berikut yang berhubungan dengan mengunyah?",
    options: [
      "a. Manis",
      "b. Bau tak sedap",
      "c. Wangi",
      "d. Hidung",
      "e. Bersih",
    ],
  },
  {
    id: 45,
    type: "isian",
    text: "Jawablah dengan YA atau TIDAK.\nP.S. artinya melakukan registrasi.",
  },
  {
    id: 46,
    type: "isian",
    text: "Soal untuk no 46-47\n\nPerhatikan potongan-potongan gambar di bawah ini. Pilih salah satu jawaban (1–5) yang merupakan bentuk utuh yang dapat dibentuk dari seluruh potongan tersebut. Setiap potongan hanya dapat digunakan satu kali dan tidak saling bertumpuk.",
    image: "/soal/46.png",
    headerImage: "/soal/petunjuk_46_47.png",
  },
  {
    id: 47,
    type: "isian",
    text: "Soal untuk no 46-47\n\nPerhatikan potongan-potongan gambar di bawah ini. Pilih salah satu jawaban (1–5) yang merupakan bentuk utuh yang dapat dibentuk dari seluruh potongan tersebut. Setiap potongan hanya dapat digunakan satu kali dan tidak saling bertumpuk.",
    image: "/soal/47.png",
    headerImage: "/soal/petunjuk_46_47.png",
  },
  {
    id: 48,
    type: "isian",
    text: "Bentuk geometris ini dapat dibagi oleh sebuah garis lurus menjadi dua bagian yang dapat digabungkan untuk membentuk segi empat yang sempurna. Tariklah garis itu dengan menghubungkan dua angka. Lalu tulislah angka itu sebagai jawaban (contoh: 3-9).",
    image: "/soal/soal_48.png",
  },
  {
    id: 49,
    type: "isian",
    text: "Bentuk geometris ini dapat dibagi menjadi dua bagian yang dapat disatukan untuk membuat bujur sangkar yang sempurna. Tariklah garis itu dengan menghubungkan dua nomor. Lalu tulislah angka itu sebagai jawaban (contoh: 3-13).",
    image: "/soal/soal_49.jpg",
  },
  {
    id: 50,
    type: "isian",
    text: "Empat dari 5 bagian ini dapat digabungkan untuk membuat segitiga. Manakah keempat gambar yang dimaksud? (Tuliskan nomor-nomornya, contoh: 1,2,4,5)",
    image: "/soal/soal_50.png",
  },
];
