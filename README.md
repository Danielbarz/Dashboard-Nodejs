# Telkom Executive Dashboard (Node.js + React)

Dashboard monitoring performansi terpadu untuk unit Telkom Indonesia, mencakup modul **HSI (High Speed Internet)**, **DATIN (Data Internet)**, **Digital Product**, dan **Jaringan Tambahan (JT)**.

Sistem ini dirancang untuk memproses dataset besar dari file Excel/CSV, melakukan mapping otomatis berdasarkan NIPNAS atau Wilayah, serta menyajikan visualisasi data yang interaktif dan *mobile-friendly*.

## 🚀 Fitur Utama

- **Multi-Module Dashboard**: Visualisasi KPI mendalam untuk HSI, DATIN, Digital Product, dan Jaringan Tambahan.
- **Advanced Reporting**: Laporan detail dengan filter dinamis, pengurutan, dan fitur ekspor ke Excel.
- **AI Dashboard Assistant**: Asisten pintar berbasis kata kunci untuk query data instan via chat.
- **Master Data Management**: Kelola mapping PO (Account Manager) dan NIPNAS secara terpusat.
- **Target Management**: Pengaturan target performansi (Revenue & Order) bulanan per Witel/Produk.
- **Data Import System**: Sistem upload file yang aman dengan logika *deduplication* dan *overlay*.
- **Admin & Superadmin Mode**: Kontrol akses ketat untuk fitur sensitif seperti hapus data dan manajemen user.
- **Responsive UI**: Tampilan modern dan bersih yang optimal di layar Desktop maupun Mobile.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts, Chart.js, React-Icons.
- **Backend**: Node.js, Express.js, Prisma ORM.
- **Database**: PostgreSQL.
- **State Management**: React Context API (Auth).
- **Processing**: ExcelJS, Day.js.

---

## 📦 Panduan Instalasi (Full Setup)

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 16 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/)
- Git

### 2. Clone Repository
```bash
git clone https://github.com/Danielbarz/Telkom-Dashboard-Nodejs.git
cd Telkom-Dashboard-Nodejs
```

### 3. Setup Backend (Server)
1. Masuk ke direktori server:
   ```bash
   cd server
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   Buat file `.env` di folder `server` dan isi dengan konfigurasi database Anda:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"
   JWT_SECRET="rahasia_super_aman"
   ```
4. Setup Database & Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Seed Data User Awal:
   ```bash
   node seed-users.js
   ```
   *(Script ini akan membuat user admin default: `admin@telkom.co.id` / `admin123`)*

### 4. Setup Frontend (Client)
1. Masuk ke direktori client:
   ```bash
   cd ../client
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi Environment:
   Buat file `.env` di folder `client`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

---

## 🏃 Menjalankan Aplikasi

### Menjalankan Backend
Di folder `server`:
```bash
npm start
```
Server akan berjalan di `http://localhost:5000`.

### Menjalankan Frontend
Di folder `client`:
```bash
npm start
```
Aplikasi akan terbuka di `http://localhost:3000`.

---

## 🔑 Akun Default (Login)

Setelah menjalankan seeder, Anda dapat masuk menggunakan:
- **Email**: `admin@telkom.co.id`
- **Password**: `admin123`

*(Pastikan untuk menekan tombol **"Masuk Mode Admin"** di sidebar bawah untuk mengakses fitur pengelolaan data)*

---

## 📁 Struktur Proyek

```text
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Komponen Reusable (Charts, Loaders, UI)
│   │   ├── pages/         # Halaman Dashboard & Report
│   │   ├── layouts/       # AppLayout & Sidebar
│   │   └── services/      # API Service (Axios)
├── server/                # Express Backend
│   ├── src/
│   │   ├── controllers/   # Logika Bisnis & Query SQL
│   │   ├── routes/        # Definisi Endpoint API
│   │   ├── services/      # AI Brain & Logic Service
│   │   └── prisma/        # Schema Database & Migrations
└── README.md
```

---

## 🛡️ Troubleshooting

- **Error BigInt di Backend**: Sistem sudah menyertakan patch global. Pastikan menggunakan `server/src/index.js` versi terbaru.
- **Data Kosong di Report**: Pastikan filter tanggal di bagian atas halaman sudah mencakup periode data yang Anda upload.
- **Prisma Out of Sync**: Jika Anda menambah kolom manual di DB, jalankan `npx prisma db pull` diikuti `npx prisma generate`.

---

## 📄 Lisensi
Hak Cipta © 2026 Telkom Indonesia. Dikembangkan untuk keperluan internal monitoring.