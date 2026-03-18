# PT. Sekawan Nickel Mining - Vehicle Management System (VMS)

Sistem Manajemen Kendaraan (VMS) untuk operasional pertambangan nikel PT. Sekawan Nickel Mining. Aplikasi ini dibangun menggunakan CodeIgniter 4 sebagai backend API dan React sebagai frontend, bertujuan untuk mengelola penggunaan kendaraan, bahan bakar, pemeliharaan, dan sistem persetujuan peminjaman kendaraan.

## 🚀 Fitur Utama

- **Dashboard Dinamis**: Visualisasi data status kendaraan, biaya bulanan, dan jarak tempuh menggunakan grafik (Recharts).
- **Sistem Booking & Approval**: Alur pemesanan kendaraan dengan sistem persetujuan bertingkat (Level 1 & Level 2).
- **Manajemen Data Master**: CRUD lengkap untuk Kendaraan, Driver, Pegawai, dan Lokasi.
- **Log Histori Kendaraan**: Pencatatan riwayat penggunaan, konsumsi bahan bakar, dan jadwal servis/maintenance.
- **Responsive UI & Dark Mode**: Tampilan premium yang mendukung perangkat mobile dan fitur mode gelap.

## 🛠️ Tech Stack

- **PHP Version**: 8.2+
- **Framework**: CodeIgniter 4.7
- **Frontend**: React (Vite)
- **Database**: MySQL 8.0+
- **UI Architecture**: Tailwind CSS, Lucide Icons, Recharts

## 📦 Panduan Instalasi

### 1. Prasyarat

Pastikan Anda sudah menginstal:

- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL Server

### 2. Kloning Repositori

```bash
git clone <repository-url>
cd ci4-react-sekawan
```

### 3. Konfigurasi Environment

Salin file `env` menjadi `.env`:

```bash
cp env .env
```

Sesuaikan konfigurasi database di file `.env`:

```env
database.default.hostname = localhost
database.default.database = ci4-react-sekawan
database.default.username = your_username
database.default.password = your_password
database.default.DBDriver = MySQLi
```

### 4. Instalasi Dependency

```bash
composer install
npm install
```

### 5. Setup Database

Jalankan migrasi dan seeder untuk data awal:

```bash
php spark migrate
php spark db:seed MainSeeder
```

### 6. Menjalankan Aplikasi

Jalankan server pengembangan:

**Backend (Port 8080):**

```bash
php spark serve
```

**Frontend (Port 3479):**

```bash
npm run dev
```

Aplikasi dapat diakses di `http://localhost:3479`.

## 👤 Akun Default (Seeded)

| Role         | Email                | Password   |
| ------------ | -------------------- | ---------- |
| **Admin**    | `admin@gmail.com`    | `password` |
| **Approver** | `approver@gmail.com` | `password` |

## 📊 Class Diagram

>
> ![Class Diagram Placeholder](https://i.imgur.com/W6ULXjh.png)

## 📖 Panduan Penggunaan

1. **Login**: Gunakan akun admin untuk mengelola data master.
2. **Tambah Kendaraan**: Pastikan data lokasi sudah tersedia sebelum menambahkan kendaraan baru.
3. **Booking**: Pegawai dapat mengajukan peminjaman kendaraan melalui menu Booking.
4. **Approval**: Akun dengan role `approver` atau `admin` dapat menyetujui atau menolak pengajuan di menu Approvals.
5. **Dashboard**: Pantau statistik penggunaan secara real-time.

---

© 2026 PT. Sekawan Nickel Mining · Test Technical Fullstack Developer
