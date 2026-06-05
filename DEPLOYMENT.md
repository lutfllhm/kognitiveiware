# 🚀 Panduan Lengkap Deploy Aplikasi Tesiware di VPS Hostinger

Panduan ini berisi langkah-demi-langkah yang jelas, teruji, dan lengkap untuk mendeploy aplikasi **Tes Kognitif IWARE (Tesiware)** ke VPS Hostinger dengan domain **`cognitive.iwareid.com`** menggunakan **Docker Compose** dan **Nginx Reverse Proxy + SSL (HTTPS)**.

---

## 📋 Daftar Isi
1. [Langkah 1: Persiapan Domain & DNS di Hostinger](#-langkah-1-persiapan-domain--dns-di-hostinger)
2. [Langkah 2: Setup & Akses VPS Hostinger (OS Ubuntu 22.04)](#-langkah-2-setup--akses-vps-hostinger-os-ubuntu-2204)
3. [Langkah 3: Instalasi Docker, Docker Compose, & Nginx di VPS](#-langkah-3-instalasi-docker-docker-compose--nginx-di-vps)
4. [Langkah 4: Transfer Source Code ke VPS](#-langkah-4-transfer-source-code-ke-vps)
5. [Langkah 5: Setup Environment & Menjalankan Docker Compose](#-langkah-5-setup-environment--menjalankan-docker-compose)
6. [Langkah 6: Konfigurasi Nginx & SSL (HTTPS Certbot)](#-langkah-6-konfigurasi-nginx--ssl-https-certbot)
7. [Langkah 7: Verifikasi & Tips Maintenance](#-langkah-7-verifikasi--tips-maintenance)

---

## 🌐 Langkah 1: Persiapan Domain & DNS di Hostinger

Sebelum melakukan setup di VPS, Anda perlu mengarahkan domain/subdomain ke IP VPS Anda agar sertifikat SSL (HTTPS) dapat dipasang dengan lancar.

1. Hubungkan ke akun **Hostinger hPanel**.
2. Masuk ke menu **Domain** -> klik **Manage** pada domain Anda (`iwareid.com`).
3. Cari menu **DNS / Nameservers** (DNS Zone Editor).
4. Tambahkan record baru:
   * **Type**: `A`
   * **Name**: `cognitive` (untuk membuat subdomain `cognitive.iwareid.com`)
   * **Points to**: `IP_VPS_ANDA` (Masukkan alamat IP VPS Hostinger Anda, misal: `193.123.45.67`)
   * **TTL**: `3600` atau default.
5. Klik **Save / Add Record**.
6. *Catatan: Proses propagasi DNS biasanya membutuhkan waktu 5 menit hingga maksimal 24 jam (biasanya sangat cepat).*

---

## 🖥️ Langkah 2: Setup & Akses VPS Hostinger (OS Ubuntu 22.04)

Untuk kemudahan instalasi Docker dan stabilitas sistem, gunakan OS **Ubuntu 22.04 LTS**.

### A. Memilih / Mengubah OS VPS di Hostinger
1. Masuk ke hPanel Hostinger, pilih **VPS** -> klik **Manage** pada VPS Anda.
2. Pada menu sidebar sebelah kiri, pilih **Settings** -> **OS & Templates**.
3. Pilih **Operating System** -> **Ubuntu 22.04 LTS (64bit)**.
4. Klik **Change OS** dan tunggu hingga proses instalasi ulang VPS selesai.

### B. Konfigurasi Firewall Hostinger (Penting!)
VPS Hostinger secara default memiliki sistem Firewall di hPanel yang sangat ketat. Anda harus memastikan port-port berikut terbuka:
1. Di hPanel VPS Anda, klik **Security** -> **Firewall**.
2. Buat Firewall Profile baru (jika belum ada) atau gunakan default.
3. Tambahkan aturan (rules) untuk membuka port berikut:
   * **Port 22** (TCP) - Untuk SSH (biasanya otomatis terbuka).
   * **Port 80** (TCP) - Untuk HTTP (Certbot & redirect).
   * **Port 443** (TCP) - Untuk HTTPS (Akses web utama).
   * *(Opsional)* **Port 3308** (TCP) - Hanya jika Anda ingin mengakses MySQL VPS secara remote dari PC lokal Anda. *Disarankan untuk ditutup demi alasan keamanan.*

### C. Masuk ke VPS via SSH
Gunakan Terminal (Linux/macOS), Command Prompt/PowerShell (Windows), atau aplikasi seperti PuTTY.

```bash
ssh root@IP_VPS_ANDA
```
*Masukkan password root VPS Anda yang telah dibuat di hPanel Hostinger.*

---

## 📦 Langkah 3: Instalasi Docker, Docker Compose, & Nginx di VPS

Setelah berhasil masuk ke SSH VPS Anda, jalankan perintah berikut secara berurutan untuk memperbarui sistem dan memasang semua tools yang dibutuhkan.

### A. Update & Upgrade OS VPS
```bash
sudo apt update && sudo apt upgrade -y
```

### B. Install Docker Engine & Docker Compose
Gunakan skrip instalasi resmi dari Docker agar mendapatkan versi terbaru dan stabil:

```bash
# 1. Unduh script installer Docker resmi
curl -fsSL https://get.docker.com -o get-docker.sh

# 2. Jalankan script installer
sudo sh get-docker.sh

# 3. Aktifkan dan jalankan service Docker
sudo systemctl enable docker
sudo systemctl start docker

# 4. Verifikasi instalasi Docker
docker --version
```

Secara default, instalasi Docker di atas sudah menyertakan plugin **Docker Compose** V2. Verifikasi dengan perintah:
```bash
docker compose version
```

### C. Install Nginx & Certbot (untuk SSL)
Nginx di VPS Host akan bertindak sebagai Reverse Proxy yang menerima trafik HTTPS pada port 443 lalu meneruskannya ke kontainer Docker di port internal.

```bash
# 1. Install Nginx dan Certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# 2. Pastikan Nginx berjalan dan aktif saat reboot
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 📂 Langkah 4: Transfer Source Code ke VPS

Ada 2 cara umum untuk memindahkan folder project `tesiware` dari komputer lokal ke VPS Hostinger:

### Pilihan A: Menggunakan Git (Sangat Direkomendasikan 🌟)
Jika project Anda sudah di-push ke GitHub/GitLab (private repository):

1. Generate SSH Key di VPS untuk dihubungkan ke akun Git Anda:
   ```bash
   ssh-keygen -t ed25519 -C "vps-hostinger@cognitive.iwareid.com"
   # Tekan Enter terus menerus sampai selesai.
   # Tampilkan public key lalu tambahkan ke GitHub Settings -> SSH Keys
   cat ~/.ssh/id_ed25519.pub
   ```
2. Clone repository ke VPS di folder `/var/www/`:
   ```bash
   cd /var/www
   git clone git@github.com:username/tesiware.git
   cd tesiware
   ```

### Pilihan B: Menggunakan SCP/SFTP (Tanpa Git)
Jika Anda ingin langsung mentransfer file lokal menggunakan program SFTP seperti **FileZilla** atau perintah terminal `scp`:

1. Di komputer lokal Anda, buka Terminal/PowerShell pada folder project `tesiware`.
2. Hapus folder `node_modules` atau folder temporary lokal sebelum mengirim agar proses transfer cepat:
   ```powershell
   # Jalankan ini di terminal lokal (bukan VPS)
   Remove-Item -Recurse -Force backend/node_modules, frontend/node_modules, frontend/.next -ErrorAction SilentlyContinue
   ```
3. Transfer seluruh isi folder `tesiware` ke VPS:
   ```bash
   scp -r ../tesiware root@IP_VPS_ANDA:/var/www/
   ```
4. Di VPS, arahkan direktori kerja Anda:
   ```bash
   cd /var/www/tesiware
   ```

---

## ⚙️ Langkah 5: Setup Environment & Menjalankan Docker Compose

Langkah ini penting untuk memastikan API Backend dan Frontend saling terhubung secara internal dan eksternal.

### A. Verifikasi File `.env` Backend & Next.js di VPS
Di dalam `/var/www/tesiware`, kita telah memiliki file `docker-compose.yml` yang mengatur environment variabel secara otomatis untuk mode produksi.

Mari pastikan konfigurasi pada `docker-compose.yml` telah sesuai:
* Database Host diarahkan ke nama service: `tesiware-db`
* Frontend URL diarahkan ke domain HTTPS: `https://cognitive.iwareid.com`
* API URL Frontend diarahkan ke subdomain HTTPS API: `https://cognitive.iwareid.com/api`

Mari buat file `.env` di backend hanya sebagai cadangan atau jika modul Node membacanya secara langsung:
```bash
# Salin konfigurasi env di backend
cp backend/.env.example backend/.env
```

### B. Build & Jalankan Docker Container
Jalankan perintah Docker Compose untuk membuild image Docker dan menjalankannya sebagai background service (`-d` / detached mode):

```bash
docker compose up -d --build
```

> **Bagaimana cara kerja database MySQL secara otomatis?**
>
> Di dalam `docker-compose.yml`, baris `- ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql` akan memetakan skema database Anda. Saat container MySQL (`tesiware-db`) pertama kali dibuat, script `schema.sql` akan dijalankan secara otomatis untuk membuat tabel dan mengimpor 50 data soal tes.

### C. Verifikasi Status Container
Pastikan ketiga container (`tesiware-db`, `tesiware-backend`, `tesiware-frontend`) berjalan normal:

```bash
docker compose ps
```

*Output yang benar harus menunjukkan status **running** (atau Up / Healthy).*

Untuk memeriksa log jika ada error:
```bash
docker compose logs -f
```
*(Tekan `Ctrl + C` untuk keluar dari logs)*

---

## 🔒 Langkah 6: Konfigurasi Nginx & SSL (HTTPS Certbot)

Sekarang, kita akan menghubungkan Nginx di VPS Host agar dapat menyalurkan trafik internet dari port `80`/`443` ke Docker container.

### A. Pasang Konfigurasi Virtual Host Nginx
Salin file template konfigurasi Nginx dari folder project ke folder konfigurasi Nginx sistem VPS:

```bash
# 1. Salin file nginx-vhost.conf ke sites-available
sudo cp nginx-vhost.conf /etc/nginx/sites-available/cognitive.iwareid.com

# 2. Buat symbolic link ke sites-enabled untuk mengaktifkannya
sudo ln -s /etc/nginx/sites-available/cognitive.iwareid.com /etc/nginx/sites-enabled/

# 3. Hapus konfigurasi default Nginx agar tidak bentrok
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Tes konfigurasi Nginx untuk memastikan tidak ada typo
sudo nginx -t
```
*Jika outputnya: `nginx: configuration file /etc/nginx/nginx.conf test is successful`, maka konfigurasi aman.*

### B. Minta Sertifikat SSL Gratis (Let's Encrypt)
Gunakan Certbot untuk mengunduh sertifikat SSL dan mengonfigurasinya secara otomatis pada Nginx:

```bash
sudo certbot --nginx -d cognitive.iwareid.com
```

* **Petunjuk Certbot:**
  * Masukkan alamat email Anda (untuk peringatan perpanjangan sertifikat).
  * Setujui Term of Service (pilih `A` atau `Y`).
  * Jika ditanya untuk membagikan email, ketik `N` (No).
  * Certbot akan mendeteksi server block `cognitive.iwareid.com` dan menanyakan apakah Anda ingin mengalihkan semua lalu lintas HTTP ke HTTPS (pilih **Redirect** / biasanya opsi `2`).

### C. Aktifkan Konfigurasi SSL di Nginx
Certbot akan secara otomatis mengedit file konfigurasi Nginx Anda di `/etc/nginx/sites-available/cognitive.iwareid.com` dan menambahkan baris SSL yang diperlukan.

Namun, mari kita pastikan konfigurasi kita bersih. Buka file konfigurasi tersebut:
```bash
sudo nano /etc/nginx/sites-available/cognitive.iwareid.com
```

Pastikan baris SSL yang sebelumnya di-comment `#` sekarang sudah aktif atau sudah digantikan oleh konfigurasi Certbot secara otomatis:
```nginx
    ssl_certificate /etc/letsencrypt/live/cognitive.iwareid.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/cognitive.iwareid.com/privkey.pem; # managed by Certbot
```

*Simpan perubahan dengan menekan `Ctrl + O`, lalu `Enter`, lalu keluar dengan `Ctrl + X`.*

### D. Restart Nginx
Muat ulang Nginx untuk menerapkan semua perubahan sertifikat SSL:

```bash
sudo systemctl restart nginx
```

---

## 🛠️ Langkah 7: Verifikasi & Tips Maintenance

### A. Uji Coba Aplikasi
1. Buka browser Anda dan akses: **`https://cognitive.iwareid.com`**
2. Coba daftarkan peserta tes psikotes untuk memverifikasi alur database.
3. Akses halaman admin di **`https://cognitive.iwareid.com/admin`** untuk memantau hasil tes peserta.

### B. Perintah-Perintah Penting Selama Maintenance (VPS CLI)

* **Melihat Log Real-time Aplikasi:**
  ```bash
  cd /var/www/tesiware
  docker compose logs -f tesiware-backend    # Log Backend saja
  docker compose logs -f tesiware-frontend   # Log Frontend saja
  ```

* **Melakukan Update Code Aplikasi:**
  Jika Anda melakukan perubahan source code lokal dan ingin meng-update VPS:
  ```bash
  cd /var/www/tesiware
  git pull origin main
  docker compose up -d --build
  ```

* **Melakukan Backup Database MySQL:**
  Karena data MySQL tersimpan di Docker Volume, Anda bisa mem-backup isinya dari host VPS dengan perintah:
  ```bash
  docker exec tesiware-db mysqldump -u root -p=tesiware_root_password tesiware > backup_tesiware_$(date +%F).sql
  ```

* **Melakukan Restore Database MySQL:**
  ```bash
  docker exec -i tesiware-db mysql -u root -p=tesiware_root_password tesiware < nama_file_backup.sql
  ```

* **Perpanjangan SSL Otomatis:**
  Let's Encrypt bertahan selama 90 hari, namun sistem Ubuntu telah menyetel cronjob otomatis untuk memperbaruinya. Anda bisa mengujinya dengan:
  ```bash
  sudo certbot renew --dry-run
  ```

---

> 💡 **Rekomendasi Keamanan:**
> Demi keamanan, jangan pernah membagikan password root VPS atau password MySQL root (`tesiware_root_password`) yang tercantum di file `docker-compose.yml` kepada pihak yang tidak berwenang. Anda dapat mengganti password tersebut pada file `docker-compose.yml` sebelum menjalankan perintah `docker compose up -d --build`.
