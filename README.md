# TMDB Obsidian Plugin

Plugin Obsidian untuk mengintegrasikan The Movie Database (TMDB) API dengan Obsidian, memungkinkan Anda mencari informasi film dan TV show serta memasukkannya ke dalam catatan Obsidian Anda.

## Fitur

- 🔍 **Pencarian Film dan TV Show** - Cari film dan TV show dari database TMDB
- 🎬 **Format Otomatis** - Data film/TV show diformat dengan template yang dapat disesuaikan
- 🖼️ **Gambar Poster** - Sertakan gambar poster dan backdrop (opsional)
- ⚙️ **Template Kustom** - Sesuaikan format output sesuai kebutuhan
- 🌍 **Multi-bahasa** - Dukungan untuk berbagai bahasa
- 📱 **Mobile Support** - Bekerja di desktop dan mobile

## Instalasi

### Manual Installation
1. Download file `main.js`, `manifest.json`, dan `styles.css` dari release terbaru
2. Copy file-file tersebut ke folder `.obsidian/plugins/tmdb-obsidian-plugin/` di vault Obsidian Anda
3. Reload Obsidian dan aktifkan plugin di **Settings → Community plugins**

### Development Installation
1. Clone repository ini ke folder `.obsidian/plugins/tmdb-obsidian-plugin/`
2. Jalankan `npm install` untuk menginstall dependencies
3. Jalankan `npm run dev` untuk development build
4. Aktifkan plugin di Obsidian

## Setup API Key

1. Daftar di [TMDB](https://www.themoviedb.org/)
2. Pergi ke [API Settings](https://www.themoviedb.org/settings/api)
3. Request API key (gratis)
4. Copy API key Anda
5. Buka **Settings → Community plugins → TMDB Obsidian Plugin**
6. Masukkan API key di field "TMDB API Key"

## Cara Penggunaan

### 1. Melalui Ribbon Icon
- Klik icon film di ribbon kiri Obsidian
- Modal pencarian akan terbuka

### 2. Melalui Command Palette
- Tekan `Ctrl+P` (atau `Cmd+P` di Mac)
- Ketik "TMDB" untuk melihat command yang tersedia:
  - **Search Movie** - Cari film saja
  - **Search TV Show** - Cari TV show saja  
  - **Search Movie/TV Show** - Cari keduanya

### 3. Proses Pencarian
1. Masukkan nama film atau TV show yang ingin dicari
2. Tekan Enter atau klik tombol "Search"
3. Pilih hasil yang diinginkan dari daftar
4. Klik "Insert into Editor" untuk memasukkan data ke editor

## Template Variables

### Movie Variables
- `{{title}}` - Judul film
- `{{year}}` - Tahun rilis
- `{{overview}}` - Sinopsis
- `{{rating}}` - Rating (0-10)
- `{{vote_count}}` - Jumlah vote
- `{{release_date}}` - Tanggal rilis
- `{{language}}` - Bahasa asli
- `{{original_title}}` - Judul asli
- `{{popularity}}` - Popularitas
- `{{adult}}` - Konten dewasa (Yes/No)
- `{{id}}` - ID TMDB
- `{{poster_url}}` - URL poster
- `{{backdrop_url}}` - URL backdrop
- `{{genres}}` - Genre (akan ditambahkan nanti)

### TV Show Variables
- `{{name}}` - Nama TV show
- `{{year}}` - Tahun pertama tayang
- `{{overview}}` - Sinopsis
- `{{rating}}` - Rating (0-10)
- `{{vote_count}}` - Jumlah vote
- `{{first_air_date}}` - Tanggal pertama tayang
- `{{language}}` - Bahasa asli
- `{{original_name}}` - Nama asli
- `{{popularity}}` - Popularitas
- `{{adult}}` - Konten dewasa (Yes/No)
- `{{origin_countries}}` - Negara asal
- `{{id}}` - ID TMDB
- `{{poster_url}}` - URL poster
- `{{backdrop_url}}` - URL backdrop
- `{{genres}}` - Genre (akan ditambahkan nanti)

## Customization

### Template Customization
Anda dapat mengubah template default di **Settings → Community plugins → TMDB Obsidian Plugin**:

1. **Movie Template** - Template untuk data film
2. **TV Show Template** - Template untuk data TV show

### Settings Options
- **Language** - Bahasa untuk data TMDB (default: en-US)
- **Include Poster Images** - Sertakan gambar poster
- **Include Backdrop Images** - Sertakan gambar backdrop

## Contoh Output

### Movie Template Default
```markdown
# The Dark Knight (2008)

![Poster](https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg)

**Rating:** 8.5/10 (30659 votes)
**Release Date:** 2008-07-16
**Language:** en
**Overview:** Batman raises the stakes in his war on crime...

## Details
- **Original Title:** The Dark Knight
- **Popularity:** 85.2
- **Adult Content:** No

## Genres
Genres will be loaded separately

---
*Data from [TMDB](https://www.themoviedb.org/movie/155)*
```

## Development

### Build Commands
- `npm run dev` - Development build dengan watch mode
- `npm run build` - Production build
- `npm run version` - Bump version

### Project Structure
- `main.ts` - Main plugin file
- `styles.css` - Plugin styling
- `manifest.json` - Plugin metadata
- `package.json` - Dependencies dan scripts

## Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## Support

Jika Anda mengalami masalah atau memiliki saran:
1. Buat issue di GitHub repository
2. Pastikan Anda sudah mengikuti setup API key dengan benar
3. Cek console Obsidian untuk error messages

## Credits

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - Data source
- [Obsidian](https://obsidian.md/) - Platform
- Plugin ini dibuat berdasarkan [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
