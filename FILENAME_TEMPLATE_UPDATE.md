# TMDB Plugin - Filename Template Update

## 🎯 Perubahan Filename Template

Plugin TMDB telah diupdate untuk menghasilkan filename yang lebih sederhana dengan format yang diminta user.

### ✅ **Template Baru:**

**Default Template:** `{{title}} {{year}}`

**Contoh Output:**
- `Jack 2004.md`
- `The Godfather 1972.md`
- `Alien 1979.md`
- `Inception 2010.md`

### 🔧 **Perubahan yang Dilakukan:**

1. **Default Template Updated:**
   ```typescript
   fileNameTemplate: '{{title}} {{year}}'
   ```

2. **Settings Description Updated:**
   ```
   Template for generated file names. Use {{title}}, {{year}}, {{name}} for placeholders. 
   Example: "{{title}} {{year}}" will create "Jack 2004.md"
   ```

3. **Placeholder Updated:**
   ```
   {{title}} {{year}}
   ```

4. **Help Examples Updated:**
   - `{{title}} {{year}}` → "Jack 2004.md"
   - `{{title}} ({{year}})` → "Jack (2004).md"
   - `{{title}}` → "Jack.md"
   - `{{original_title}}` → "Jack.md"
   - `{{name}} - TV` → "Breaking Bad - TV.md"

## 📝 **Template Variables yang Tersedia:**

### Movie Variables
- `{{title}}` - Judul film (e.g., "Jack")
- `{{year}}` - Tahun rilis (e.g., "2004")
- `{{original_title}}` - Judul asli (e.g., "Jack")

### TV Show Variables
- `{{name}}` - Nama series (e.g., "Breaking Bad")
- `{{year}}` - Tahun pertama tayang (e.g., "2008")
- `{{year_range}}` - Range tahun (e.g., "2008-2013")
- `{{original_name}}` - Nama asli (e.g., "Breaking Bad")

## 🎬 **Contoh Penggunaan:**

### 1. **Template Sederhana**
```
{{title}} {{year}}
```
**Output:** `Jack 2004.md`

### 2. **Template dengan Tanda Kurung**
```
{{title}} ({{year}})
```
**Output:** `Jack (2004).md`

### 3. **Template Hanya Judul**
```
{{title}}
```
**Output:** `Jack.md`

### 4. **Template untuk TV Shows**
```
{{name}} - TV
```
**Output:** `Breaking Bad - TV.md`

### 5. **Template dengan Original Title**
```
{{original_title}}
```
**Output:** `Jack.md`

## 🔍 **Cara Mengubah Template:**

1. **Buka Settings:**
   - **Settings → Community plugins → TMDB Obsidian Plugin**

2. **Edit File Name Template:**
   - Scroll ke bagian "File Name Template"
   - Ubah template sesuai kebutuhan
   - Contoh: `{{title}} {{year}}` untuk format "Jack 2004.md"

3. **Save Settings:**
   - Template akan tersimpan otomatis
   - Akan digunakan untuk file baru

## 🎯 **Filename Generation Logic:**

### Movie Files
```typescript
if ('title' in item) {
    const movie = item as TMDBMovie;
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    fileName = fileName.replace(/\{\{title\}\}/g, movie.title);
    fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
    fileName = fileName.replace(/\{\{original_title\}\}/g, movie.original_title);
}
```

### TV Show Files
```typescript
else {
    const tvShow = item as TMDBTVShow;
    const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';
    fileName = fileName.replace(/\{\{title\}\}/g, tvShow.name);
    fileName = fileName.replace(/\{\{name\}\}/g, tvShow.name);
    fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
    fileName = fileName.replace(/\{\{year_range\}\}/g, year.toString());
    fileName = fileName.replace(/\{\{original_name\}\}/g, tvShow.original_name);
}
```

## 🛡️ **Filename Cleaning:**

Plugin secara otomatis membersihkan filename dari karakter yang tidak valid:

```typescript
fileName = fileName
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/[^\w\s\-\(\)\.]/g, '') // Keep only alphanumeric, spaces, hyphens, parentheses, dots
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .trim();
```

## 🎉 **Hasil Akhir:**

Sekarang plugin akan menghasilkan filename dengan format yang diminta:

- ✅ **Format:** `Jack 2004.md`
- ✅ **Tahun:** Selalu ada di filename
- ✅ **Sederhana:** Tanpa tanda kurung tambahan
- ✅ **Customizable:** Bisa diubah melalui settings
- ✅ **Clean:** Karakter invalid otomatis dihapus

---

**Filename sekarang menghasilkan format "Jack 2004.md" sesuai permintaan! 🎬✨**
