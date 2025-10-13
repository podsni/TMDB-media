# TMDB Plugin - Format YAML Frontmatter

## 🎯 Format Baru: YAML Frontmatter

Plugin TMDB sekarang menggunakan format YAML frontmatter yang sesuai dengan struktur database media Anda.

### ✨ Format File Output

File yang dibuat akan memiliki format seperti ini:

**Contoh untuk Film "Her (2013)":**
```yaml
---
type: movie
subType: ""
title: Her
englishTitle: Her
year: "2013"
dataSource: TMDB
url: https://www.themoviedb.org/movie/152601
id: 152601
plot: A lonely writer develops an unlikely relationship with an operating system designed to meet his every need.
genres:
  - Genre 18
  - Genre 878
director:
  - TBD
writer:
  - TBD
studio:
  - TBD
duration: TBD
onlineRating: 8.0
actors:
  - TBD
image: https://image.tmdb.org/t/p/w500/7g9a7Xx8w8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8.jpg
released: true
streamingServices: []
premiere: 2013-12-18
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/movie
categories:
  - "[[Movies]]"
created: 2025-01-27
---

# Her (2013)

![Poster](https://image.tmdb.org/t/p/w500/7g9a7Xx8w8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8.jpg)

**Rating:** 8.0/10 (1234 votes)
**Release Date:** 2013-12-18
**Language:** en
**Overview:** A lonely writer develops an unlikely relationship with an operating system designed to meet his every need.

## Details
- **Original Title:** Her
- **Popularity:** 45.2
- **Adult Content:** No

## Genres
- Genre 18
- Genre 878

---
*Data from [TMDB](https://www.themoviedb.org/movie/152601)*
```

**Contoh untuk TV Show "Breaking Bad":**
```yaml
---
type: tv
subType: ""
title: Breaking Bad
englishTitle: Breaking Bad
year: "2008"
dataSource: TMDB
url: https://www.themoviedb.org/tv/1396
id: 1396
plot: A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.
genres:
  - Genre 18
  - Genre 80
director:
  - TBD
writer:
  - TBD
studio:
  - TBD
duration: TBD
onlineRating: 8.9
actors:
  - TBD
image: https://image.tmdb.org/t/p/w500/7g9a7Xx8w8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8.jpg
released: true
streamingServices: []
premiere: 2008-01-20
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/series
categories:
  - "[[TV Shows]]"
created: 2025-01-27
---

# Breaking Bad (2008)

![Poster](https://image.tmdb.org/t/p/w500/7g9a7Xx8w8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8.jpg)

**Rating:** 8.9/10 (5678 votes)
**First Air Date:** 2008-01-20
**Language:** en
**Overview:** A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.

## Details
- **Original Name:** Breaking Bad
- **Popularity:** 78.5
- **Adult Content:** No
- **Origin Countries:** US

## Genres
- Genre 18
- Genre 80

---
*Data from [TMDB](https://www.themoviedb.org/tv/1396)*
```

## 📁 Naming Convention

### Default Filename Format
- **Template**: `{{title}} ({{year}})`
- **Contoh**: `Her (2013).md`, `Breaking Bad (2008).md`

### Custom Filename Options
- `{{title}}` → `Her.md`
- `{{title}} ({{year}})` → `Her (2013).md`
- `{{original_title}}` → `Her.md`
- `{{name}} - TV` → `Breaking Bad - TV.md`

## 🔧 YAML Frontmatter Fields

### Movie Fields
- `type`: "movie"
- `subType`: "" (empty, untuk custom subcategory)
- `title`: Judul film
- `englishTitle`: Judul asli dalam bahasa Inggris
- `year`: Tahun rilis (string format)
- `dataSource`: "TMDB"
- `url`: Link ke TMDB
- `id`: TMDB ID
- `plot`: Sinopsis film
- `genres`: List genre (dalam format YAML)
- `director`: List sutradara (default: TBD)
- `writer`: List penulis (default: TBD)
- `studio`: List studio (default: TBD)
- `duration`: Durasi (default: TBD)
- `onlineRating`: Rating dari TMDB
- `actors`: List aktor (default: TBD)
- `image`: URL poster
- `released`: true/false
- `streamingServices`: List layanan streaming (default: [])
- `premiere`: Tanggal rilis
- `watched`: Status sudah ditonton (default: false)
- `lastWatched`: Tanggal terakhir ditonton (default: "")
- `personalRating`: Rating pribadi (default: 0)
- `tags`: List tag (default: mediaDB/tv/movie)
- `categories`: List kategori (default: [[Movies]])
- `created`: Tanggal file dibuat

### TV Show Fields
- `type`: "tv"
- `subType`: "" (empty, untuk custom subcategory)
- `title`: Judul serial TV
- `englishTitle`: Judul asli dalam bahasa Inggris
- `year`: Tahun rilis pertama (string format)
- `dataSource`: "TMDB"
- `url`: Link ke TMDB
- `id`: TMDB ID
- `plot`: Sinopsis serial TV
- `genres`: List genre (dalam format YAML)
- `director`: List sutradara (default: TBD)
- `writer`: List penulis (default: TBD)
- `studio`: List studio (default: TBD)
- `duration`: Durasi (default: TBD)
- `onlineRating`: Rating dari TMDB
- `actors`: List aktor (default: TBD)
- `image`: URL poster
- `released`: true/false
- `streamingServices`: List layanan streaming (default: [])
- `premiere`: Tanggal tayang pertama
- `watched`: Status sudah ditonton (default: false)
- `lastWatched`: Tanggal terakhir ditonton (default: "")
- `personalRating`: Rating pribadi (default: 0)
- `tags`: List tag (default: mediaDB/tv/series)
- `categories`: List kategori (default: [[TV Shows]])
- `created`: Tanggal file dibuat

## 🎨 Template Customization

### Movie Template Variables
- `{{title}}` - Judul film
- `{{year}}` - Tahun rilis
- `{{overview}}` - Sinopsis
- `{{rating}}` - Rating TMDB
- `{{vote_count}}` - Jumlah vote
- `{{release_date}}` - Tanggal rilis
- `{{language}}` - Bahasa asli
- `{{original_title}}` - Judul asli
- `{{popularity}}` - Popularitas
- `{{adult}}` - Konten dewasa (Yes/No)
- `{{id}}` - TMDB ID
- `{{poster_url}}` - URL poster
- `{{backdrop_url}}` - URL backdrop
- `{{genres}}` - Genre untuk markdown
- `{{genres_list}}` - Genre untuk YAML
- `{{current_date}}` - Tanggal saat ini

### TV Show Template Variables
- `{{name}}` - Judul serial TV
- `{{year}}` - Tahun rilis pertama
- `{{overview}}` - Sinopsis
- `{{rating}}` - Rating TMDB
- `{{vote_count}}` - Jumlah vote
- `{{first_air_date}}` - Tanggal tayang pertama
- `{{language}}` - Bahasa asli
- `{{original_name}}` - Judul asli
- `{{popularity}}` - Popularitas
- `{{adult}}` - Konten dewasa (Yes/No)
- `{{origin_countries}}` - Negara asal
- `{{id}}` - TMDB ID
- `{{poster_url}}` - URL poster
- `{{backdrop_url}}` - URL backdrop
- `{{genres}}` - Genre untuk markdown
- `{{genres_list}}` - Genre untuk YAML
- `{{current_date}}` - Tanggal saat ini

## 📝 Usage Examples

### 1. Save Movie dengan Format Baru
1. Cari film "Her"
2. Klik "Save to Folder"
3. Pilih folder "Movies"
4. File akan tersimpan sebagai `Her (2013).md` dengan format YAML frontmatter

### 2. Save TV Show dengan Format Baru
1. Cari serial "Breaking Bad"
2. Klik "Save to Folder"
3. Pilih folder "TV Shows"
4. File akan tersimpan sebagai `Breaking Bad (2008).md` dengan format YAML frontmatter

### 3. Custom Filename
- Ubah filename template ke `{{original_title}} ({{year}})`
- File akan tersimpan sebagai `Her (2013).md`

## 🔍 Features

### Auto-Generated Fields
- **Created Date**: Otomatis menggunakan tanggal saat ini
- **TMDB ID**: ID unik dari TMDB
- **TMDB URL**: Link langsung ke halaman TMDB
- **Poster Image**: URL gambar poster berkualitas tinggi

### Placeholder Fields
- **Director, Writer, Studio**: Default "TBD" untuk diisi manual
- **Actors**: Default "TBD" untuk diisi manual
- **Duration**: Default "TBD" untuk diisi manual
- **Streaming Services**: Default array kosong

### Smart Defaults
- **Watched**: Default false
- **Personal Rating**: Default 0
- **Released**: Default true
- **Tags**: Otomatis sesuai tipe (movie/series)
- **Categories**: Otomatis sesuai tipe (Movies/TV Shows)

---

**Format YAML frontmatter ini memungkinkan integrasi yang lebih baik dengan sistem database media Anda! 🎬✨**
