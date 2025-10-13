# TMDB Plugin - Preview dengan Syntax Highlighting

## 🎯 Preview Modal dengan Syntax Highlighting

Plugin TMDB sekarang menampilkan preview dengan syntax highlighting yang indah untuk format YAML frontmatter, seperti yang terlihat di gambar preview modal.

### ✨ Fitur Preview Baru

1. **🎨 Syntax Highlighting**
   - Keys (kunci) ditampilkan dengan warna orange/kuning
   - Values (nilai) ditampilkan dengan warna putih
   - Delimiters (`---`) ditampilkan dengan warna abu-abu
   - List items ditampilkan dengan format yang jelas

2. **📱 Responsive Design**
   - Scrollable container untuk konten panjang
   - Dark theme compatibility
   - Light theme compatibility
   - Monospace font untuk readability

3. **🔍 Enhanced Readability**
   - Proper indentation
   - Clear visual separation
   - Easy-to-read formatting

## 🎨 Syntax Highlighting Colors

### Dark Theme
- **Keys**: Orange (#ffa500) dengan font weight 600
- **Values**: White (#ffffff)
- **List Items**: White (#ffffff)
- **Delimiters**: Gray (#808080) dengan font weight bold
- **Background**: Dark gray (#1e1e1e)

### Light Theme
- **Keys**: Red (#d73a49) dengan font weight 600
- **Values**: Dark gray (#24292e)
- **List Items**: Dark gray (#24292e)
- **Delimiters**: Medium gray (#6a737d) dengan font weight bold
- **Background**: Light gray (#f8f8f8)

## 📝 Contoh Preview Output

**Input YAML:**
```yaml
---
type: movie
subType: ""
title: The Godfather
englishTitle: The Godfather
year: "1972"
dataSource: OMDbAPI
url: https://www.imdb.com/title/tt0068646/
id: tt0068646
plot: The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.
genres:
  - Crime
  - Drama
director:
  - Francis Ford Coppola
writer:
  - Mario Puzo
  - Francis Ford Coppola
studio:
  - N/A
duration: 175 min
onlineRating: 9.2
actors:
  - Marlon Brando
  - Al Pacino
  - James Caan
image: https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_SX300.jpg
released: true
streamingServices: []
premiere: 03/24/1972
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/movie
categories:
  - "[[Movies]]"
---
```

**Preview dengan Syntax Highlighting:**
- `type` (orange) : `movie` (white)
- `subType` (orange) : `""` (white)
- `title` (orange) : `The Godfather` (white)
- `englishTitle` (orange) : `The Godfather` (white)
- `year` (orange) : `"1972"` (white)
- `dataSource` (orange) : `OMDbAPI` (white)
- `url` (orange) : `https://www.imdb.com/title/tt0068646/` (white)
- `id` (orange) : `tt0068646` (white)
- `plot` (orange) : `The aging patriarch...` (white)
- `genres` (orange) : (white)
- `  - Crime` (white)
- `  - Drama` (white)
- `director` (orange) : (white)
- `  - Francis Ford Coppola` (white)
- `writer` (orange) : (white)
- `  - Mario Puzo` (white)
- `  - Francis Ford Coppola` (white)
- `studio` (orange) : (white)
- `  - N/A` (white)
- `duration` (orange) : `175 min` (white)
- `onlineRating` (orange) : `9.2` (white)
- `actors` (orange) : (white)
- `  - Marlon Brando` (white)
- `  - Al Pacino` (white)
- `  - James Caan` (white)
- `image` (orange) : `https://m.media-amazon.com/...` (white)
- `released` (orange) : `true` (white)
- `streamingServices` (orange) : `[]` (white)
- `premiere` (orange) : `03/24/1972` (white)
- `watched` (orange) : `false` (white)
- `lastWatched` (orange) : `""` (white)
- `personalRating` (orange) : `0` (white)
- `tags` (orange) : (white)
- `  - mediaDB/tv/movie` (white)
- `categories` (orange) : (white)
- `  - "[[Movies]]"` (white)
- `---` (gray, bold)

## 🚀 Cara Menggunakan Preview

### 1. Aktifkan Preview
1. Buka **Settings → Community plugins → TMDB Obsidian Plugin**
2. Aktifkan **"Show Preview"**
3. Save settings

### 2. Gunakan Preview
1. Cari film/TV show menggunakan plugin
2. Klik **"Preview"** pada hasil pencarian
3. Modal preview akan muncul dengan syntax highlighting
4. Review data sebelum save atau insert

### 3. Actions dari Preview
- **Insert into Editor**: Insert data ke editor aktif
- **Save to Folder**: Save data ke file dengan folder selection
- **Close**: Tutup preview modal

## 🔧 Technical Implementation

### Syntax Highlighting Algorithm
1. **Parse YAML lines**: Split text by newlines
2. **Identify patterns**: 
   - Delimiters (`---`)
   - Key-value pairs (`key: value`)
   - List items (`- item` atau `  - item`)
3. **Apply highlighting**: Wrap elements dengan CSS classes
4. **Escape HTML**: Prevent XSS dengan proper escaping

### CSS Classes
- `.yaml-container`: Container untuk seluruh YAML
- `.yaml-line`: Individual line wrapper
- `.yaml-key`: Key highlighting (orange/red)
- `.yaml-value`: Value highlighting (white/dark)
- `.yaml-list-item`: List item highlighting
- `.yaml-delimiter`: Delimiter highlighting (gray)

### Theme Support
- **Dark Theme**: Dark background dengan bright colors
- **Light Theme**: Light background dengan dark colors
- **Automatic Detection**: Menggunakan Obsidian theme variables

## 📱 Responsive Features

### Scrollable Container
- Max height: 500px
- Vertical scroll untuk konten panjang
- Horizontal scroll untuk URL panjang

### Font & Spacing
- Monospace font untuk alignment
- Line height: 1.5 untuk readability
- Font size: 13px untuk balance

### Border & Padding
- Rounded corners (8px)
- Proper padding (20px)
- Border untuk visual separation

## 🎯 Benefits

### User Experience
- **Visual Clarity**: Easy to distinguish keys vs values
- **Professional Look**: Syntax highlighting seperti code editor
- **Theme Consistency**: Mengikuti Obsidian theme
- **Readability**: Monospace font untuk alignment

### Developer Experience
- **Maintainable Code**: Clean CSS structure
- **Extensible**: Easy to add new highlighting rules
- **Performance**: Lightweight implementation
- **Cross-platform**: Works di semua platform Obsidian

---

**Preview dengan syntax highlighting ini memberikan pengalaman yang lebih baik untuk review data sebelum save! 🎨✨**
