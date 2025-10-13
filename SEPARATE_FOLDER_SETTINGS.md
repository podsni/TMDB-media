# TMDB Plugin - Separate Folder Settings untuk Movies dan TV Shows

## 🎯 Fitur Baru: Folder Terpisah untuk Movies dan TV Shows

Plugin TMDB sekarang mendukung pengaturan folder terpisah untuk movies dan TV shows, dengan kemampuan untuk mengatur location folder langsung di settings.

### ✅ **Fitur yang Ditambahkan:**

1. **Settings Terpisah untuk Movies dan TV Shows**
2. **Folder Selection Modal yang Smart**
3. **Remember Last Used Folder per Content Type**
4. **Quick Select Buttons yang Sesuai**

## 🔧 **Settings Baru:**

### 1. **Movie Folder**
- **Setting:** `Movie Folder`
- **Default:** `Movies`
- **Description:** Default folder untuk menyimpan file movies
- **Contoh:** `Movies`, `Action`, `Drama`, `Horror`

### 2. **TV Show Folder**
- **Setting:** `TV Show Folder`
- **Default:** `TV Shows`
- **Description:** Default folder untuk menyimpan file TV shows
- **Contoh:** `TV Shows`, `Series`, `Drama`, `Comedy`

### 3. **Remember Last Used Folder**
- **Movie:** `lastUsedMovieFolder` - Mengingat folder terakhir untuk movies
- **TV Show:** `lastUsedTVFolder` - Mengingat folder terakhir untuk TV shows

## 🎬 **Cara Kerja:**

### 1. **Auto Folder Selection**
```typescript
// Use appropriate default folder based on content type
const isMovie = 'title' in item;
if (isMovie) {
    folderPath = this.settings.rememberLastLocation ? 
        this.settings.lastUsedMovieFolder : 
        this.settings.movieFolder;
} else {
    folderPath = this.settings.rememberLastLocation ? 
        this.settings.lastUsedTVFolder : 
        this.settings.tvFolder;
}
```

### 2. **Smart Folder Selection Modal**
- **Title:** "Select Save Location for Movie" atau "Select Save Location for TV Show"
- **Default Value:** Folder yang sesuai dengan content type
- **Quick Select:** Buttons yang berbeda untuk movies dan TV shows

### 3. **Quick Select Buttons**

**Untuk Movies:**
- Movies, Action, Comedy, Drama, Horror, Sci-Fi, Entertainment, Watchlist

**Untuk TV Shows:**
- TV Shows, Series, Drama, Comedy, Action, Sci-Fi, Entertainment, Watchlist

## 🎯 **Contoh Penggunaan:**

### 1. **Settings Configuration**
```
Movie Folder: "Movies"
TV Show Folder: "TV Shows"
Remember Last Location: ✅ (enabled)
```

### 2. **Save Movie**
- **File:** "The Godfather 1972.md"
- **Folder:** "Movies" (atau folder terakhir yang digunakan untuk movies)
- **Path:** `Movies/The Godfather 1972.md`

### 3. **Save TV Show**
- **File:** "Breaking Bad 2008.md"
- **Folder:** "TV Shows" (atau folder terakhir yang digunakan untuk TV shows)
- **Path:** `TV Shows/Breaking Bad 2008.md`

## 🔍 **Settings Interface:**

### **Settings → Community plugins → TMDB Obsidian Plugin**

1. **Default Folder**
   - Folder umum untuk semua konten
   - Default: `TMDB`

2. **Movie Folder**
   - Folder khusus untuk movies
   - Default: `Movies`

3. **TV Show Folder**
   - Folder khusus untuk TV shows
   - Default: `TV Shows`

4. **Auto Create Folder**
   - Otomatis membuat folder jika belum ada
   - Default: ✅ (enabled)

5. **Ask for Save Location**
   - Tampilkan dialog pemilihan folder
   - Default: ✅ (enabled)

6. **Remember Last Location**
   - Ingat folder terakhir yang digunakan
   - Default: ✅ (enabled)

## 🎨 **Folder Selection Modal:**

### **Untuk Movies:**
```
┌─────────────────────────────────────┐
│ Select Save Location for Movie       │
├─────────────────────────────────────┤
│ Folder Path: [Movies            ]   │
│                                     │
│ Quick Select:                       │
│ [Movies] [Action] [Comedy] [Drama] │
│ [Horror] [Sci-Fi] [Entertainment]  │
│                                     │
│ [Save Here] [Cancel]                │
└─────────────────────────────────────┘
```

### **Untuk TV Shows:**
```
┌─────────────────────────────────────┐
│ Select Save Location for TV Show   │
├─────────────────────────────────────┤
│ Folder Path: [TV Shows          ]    │
│                                     │
│ Quick Select:                       │
│ [TV Shows] [Series] [Drama] [Comedy]│
│ [Action] [Sci-Fi] [Entertainment]  │
│                                     │
│ [Save Here] [Cancel]                │
└─────────────────────────────────────┘
```

## 🚀 **Workflow Lengkap:**

### 1. **Setup Settings**
1. Buka **Settings → Community plugins → TMDB Obsidian Plugin**
2. Set **Movie Folder** ke `Movies`
3. Set **TV Show Folder** ke `TV Shows`
4. Enable **Remember Last Location**

### 2. **Save Movie**
1. Cari movie "The Godfather"
2. Klik "Save to Folder"
3. Modal muncul: "Select Save Location for Movie"
4. Default folder: `Movies`
5. Quick select: Movies, Action, Comedy, Drama, Horror, Sci-Fi
6. Klik "Save Here"
7. File tersimpan di `Movies/The Godfather 1972.md`

### 3. **Save TV Show**
1. Cari TV show "Breaking Bad"
2. Klik "Save to Folder"
3. Modal muncul: "Select Save Location for TV Show"
4. Default folder: `TV Shows`
5. Quick select: TV Shows, Series, Drama, Comedy, Action, Sci-Fi
6. Klik "Save Here"
7. File tersimpan di `TV Shows/Breaking Bad 2008.md`

## 📁 **Folder Structure Example:**

```
Vault/
├── Movies/
│   ├── The Godfather 1972.md
│   ├── Alien 1979.md
│   └── Inception 2010.md
├── TV Shows/
│   ├── Breaking Bad 2008.md
│   ├── Game of Thrones 2011.md
│   └── Stranger Things 2016.md
└── TMDB/
    └── (fallback folder)
```

## 🎉 **Benefits:**

### **User Experience**
- ✅ **Organized:** Movies dan TV shows terpisah
- ✅ **Smart:** Auto-select folder yang sesuai
- ✅ **Flexible:** Bisa customize folder per content type
- ✅ **Convenient:** Remember last used folder

### **Developer Experience**
- ✅ **Maintainable:** Clean separation of concerns
- ✅ **Extensible:** Easy to add new content types
- ✅ **Robust:** Proper error handling
- ✅ **User-friendly:** Intuitive settings interface

---

**Plugin sekarang mendukung folder terpisah untuk movies dan TV shows dengan pengaturan yang mudah! 🎬📺✨**
