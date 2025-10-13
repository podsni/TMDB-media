# TMDB Plugin - Pure YAML Format Fix

## 🎯 Masalah yang Diperbaiki

Plugin sebelumnya masih menghasilkan format lama dengan markdown elements seperti:

```markdown
# Alien (1979)

![Poster](https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg)

**Rating:** 8.2/10 (15661 votes)
**Release Date:** 1979-05-25
**Language:** en
**Overview:** During its return to the earth...

## Details
- **Original Title:** Alien
- **Popularity:** 15.8
- **Adult Content:** No

## Genres
- Horror
- Science Fiction

---
*Data from [TMDB](https://www.themoviedb.org/movie/348)*
```

## ✅ Solusi yang Diterapkan

### 1. **Template Cleanup**
- Menghapus semua markdown elements dari template
- Memastikan hanya YAML frontmatter yang dihasilkan
- Auto-reset template jika masih mengandung markdown

### 2. **Markdown Removal Logic**
```typescript
// Remove any markdown elements that might be in old templates
template = template.replace(/!\[.*?\]\(.*?\)/g, '');
template = template.replace(/\*\*.*?\*\*/g, '');
template = template.replace(/##.*$/gm, '');
template = template.replace(/---\s*\*Data from.*$/gm, '');
```

### 3. **Settings Validation**
```typescript
// Ensure templates are using the correct YAML format
if (this.settings.movieTemplate.includes('**') || this.settings.movieTemplate.includes('![')) {
    this.settings.movieTemplate = DEFAULT_SETTINGS.movieTemplate;
    await this.saveSettings();
}
```

## 🎬 Format Output yang Benar

Sekarang plugin menghasilkan format yang persis sama dengan "The Godfather (1972).md":

```yaml
---
type: movie
subType: ""
title: Alien
englishTitle: Alien
year: "1979"
dataSource: OMDbAPI
url: https://www.imdb.com/title/348/
id: 348
plot: During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet. When a three-member team of the crew discovers a chamber containing thousands of eggs on the planet, a creature inside one of the eggs attacks an explorer. The entire crew is unaware of the impending nightmare set to descend upon them when the alien parasite planted inside its unfortunate host is birthed.
genres:
  - Horror
  - Science Fiction
director:
  - Ridley Scott
writer:
  - Dan O'Bannon
  - Ronald Shusett
studio:
  - Twentieth Century Fox
duration: 117 min
onlineRating: 8.2
actors:
  - Sigourney Weaver
  - Tom Skerritt
  - John Hurt
  - Veronica Cartwright
  - Harry Dean Stanton
image: https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg
released: true
streamingServices: []
premiere: 05/25/1979
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/movie
categories:
  - "[[Movies]]"
created: 2025-01-27
---
```

## 🔧 Perubahan Teknis

### 1. **formatMovieData Method**
- Menghapus conditional poster inclusion
- Selalu include poster URL dalam format YAML
- Menambahkan regex cleanup untuk markdown elements

### 2. **formatTVData Method**
- Sama seperti movie method
- Menghapus semua markdown elements
- Pure YAML output

### 3. **loadSettings Method**
- Auto-detection template lama
- Auto-reset ke template yang benar
- Validasi template saat load

## 🎯 Hasil Akhir

### ✅ **Yang Diperbaiki:**
- ❌ Tidak ada lagi markdown bold (`**text**`)
- ❌ Tidak ada lagi markdown images (`![alt](url)`)
- ❌ Tidak ada lagi markdown headers (`## Title`)
- ❌ Tidak ada lagi footer markdown (`*Data from...`)
- ✅ Pure YAML frontmatter only
- ✅ Compatible dengan Obsidian Properties panel
- ✅ Format persis sama dengan contoh

### 🎨 **Obsidian Integration:**
- **Properties Panel**: Semua fields muncul dengan benar
- **Tags**: `mediaDB/tv/movie` untuk movies
- **Categories**: `[[Movies]]` untuk movies
- **Search**: Searchable melalui Obsidian search
- **Graph View**: Categories muncul sebagai nodes

## 🚀 Cara Penggunaan

1. **Reload Plugin**: Restart Obsidian atau reload plugin
2. **Search Movie**: Cari "Alien" atau film lainnya
3. **Preview**: Klik "Preview" untuk melihat format YAML
4. **Save**: Klik "Save to Folder" untuk menyimpan

## 📋 Template Variables

### Movie Variables
- `{{title}}` - Judul film
- `{{year}}` - Tahun rilis
- `{{overview}}` - Plot/sinopsis
- `{{rating}}` - Rating TMDB
- `{{duration}}` - Durasi dalam menit
- `{{premiere_date}}` - Tanggal rilis (MM/DD/YYYY)
- `{{genres_list}}` - Genre dalam format YAML list
- `{{director_list}}` - Director dalam format YAML list
- `{{writer_list}}` - Writer dalam format YAML list
- `{{studio_list}}` - Studio dalam format YAML list
- `{{actors_list}}` - Top 5 actors dalam format YAML list
- `{{poster_url}}` - URL poster image
- `{{id}}` - TMDB ID
- `{{current_date}}` - Tanggal pembuatan file

## 🎉 Kesimpulan

Plugin sekarang menghasilkan format yang **persis sama** dengan file "The Godfather (1972).md" tanpa markdown elements apapun. Output adalah pure YAML frontmatter yang fully compatible dengan Obsidian!

---

**Format sekarang 100% pure YAML tanpa markdown! 🎬✨**
