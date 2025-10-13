# TMDB Plugin - Struktur Folder TMDB dengan Subfolder

## 🎯 Struktur Folder Baru: TMDB Subfolder Organization

Plugin TMDB sekarang menggunakan struktur folder yang lebih terorganisir dengan subfolder di dalam TMDB, termasuk dukungan untuk Anime.

### ✅ **Struktur Folder Baru:**

```
Vault/
└── TMDB/
    ├── Movies/
    │   ├── The Godfather 1972.md
    │   ├── Alien 1979.md
    │   └── Inception 2010.md
    ├── TV Shows/
    │   ├── Breaking Bad 2008.md
    │   ├── Game of Thrones 2011.md
    │   └── Stranger Things 2016.md
    └── Anime/
        ├── Spirited Away 2001.md
        ├── Attack on Titan 2013.md
        └── Demon Slayer 2019.md
```

## 🔧 **Settings Baru:**

### 1. **Default Folder Structure**
- **Movie Folder:** `TMDB/Movies`
- **TV Show Folder:** `TMDB/TV Shows`
- **Anime Folder:** `TMDB/Anime`

### 2. **Remember Last Used Folder**
- **Movies:** `lastUsedMovieFolder`
- **TV Shows:** `lastUsedTVFolder`
- **Anime:** `lastUsedAnimeFolder`

## 🎬 **Auto-Detection Anime:**

Plugin secara otomatis mendeteksi anime berdasarkan keywords:

### **Anime Keywords:**
- `anime`, `manga`, `otaku`
- `shounen`, `shoujo`, `seinen`, `josei`
- `studio ghibli`, `ghibli`
- `pokemon`, `dragon ball`, `naruto`
- `one piece`, `attack on titan`, `demon slayer`
- `my hero academia`, `death note`
- `fullmetal alchemist`, `spirited away`
- `totoro`, `princess mononoke`
- `howl's moving castle`, `kiki's delivery service`

### **Detection Logic:**
```typescript
private isAnime(item: TMDBMovie | TMDBTVShow): boolean {
    const title = 'title' in item ? item.title : item.name;
    const overview = item.overview || '';
    const combinedText = `${title} ${overview}`.toLowerCase();
    
    return animeKeywords.some(keyword => combinedText.includes(keyword));
}
```

## 🎯 **Content Type Detection:**

### **Movie Detection:**
- Jika `'title' in item` → Movie
- Jika bukan anime → `TMDB/Movies`
- Jika anime → `TMDB/Anime`

### **TV Show Detection:**
- Jika `'name' in item` → TV Show
- Jika bukan anime → `TMDB/TV Shows`
- Jika anime → `TMDB/Anime`

## 🎨 **Folder Selection Modal:**

### **Untuk Movies:**
```
┌─────────────────────────────────────┐
│ Select Save Location for Movie       │
├─────────────────────────────────────┤
│ Folder Path: [TMDB/Movies        ]  │
│                                     │
│ Quick Select:                       │
│ [TMDB/Movies] [TMDB/Action] [TMDB/Comedy] │
│ [TMDB/Drama] [TMDB/Horror] [TMDB/Sci-Fi] │
│ [TMDB/Entertainment] [TMDB/Watchlist]    │
│                                     │
│ [Save Here] [Cancel]                │
└─────────────────────────────────────┘
```

### **Untuk TV Shows:**
```
┌─────────────────────────────────────┐
│ Select Save Location for TV Show   │
├─────────────────────────────────────┤
│ Folder Path: [TMDB/TV Shows      ]  │
│                                     │
│ Quick Select:                       │
│ [TMDB/TV Shows] [TMDB/Series] [TMDB/Drama] │
│ [TMDB/Comedy] [TMDB/Action] [TMDB/Sci-Fi]  │
│ [TMDB/Entertainment] [TMDB/Watchlist]      │
│                                     │
│ [Save Here] [Cancel]                │
└─────────────────────────────────────┘
```

### **Untuk Anime:**
```
┌─────────────────────────────────────┐
│ Select Save Location for Anime     │
├─────────────────────────────────────┤
│ Folder Path: [TMDB/Anime          ]  │
│                                     │
│ Quick Select:                       │
│ [TMDB/Anime] [TMDB/Shounen] [TMDB/Shoujo] │
│ [TMDB/Seinen] [TMDB/Josei] [TMDB/Studio Ghibli] │
│ [TMDB/Entertainment] [TMDB/Watchlist]          │
│                                     │
│ [Save Here] [Cancel]                │
└─────────────────────────────────────┘
```

## 🚀 **Cara Penggunaan:**

### 1. **Setup Settings**
1. **Settings → Community plugins → TMDB Obsidian Plugin**
2. **Movie Folder:** `TMDB/Movies`
3. **TV Show Folder:** `TMDB/TV Shows`
4. **Anime Folder:** `TMDB/Anime`
5. **Remember Last Location:** ✅ (enabled)

### 2. **Save Movie**
1. Cari movie "The Godfather"
2. Klik "Save to Folder"
3. Modal: "Select Save Location for Movie"
4. Default: `TMDB/Movies`
5. File tersimpan: `TMDB/Movies/The Godfather 1972.md`

### 3. **Save TV Show**
1. Cari TV show "Breaking Bad"
2. Klik "Save to Folder"
3. Modal: "Select Save Location for TV Show"
4. Default: `TMDB/TV Shows`
5. File tersimpan: `TMDB/TV Shows/Breaking Bad 2008.md`

### 4. **Save Anime**
1. Cari anime "Spirited Away"
2. Plugin auto-detect sebagai anime
3. Modal: "Select Save Location for Anime"
4. Default: `TMDB/Anime`
5. File tersimpan: `TMDB/Anime/Spirited Away 2001.md`

## 📁 **Quick Select Options:**

### **Movies:**
- TMDB/Movies, TMDB/Action, TMDB/Comedy, TMDB/Drama
- TMDB/Horror, TMDB/Sci-Fi, TMDB/Entertainment, TMDB/Watchlist

### **TV Shows:**
- TMDB/TV Shows, TMDB/Series, TMDB/Drama, TMDB/Comedy
- TMDB/Action, TMDB/Sci-Fi, TMDB/Entertainment, TMDB/Watchlist

### **Anime:**
- TMDB/Anime, TMDB/Shounen, TMDB/Shoujo, TMDB/Seinen
- TMDB/Josei, TMDB/Studio Ghibli, TMDB/Entertainment, TMDB/Watchlist

## 🎯 **Benefits:**

### **Organization**
- ✅ **Structured:** Semua file TMDB dalam folder utama
- ✅ **Categorized:** Movies, TV Shows, dan Anime terpisah
- ✅ **Scalable:** Mudah menambah kategori baru
- ✅ **Consistent:** Format folder yang konsisten

### **User Experience**
- ✅ **Auto-Detection:** Anime terdeteksi otomatis
- ✅ **Smart Defaults:** Folder default yang sesuai
- ✅ **Quick Select:** Pilihan folder yang relevan
- ✅ **Remember:** Ingat folder terakhir per kategori

### **Developer Experience**
- ✅ **Maintainable:** Code yang terstruktur
- ✅ **Extensible:** Mudah menambah content type baru
- ✅ **Robust:** Error handling yang baik
- ✅ **Type Safe:** TypeScript dengan proper typing

## 🔍 **Technical Implementation:**

### **Content Type Detection:**
```typescript
private getContentTypeAndFolder(item: TMDBMovie | TMDBTVShow): { 
    type: 'movie' | 'tv' | 'anime', 
    folder: string 
} {
    const isMovie = 'title' in item;
    const isAnime = this.isAnime(item);
    
    if (isMovie) {
        return isAnime ? 
            { type: 'anime', folder: this.settings.animeFolder } :
            { type: 'movie', folder: this.settings.movieFolder };
    } else {
        return isAnime ? 
            { type: 'anime', folder: this.settings.animeFolder } :
            { type: 'tv', folder: this.settings.tvFolder };
    }
}
```

### **Folder Creation:**
```typescript
// Ensure folder exists
const folder = this.app.vault.getAbstractFileByPath(folderPath);

if (!folder) {
    if (this.settings.autoCreateFolder) {
        await this.app.vault.createFolder(folderPath);
        new Notice(`Created folder: ${folderPath}`);
    }
}
```

## 🎉 **Hasil Akhir:**

Plugin sekarang menggunakan struktur folder yang terorganisir:

- ✅ **TMDB/Movies** untuk movies
- ✅ **TMDB/TV Shows** untuk TV shows
- ✅ **TMDB/Anime** untuk anime (auto-detected)
- ✅ **Smart folder selection** berdasarkan content type
- ✅ **Quick select buttons** yang relevan
- ✅ **Remember last used folder** per kategori

---

**Plugin sekarang menggunakan struktur folder TMDB yang terorganisir dengan subfolder! 🎬📺🎌✨**
