# TMDB Plugin - Contoh Penggunaan

## Cara Setup

1. **Dapatkan API Key TMDB:**
   - Daftar di [TMDB](https://www.themoviedb.org/)
   - Pergi ke [API Settings](https://www.themoviedb.org/settings/api)
   - Request API key (gratis)
   - Copy API key Anda

2. **Setup Plugin:**
   - Buka **Settings → Community plugins → TMDB Obsidian Plugin**
   - Masukkan API key di field "TMDB API Key"
   - Atur bahasa (default: en-US)
   - Pilih apakah ingin include poster/backdrop images

## Cara Penggunaan

### 1. Melalui Ribbon Icon
- Klik icon film 🎬 di ribbon kiri Obsidian
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

### TV Show Template Default
```markdown
# Breaking Bad (2008)

![Poster](https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg)

**Rating:** 8.9/10 (15000 votes)
**First Air Date:** 2008-01-20
**Language:** en
**Overview:** A high school chemistry teacher diagnosed with inoperable lung cancer...

## Details
- **Original Name:** Breaking Bad
- **Popularity:** 95.2
- **Adult Content:** No
- **Origin Countries:** US

## Genres
Genres will be loaded separately

---
*Data from [TMDB](https://www.themoviedb.org/tv/1396)*
```

## Customization

### Template Customization
Anda dapat mengubah template default di **Settings → Community plugins → TMDB Obsidian Plugin**:

1. **Movie Template** - Template untuk data film
2. **TV Show Template** - Template untuk data TV show

### Settings Options
- **Language** - Bahasa untuk data TMDB (default: en-US)
- **Include Poster Images** - Sertakan gambar poster
- **Include Backdrop Images** - Sertakan gambar backdrop

## Tips Penggunaan

1. **API Key:** Pastikan API key TMDB Anda valid dan aktif
2. **Internet Connection:** Plugin memerlukan koneksi internet untuk mengakses TMDB API
3. **Language:** Ubah bahasa di settings untuk mendapatkan data dalam bahasa yang diinginkan
4. **Templates:** Sesuaikan template sesuai kebutuhan Anda
5. **Images:** Aktifkan/disable poster dan backdrop images sesuai preferensi

## Troubleshooting

### Plugin tidak muncul di Community Plugins
- Pastikan file `main.js`, `manifest.json`, dan `styles.css` ada di folder plugin
- Reload Obsidian
- Cek console untuk error messages

### API Error
- Pastikan API key TMDB valid
- Cek koneksi internet
- Cek console untuk error details

### Search tidak menghasilkan hasil
- Pastikan query pencarian tidak kosong
- Coba dengan kata kunci yang berbeda
- Cek apakah API key memiliki permission yang cukup

## Development

### Build Commands
- `npm run dev` - Development build dengan watch mode
- `npm run build` - Production build
- `npm run version` - Bump version

### Testing
1. Jalankan `npm run dev`
2. Reload Obsidian
3. Test semua fitur plugin
4. Cek console untuk error messages
