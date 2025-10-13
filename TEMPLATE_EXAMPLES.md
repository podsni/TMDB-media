# Template Examples untuk TMDB Plugin

## Movie Template - Minimal
```markdown
# {{title}} ({{year}})

**Rating:** {{rating}}/10
**Release Date:** {{release_date}}
**Overview:** {{overview}}

---
*Data from [TMDB](https://www.themoviedb.org/movie/{{id}})*
```

## Movie Template - Detailed
```markdown
# {{title}} ({{year}})

![Poster]({{poster_url}})

## Information
- **Rating:** {{rating}}/10 ({{vote_count}} votes)
- **Release Date:** {{release_date}}
- **Language:** {{language}}
- **Original Title:** {{original_title}}
- **Popularity:** {{popularity}}
- **Adult Content:** {{adult}}

## Synopsis
{{overview}}

## Links
- [TMDB Page](https://www.themoviedb.org/movie/{{id}})
- [IMDB](https://www.imdb.com/title/tt{{id}}/)

---
*Data from [The Movie Database](https://www.themoviedb.org/)*
```

## TV Show Template - Minimal
```markdown
# {{name}} ({{year}})

**Rating:** {{rating}}/10
**First Air Date:** {{first_air_date}}
**Overview:** {{overview}}

---
*Data from [TMDB](https://www.themoviedb.org/tv/{{id}})*
```

## TV Show Template - Detailed
```markdown
# {{name}} ({{year}})

![Poster]({{poster_url}})

## Information
- **Rating:** {{rating}}/10 ({{vote_count}} votes)
- **First Air Date:** {{first_air_date}}
- **Language:** {{language}}
- **Original Name:** {{original_name}}
- **Popularity:** {{popularity}}
- **Adult Content:** {{adult}}
- **Origin Countries:** {{origin_countries}}

## Synopsis
{{overview}}

## Links
- [TMDB Page](https://www.themoviedb.org/tv/{{id}})

---
*Data from [The Movie Database](https://www.themoviedb.org/)*
```

## Template dengan Backdrop
```markdown
# {{title}} ({{year}})

![Backdrop]({{backdrop_url}})

**Rating:** {{rating}}/10 | **Release Date:** {{release_date}}

{{overview}}

![Poster]({{poster_url}})

---
*Data from [TMDB](https://www.themoviedb.org/movie/{{id}})*
```

## Template untuk Review
```markdown
# {{title}} ({{year}}) - Review

![Poster]({{poster_url}})

## Basic Info
- **Director:** [To be filled]
- **Cast:** [To be filled]
- **Genre:** [To be filled]
- **Runtime:** [To be filled]
- **Rating:** {{rating}}/10 ({{vote_count}} votes)

## Synopsis
{{overview}}

## My Review
[Your review here]

## Rating
- **My Rating:** [Your rating]/10
- **TMDB Rating:** {{rating}}/10
- **Vote Count:** {{vote_count}}

## Notes
[Your notes here]

---
*Data from [TMDB](https://www.themoviedb.org/movie/{{id}})*
```

## Template untuk Watchlist
```markdown
# {{title}} ({{year}})

![Poster]({{poster_url}})

**Status:** [To Watch/Watching/Watched]
**Priority:** [High/Medium/Low]
**Rating:** {{rating}}/10

{{overview}}

## Notes
[Your notes here]

---
*Added from [TMDB](https://www.themoviedb.org/movie/{{id}})*
```

## Template untuk Collection
```markdown
# {{title}} ({{year}})

![Poster]({{poster_url}})

**Collection:** [Collection Name]
**Position:** [Position in collection]
**Rating:** {{rating}}/10

{{overview}}

## Collection Notes
[Notes about this movie in the collection]

---
*Part of [Collection Name] - Data from [TMDB](https://www.themoviedb.org/movie/{{id}})*
```

## Tips untuk Custom Template

1. **Gunakan variabel yang tersedia** - Semua variabel yang dimulai dengan `{{` dan diakhiri dengan `}}` akan diganti dengan data dari TMDB

2. **Tambahkan placeholder** - Untuk informasi yang tidak tersedia dari TMDB, gunakan placeholder seperti `[To be filled]` atau `[Your notes here]`

3. **Sesuaikan dengan kebutuhan** - Template bisa disesuaikan untuk berbagai keperluan seperti review, watchlist, collection, dll.

4. **Gunakan gambar dengan bijak** - Poster dan backdrop bisa mempercantik tampilan, tapi juga bisa memperlambat loading

5. **Tambahkan link** - Selalu sertakan link ke TMDB untuk referensi lebih lanjut

6. **Format yang konsisten** - Gunakan format yang konsisten untuk semua entri agar mudah dibaca
