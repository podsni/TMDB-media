# TMDB Obsidian Plugin - Quick Start Guide

## 🚀 Quick Setup (5 menit)

### 1. Install Plugin
- Copy file `main.js`, `manifest.json`, dan `styles.css` ke folder `.obsidian/plugins/tmdb-obsidian-plugin/`
- Reload Obsidian
- Aktifkan plugin di **Settings → Community plugins**

### 2. Setup API Key
- Daftar di [TMDB](https://www.themoviedb.org/) (gratis)
- Dapatkan API key di [API Settings](https://www.themoviedb.org/settings/api)
- Masukkan API key di **Settings → Community plugins → TMDB Obsidian Plugin**

### 3. Mulai Menggunakan
- Klik icon 🎬 di ribbon kiri Obsidian
- Atau tekan `Ctrl+P` dan ketik "TMDB"
- Cari film/TV show yang diinginkan
- Klik "Insert into Editor"

## 🎯 Fitur Utama

✅ **Pencarian Film & TV Show** - Akses database TMDB lengkap
✅ **Template Kustom** - Format output sesuai kebutuhan
✅ **Multi-bahasa** - Dukungan berbagai bahasa
✅ **Gambar Poster** - Sertakan poster dan backdrop
✅ **Mobile Support** - Bekerja di desktop dan mobile
✅ **Settings Lengkap** - Konfigurasi sesuai preferensi

## 📝 Template Variables

### Movie
`{{title}}`, `{{year}}`, `{{overview}}`, `{{rating}}`, `{{vote_count}}`, `{{release_date}}`, `{{language}}`, `{{original_title}}`, `{{popularity}}`, `{{adult}}`, `{{id}}`, `{{poster_url}}`, `{{backdrop_url}}`

### TV Show
`{{name}}`, `{{year}}`, `{{overview}}`, `{{rating}}`, `{{vote_count}}`, `{{first_air_date}}`, `{{language}}`, `{{original_name}}`, `{{popularity}}`, `{{adult}}`, `{{origin_countries}}`, `{{id}}`, `{{poster_url}}`, `{{backdrop_url}}`

## 🛠️ Commands

- **Search Movie** - Cari film saja
- **Search TV Show** - Cari TV show saja
- **Search Movie/TV Show** - Cari keduanya

## ⚙️ Settings

- **API Key** - Kunci akses TMDB
- **Language** - Bahasa data (en-US, id-ID, dll)
- **Include Poster Images** - Sertakan gambar poster
- **Include Backdrop Images** - Sertakan gambar backdrop
- **Movie Template** - Template untuk film
- **TV Show Template** - Template untuk TV show

## 🔧 Development

```bash
# Install dependencies
npm install

# Development build
npm run dev

# Production build
npm run build
```

## 📚 Dokumentasi Lengkap

- [README.md](README.md) - Dokumentasi lengkap
- [USAGE.md](USAGE.md) - Panduan penggunaan detail
- [TEMPLATE_EXAMPLES.md](TEMPLATE_EXAMPLES.md) - Contoh template

## 🆘 Troubleshooting

### Plugin tidak muncul
- Pastikan file `main.js`, `manifest.json`, `styles.css` ada
- Reload Obsidian
- Cek console untuk error

### API Error
- Pastikan API key valid
- Cek koneksi internet
- Cek console untuk detail error

### Search tidak ada hasil
- Pastikan query tidak kosong
- Coba kata kunci berbeda
- Cek permission API key

## 📄 License

MIT License - Lihat [LICENSE](LICENSE) untuk detail.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📞 Support

- Buat issue di GitHub repository
- Pastikan sudah mengikuti setup dengan benar
- Cek console Obsidian untuk error messages

---

**Happy Movie/TV Show Tracking! 🎬📺**
