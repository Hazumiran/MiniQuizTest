# Mini Quiz App

Aplikasi web kuis interaktif yang dibangun menggunakan **React**, **Vite**, **TailwindCSS**, dan **TypeScript**. Aplikasi ini menyediakan fitur manajemen pengguna yang aman serta antarmuka yang responsif.

## Fitur Utama

- **Otentikasi Pengguna**: Login dan Register aman.
- **Dashboard Kuis**: Tampilan daftar kuis yang tersedia.
- **Pengerjaan Kuis**: Antarmuka interaktif untuk menjawab soal.
- **Riwayat (History)**: Melihat hasil dan skor kuis sebelumnya.
- **Manajemen Profil**: Mengelola data pengguna.
- **Keamanan Data**: Menggunakan `react-secure-storage` untuk penyimpanan token.

---

## Teknologi yang Digunakan

- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (Build tool)
- [TailwindCSS](https://tailwindcss.com/) (Styling)
- [React Router DOM](https://reactrouter.com/) (Routing)
- [React Secure Storage](https://www.npmjs.com/package/react-secure-storage) (Enkripsi LocalStorage)
- [React Hot Toast](https://react-hot-toast.com/) (Notifikasi)

---

## Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda.

### 1. Clone Repository

```bash
git clone https://github.com/Hazumiran/MiniQuizTest.git
cd mini-quiz
```

### 2. Install Dependencies

Pastikan Anda sudah menginstall Node.js.

```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment Variable

Buat file `.env` di direktori root project, lalu tambahkan konfigurasi berikut:

```ini
VITE_URL_BE=/api/v1
```

path lengkap : https://apiquiz.ambisiusacademy.com/api/v1

karena di vite.config.js pakai proxy untuk menghindari CORS
```
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://apiquiz.ambisiusacademy.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```


> **Catatan:** Pastikan variabel dimulai dengan `VITE_` agar dapat dibaca oleh Vite melalui `import.meta.env`.

### 4. Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka browser dan akses: `http://localhost:5173` 
# atau 
akses production di : `https://mini-quiz-test.vercel.app/`

---

## Struktur Folder

Berikut adalah gambaran struktur direktori project ini:

```bash
mini-quiz/
│
├── src/
│   ├── api              
│   │   └── index.tsx
│   ├── App.tsx             
│   ├── main.tsx            
│   ├── routes/
│   │   └── RoutesPage.tsx  
│   ├── pages/              
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── ProfilePage.tsx
│   ├── components/         
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Modal.tsx
│   │   └── AuthCard.tsx
│   ├── layout/             
│   │   └── MainLayout.tsx
│   └── utils/              
│       └── authHelper.ts
│
├── .env                    
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
