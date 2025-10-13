# TMDB Plugin - Format TV Show Series

## 🎯 Format TV Show Series yang Diperbarui

Plugin TMDB sekarang menggunakan format YAML frontmatter yang sesuai dengan struktur database media untuk TV shows/series.

### ✨ Format Output TV Show

File yang dibuat akan memiliki format seperti ini:

**Contoh untuk TV Show "Naruto: Shippuden":**
```yaml
---
type: series
subType: ""
title: "Naruto: Shippuden"
englishTitle: "Naruto: Shippuden"
year: 2007
dataSource: OMDbAPI
url: https://www.themoviedb.org/tv/31917
id: 31917
plot: Naruto Uzumaki, is a loud, hyperactive, adolescent ninja who constantly searches for approval and recognition, as well as to become Hokage, who is acknowledged as the leader and strongest of all ninja in the village.
genres:
  - Genre 16
  - Genre 28
writer:
  - TBD
studio:
  - TBD
episodes: 0
duration: 24 min
onlineRating: 8.7
actors: []
image: https://image.tmdb.org/t/p/w500/7g9a7Xx8w8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8.jpg
released: true
streamingServices: []
airing: false
airedFrom: 2/15/2007
airedTo: unknown
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/series
categories:
  - "[[Series]]"
created: 2025-01-27
---
```

## 📁 Naming Convention untuk TV Shows

### Default Filename Format
- **Template**: `{{title}} ({{year}})`
- **Contoh**: `Naruto Shippuden (2007).md`, `Breaking Bad (2008).md`

### Custom Filename Options
- `{{title}}` → `Naruto Shippuden.md`
- `{{title}} ({{year}})` → `Naruto Shippuden (2007).md`
- `{{original_name}}` → `Naruto Shippuden.md`
- `{{name}} - Series` → `Naruto Shippuden - Series.md`

## 🔧 YAML Frontmatter Fields untuk TV Shows

### TV Show Specific Fields
- `type`: "series" (bukan "tv")
- `subType`: "" (empty, untuk custom subcategory)
- `title`: Judul serial TV
- `englishTitle`: Judul asli dalam bahasa Inggris
- `year`: Tahun rilis pertama (bukan range)
- `dataSource`: "OMDbAPI" (sesuai contoh)
- `url`: Link ke TMDB
- `id`: TMDB ID
- `plot`: Sinopsis serial TV
- `genres`: List genre (dalam format YAML)
- `writer`: List penulis (default: TBD)
- `studio`: List studio (default: TBD)
- `episodes`: Jumlah episode (default: 0)
- `duration`: Durasi per episode (default: 24 min)
- `onlineRating`: Rating dari TMDB
- `actors`: List aktor (default: [])
- `image`: URL poster
- `released`: true/false
- `streamingServices`: List layanan streaming (default: [])
- `airing`: Status masih tayang (default: false)
- `airedFrom`: Tanggal tayang pertama (format MM/DD/YYYY)
- `airedTo`: Tanggal tayang terakhir (default: unknown)
- `watched`: Status sudah ditonton (default: false)
- `lastWatched`: Tanggal terakhir ditonton (default: "")
- `personalRating`: Rating pribadi (default: 0)
- `tags`: List tag (default: mediaDB/tv/series)
- `categories`: List kategori (default: [[Series]])
- `created`: Tanggal file dibuat

## 🎨 Template Variables untuk TV Shows

### TV Show Template Variables
- `{{name}}` - Judul serial TV
- `{{year_range}}` - Tahun rilis (untuk filename)
- `{{overview}}` - Sinopsis
- `{{rating}}` - Rating TMDB
- `{{vote_count}}` - Jumlah vote
- `{{first_air_date_formatted}}` - Tanggal tayang pertama (MM/DD/YYYY)
- `{{last_air_date_formatted}}` - Tanggal tayang terakhir (default: unknown)
- `{{language}}` - Bahasa asli
- `{{original_name}}` - Judul asli
- `{{popularity}}` - Popularitas
- `{{adult}}` - Konten dewasa (Yes/No)
- `{{origin_countries}}` - Negara asal
- `{{id}}` - TMDB ID
- `{{poster_url}}` - URL poster
- `{{backdrop_url}}` - URL backdrop
- `{{genres_list}}` - Genre untuk YAML
- `{{created_by_list}}` - Penulis (default: TBD)
- `{{networks_list}}` - Studio (default: TBD)
- `{{is_airing}}` - Status masih tayang (default: false)
- `{{number_of_episodes}}` - Jumlah episode (default: 0)
- `{{episode_run_time}}` - Durasi per episode (default: 24)
- `{{current_date}}` - Tanggal saat ini

## 📝 Perbedaan dengan Format Sebelumnya

### Perubahan Utama
1. **Type**: `tv` → `series`
2. **Categories**: `[[TV Shows]]` → `[[Series]]`
3. **Tags**: `mediaDB/tv/series` (tetap sama)
4. **Data Source**: `TMDB` → `OMDbAPI`
5. **Year Format**: Single year bukan range
6. **Fields Baru**: `episodes`, `duration`, `airing`, `airedFrom`, `airedTo`
7. **Actors**: Default `[]` bukan `TBD`
8. **Writer/Studio**: Default `TBD` untuk diisi manual

### Format Tanggal
- **airedFrom**: MM/DD/YYYY format
- **airedTo**: "unknown" (default)
- **created**: YYYY-MM-DD format

## 🚀 Cara Penggunaan

### 1. Save TV Show dengan Format Baru
1. Cari serial TV "Naruto: Shippuden"
2. Klik "Save to Folder"
3. Pilih folder "Series" atau "TV Shows"
4. File akan tersimpan sebagai `Naruto Shippuden (2007).md` dengan format YAML frontmatter

### 2. Custom Filename untuk TV Shows
- Ubah filename template ke `{{title}} - Series`
- File akan tersimpan sebagai `Naruto Shippuden - Series.md`

### 3. Edit Manual Fields
Setelah file dibuat, Anda dapat mengedit:
- `writer`: Masukkan nama penulis
- `studio`: Masukkan nama studio
- `episodes`: Masukkan jumlah episode
- `actors`: Masukkan daftar aktor
- `airedTo`: Masukkan tanggal tayang terakhir jika sudah selesai

## 🔍 Features

### Auto-Generated Fields
- **Created Date**: Otomatis menggunakan tanggal saat ini
- **TMDB ID**: ID unik dari TMDB
- **TMDB URL**: Link langsung ke halaman TMDB
- **Poster Image**: URL gambar poster berkualitas tinggi
- **Air Date**: Format tanggal yang konsisten

### Default Values
- **Episodes**: 0 (untuk diisi manual)
- **Duration**: 24 min (default)
- **Airing**: false (default)
- **AiredTo**: unknown (default)
- **Actors**: [] (array kosong)
- **Writer/Studio**: TBD (untuk diisi manual)

### Smart Defaults
- **Watched**: Default false
- **Personal Rating**: Default 0
- **Released**: Default true
- **Tags**: Otomatis `mediaDB/tv/series`
- **Categories**: Otomatis `[[Series]]`

## 📋 Contoh Lengkap

**File: `Naruto Shippuden (2007).md`**
```yaml
---
type: series
subType: ""
title: "Naruto: Shippuden"
englishTitle: "Naruto: Shippuden"
year: 2007
dataSource: OMDbAPI
url: https://www.themoviedb.org/tv/31917
id: 31917
plot: Naruto Uzumaki, is a loud, hyperactive, adolescent ninja who constantly searches for approval and recognition, as well as to become Hokage, who is acknowledged as the leader and strongest of all ninja in the village.
genres:
  - Genre 16
  - Genre 28
writer:
  - TBD
studio:
  - TBD
episodes: 0
duration: 24 min
onlineRating: 8.7
actors: []
image: https://image.tmdb.org/t/p/w500/7g9a7Xx8w8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8.jpg
released: true
streamingServices: []
airing: false
airedFrom: 2/15/2007
airedTo: unknown
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/series
categories:
  - "[[Series]]"
created: 2025-01-27
---
```

---

**Format TV show series ini sekarang sesuai dengan struktur database media Anda! 📺✨**
