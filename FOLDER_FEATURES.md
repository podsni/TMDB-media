# TMDB Plugin - Fitur Save to Folder dengan Lokasi Kustom

## 🎯 Fitur Baru: Save to Folder dengan Lokasi Kustom

Plugin TMDB sekarang mendukung penyimpanan file ke folder dengan lokasi yang dapat dipilih pengguna, dengan default folder TMDB.

### ✨ Fitur Utama

1. **📁 Folder Selection Dialog** - Pilih lokasi folder saat menyimpan
2. **⚡ Quick Select Buttons** - Tombol cepat untuk folder populer
3. **💾 Remember Last Location** - Ingat folder terakhir yang digunakan
4. **🔄 Auto Create Folder** - Otomatis buat folder jika belum ada
5. **📝 Smart Filename** - Generate nama file berdasarkan template

## 🚀 Cara Penggunaan

### 1. Setup Settings
1. Buka **Settings → Community plugins → TMDB Obsidian Plugin**
2. Aktifkan **"Ask for Save Location"** untuk memilih folder setiap kali
3. Aktifkan **"Remember Last Location"** untuk mengingat folder terakhir
4. Set **"Default Folder"** ke "TMDB" (default)
5. Set **"File Name Template"** ke "{{title}}" untuk nama sederhana

### 2. Proses Penyimpanan
1. Cari film/TV show menggunakan plugin
2. Klik **"Save to Folder"** pada hasil pencarian
3. **Folder Selection Dialog** akan muncul dengan:
   - Input field untuk nama folder
   - Quick select buttons: TMDB, Movies, TV Shows, Entertainment, Watchlist
   - Tombol "Save Here" dan "Cancel"

### 3. Quick Select Options
- **TMDB** - Folder default untuk semua konten
- **Movies** - Khusus untuk film
- **TV Shows** - Khusus untuk serial TV
- **Entertainment** - Konten hiburan umum
- **Watchlist** - Daftar tontonan

## ⚙️ Settings Configuration

### Ask for Save Location
- **ON**: Tampilkan dialog pemilihan folder setiap kali save
- **OFF**: Gunakan folder default atau folder terakhir

### Remember Last Location
- **ON**: Ingat folder terakhir yang digunakan
- **OFF**: Selalu gunakan folder default

### Default Folder
- Folder default jika tidak ada pilihan lain
- Default: "TMDB"

### Auto Create Folder
- **ON**: Otomatis buat folder jika belum ada
- **OFF**: Hanya gunakan folder yang sudah ada

### File Name Template
- Template untuk nama file
- Default: "{{title}}" → "Money Heist.md"
- Contoh lain:
  - "{{title}} ({{year}})" → "Money Heist (2017).md"
  - "{{original_title}}" → "La Casa de Papel.md"

## 📝 Contoh Penggunaan

### Skenario 1: Save dengan Dialog
1. Cari "Money Heist"
2. Klik "Save to Folder"
3. Dialog muncul dengan input "TMDB"
4. Klik "Save Here"
5. File tersimpan sebagai "Money Heist.md" di folder TMDB

### Skenario 2: Quick Select
1. Cari "The Dark Knight"
2. Klik "Save to Folder"
3. Dialog muncul
4. Klik tombol "Movies"
5. Input berubah ke "Movies"
6. Klik "Save Here"
7. File tersimpan sebagai "The Dark Knight.md" di folder Movies

### Skenario 3: Custom Folder
1. Cari "Breaking Bad"
2. Klik "Save to Folder"
3. Dialog muncul
4. Ketik "My TV Shows" di input
5. Klik "Save Here"
6. File tersimpan sebagai "Breaking Bad.md" di folder "My TV Shows"

## 🔧 Advanced Features

### Duplicate File Handling
- Jika file dengan nama yang sama sudah ada, akan ditambahkan nomor
- Contoh: "Money Heist.md", "Money Heist (1).md", "Money Heist (2).md"

### Filename Cleaning
- Otomatis bersihkan karakter yang tidak valid
- Hapus karakter khusus: `<>:"/\|?*`
- Ganti multiple spaces dengan single space
- Hapus leading/trailing dots

### Auto Open File
- File yang baru dibuat akan otomatis dibuka di editor
- Memudahkan untuk review atau edit langsung

## 🎨 UI/UX Features

### Responsive Design
- Modal responsive untuk mobile dan desktop
- Button layout yang adaptif
- Touch-friendly interface

### Keyboard Support
- Enter key untuk confirm
- Tab navigation
- Escape key untuk cancel

### Visual Feedback
- Loading states
- Success/error notifications
- Clear button labels

## 🔍 Troubleshooting

### Folder tidak dibuat
- Pastikan "Auto Create Folder" aktif
- Cek permission folder di vault
- Pastikan nama folder valid

### File tidak tersimpan
- Cek koneksi internet untuk API
- Pastikan vault tidak dalam mode read-only
- Cek console untuk error details

### Dialog tidak muncul
- Pastikan "Ask for Save Location" aktif
- Reload plugin jika perlu
- Cek console untuk error

## 📋 Best Practices

1. **Organisasi Folder**
   - Gunakan struktur folder yang konsisten
   - Pisahkan Movies dan TV Shows
   - Buat subfolder untuk genre jika perlu

2. **Naming Convention**
   - Gunakan template yang konsisten
   - Hindari karakter khusus dalam nama folder
   - Gunakan nama yang deskriptif

3. **Settings Management**
   - Aktifkan "Remember Last Location" untuk kemudahan
   - Set default folder yang sesuai dengan workflow
   - Gunakan "Auto Create Folder" untuk fleksibilitas

---

**Happy Organizing! 📁✨**
