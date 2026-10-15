# Hao Dimsum Web Order Dashboard

* **Nama:** Zaskia Anugrah Halimatusa'diah
* **NIM:** 2440304009
* **Kelas:** Teknik Komputer - Semester 5
* **Repository GitHub:** [hao-dimsum-dashboard](https://github.com/kayoo-7z/hao-dimsum-dashboard.git)

## 📌 Deskripsi Proyek
Aplikasi *front-end web order* dan katalog menu interaktif untuk **Hao Dimsum** (lokal Tarakan). Dibangun menggunakan HTML5 semantik, CSS responsif dengan tema warna khas Hao Dimsum, dan Vanilla JavaScript (ES6+ modular). Aplikasi ini terintegrasi dengan REST API DummyJSON serta dilengkapi data lokal sebagai sistem *fallback*.

## 🚀 Fitur Utama & Varian NIM (009)
* **Dataset Products:** Menampilkan katalog menu gabungan dari API publik DummyJSON dan menu asli Hao Dimsum.
* **Fitur Search & Sorting (Y=0):** Pencarian menu secara *real-time* serta pengurutan berdasarkan Nama (A-Z, Z-A) dan Harga (Termurah, Termahal) yang tersusun secara vertikal.
* **Analisis Data Wajib:** Menghitung rata-rata harga menu, menu tertinggi/termahal, dan total kategori secara otomatis.
* **Validasi Form Lanjutan (Z=9):** Validasi nama pemesan, input nama menu dengan pengecekan ketersediaan barang (notifikasi jika barang tidak tersedia), serta konfirmasi jumlah porsi yang saling berkaitan.
* **Challenge Individual (C=1):** Tombol *retry* interaktif saat *fetch* API gagal serta *timestamp* waktu terakhir data berhasil dimuat.

## 💻 Cara Menjalankan Proyek (Lokal Laragon)
1. Kloning repository atau letakkan folder `pemweb-pts` ke dalam direktori server lokal Laragon (`C:\laragon\www\pemweb-pts`).
2. Jalankan layanan Apache/MySQL di aplikasi Laragon.
3. Buka browser dan akses URL: `http://localhost/pemweb-pts/`