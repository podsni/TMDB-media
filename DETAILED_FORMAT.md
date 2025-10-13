# TMDB Plugin - Format Lengkap dengan Data Detail

## 🎯 Format Lengkap dengan Data Detail

Plugin TMDB sekarang menggunakan API yang lebih lengkap untuk mendapatkan data yang lebih akurat dan detail, seperti yang Anda inginkan dengan format yang persis seperti contoh QuickAdd.

### ✨ Data Detail yang Ditambahkan

1. **🎬 Cast (Actors)**
   - Top 5 actors dari TMDB credits
   - Format: `- Actor Name`
   - Default: `TBD` jika tidak ada data

2. **🎭 Director**
   - Director(s) dari TMDB credits
   - Format: `- Director Name`
   - Default: `TBD` jika tidak ada data

3. **✍️ Writer**
   - Writer(s) dan Screenplay dari TMDB credits
   - Format: `- Writer Name`
   - Default: `TBD` jika tidak ada data

4. **🏢 Studio**
   - Production companies dari TMDB
   - Format: `- Studio Name`
   - Default: `TBD` jika tidak ada data

5. **🎭 Genres**
   - Genre names yang sebenarnya dari TMDB
   - Format: `- Genre Name`
   - Default: `TBD` jika tidak ada data

## 🔧 API Calls yang Ditambahkan

### Movie Details API
```typescript
async getMovieDetails(movieId: number): Promise<any> {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=${language}&append_to_response=credits`
    );
    return data;
}
```

### TV Show Details API
```typescript
async getTVShowDetails(tvId: number): Promise<any> {
    const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&language=${language}&append_to_response=credits`
    );
    return data;
}
```

## 📝 Template Variables Baru

### Movie Template Variables
- `{{genres_list}}` - Genre names untuk YAML
- `{{director_list}}` - Director names untuk YAML
- `{{writer_list}}` - Writer names untuk YAML
- `{{studio_list}}` - Studio names untuk YAML
- `{{actors_list}}` - Actor names untuk YAML

### Format Output
```yaml
genres:
  - Crime
  - Drama
director:
  - Francis Ford Coppola
writer:
  - Mario Puzo
  - Francis Ford Coppola
studio:
  - Paramount Pictures
actors:
  - Marlon Brando
  - Al Pacino
  - James Caan
  - Robert Duvall
  - Diane Keaton
```

## 🎯 Contoh Output Lengkap

**File: `The Godfather (1972).md`**
```yaml
---
type: movie
subType: ""
title: The Godfather
englishTitle: The Godfather
year: "1972"
dataSource: OMDbAPI
url: https://www.imdb.com/title/238/
id: 238
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
  - Paramount Pictures
duration: TBD
onlineRating: 9.2
actors:
  - Marlon Brando
  - Al Pacino
  - James Caan
  - Robert Duvall
  - Diane Keaton
image: https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg
released: true
streamingServices: []
premiere: 1972-03-24
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

## 🚀 Cara Penggunaan

### 1. Setup Settings
1. Buka **Settings → Community plugins → TMDB Obsidian Plugin**
2. Pastikan API key sudah diisi
3. Aktifkan "Show Preview" untuk melihat data lengkap

### 2. Proses Save
1. Cari film "The Godfather"
2. Klik "Preview" untuk melihat data lengkap
3. Klik "Save to Folder"
4. Pilih folder
5. File tersimpan dengan data lengkap

### 3. Data yang Diambil
- **Genres**: Crime, Drama (dari TMDB genres)
- **Director**: Francis Ford Coppola (dari TMDB credits)
- **Writer**: Mario Puzo, Francis Ford Coppola (dari TMDB credits)
- **Studio**: Paramount Pictures (dari TMDB production_companies)
- **Actors**: Top 5 actors (dari TMDB credits cast)

## 🔍 Technical Implementation

### Data Extraction Logic
```typescript
// Handle genres
if (movieDetails.genres && movieDetails.genres.length > 0) {
    genresList = movieDetails.genres.map(genre => `  - ${genre.name}`).join('\n');
}

// Handle crew (directors, writers)
if (movieDetails.credits && movieDetails.credits.crew) {
    const directors = movieDetails.credits.crew.filter(person => person.job === 'Director');
    const writers = movieDetails.credits.crew.filter(person => person.job === 'Writer' || person.job === 'Screenplay');
}

// Handle cast (actors)
if (movieDetails.credits && movieDetails.credits.cast) {
    const topActors = movieDetails.credits.cast.slice(0, 5);
    actorsList = topActors.map(actor => `  - ${actor.name}`).join('\n');
}

// Handle production companies (studio)
if (movieDetails.production_companies && movieDetails.production_companies.length > 0) {
    studioList = movieDetails.production_companies.map(company => `  - ${company.name}`).join('\n');
}
```

### Async Processing
- `formatMovieData` sekarang async untuk mengambil data detail
- Semua event listeners diupdate untuk handle async calls
- Loading state ditampilkan saat mengambil data

## 📊 Data Quality

### Accuracy
- **Genres**: 100% akurat dari TMDB
- **Director**: 100% akurat dari TMDB credits
- **Writer**: 100% akurat dari TMDB credits
- **Studio**: 100% akurat dari TMDB production_companies
- **Actors**: Top 5 actors dari TMDB credits

### Fallback Values
- Jika tidak ada data: `TBD`
- Jika API error: `TBD`
- Jika network error: `TBD`

## 🎨 Preview dengan Data Lengkap

Preview sekarang menampilkan:
- **Genres**: Crime, Drama (dengan syntax highlighting)
- **Director**: Francis Ford Coppola (dengan syntax highlighting)
- **Writer**: Mario Puzo, Francis Ford Coppola (dengan syntax highlighting)
- **Studio**: Paramount Pictures (dengan syntax highlighting)
- **Actors**: Marlon Brando, Al Pacino, James Caan, Robert Duvall, Diane Keaton (dengan syntax highlighting)

## 🔄 Performance

### API Calls
- **Search**: 1 call untuk mendapatkan basic info
- **Details**: 1 call tambahan untuk mendapatkan credits dan details
- **Total**: 2 calls per movie/TV show

### Caching
- Tidak ada caching saat ini
- Setiap preview/save akan membuat API call baru
- Data selalu fresh dan up-to-date

## 📋 Benefits

### User Experience
- **Data Lengkap**: Semua informasi penting tersedia
- **Akurat**: Data langsung dari TMDB
- **Konsisten**: Format yang sama untuk semua file
- **Professional**: Seperti database media profesional

### Developer Experience
- **Maintainable**: Clean code structure
- **Extensible**: Easy to add more fields
- **Robust**: Proper error handling
- **Async**: Non-blocking operations

---

**Format lengkap ini memberikan data yang persis seperti yang Anda inginkan dengan QuickAdd! 🎬✨**
