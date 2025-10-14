import { TMDBMovie, TMDBTVShow, JikanAnime, TMDBMovieDetails, TMDBTVShowDetails, JikanAnimeDetails } from '../types';

export class TemplateFormatter {
	// Format movie data for insertion
	async formatMovieData(movie: TMDBMovie, movieDetails: TMDBMovieDetails | null, template: string): Promise<string> {
		let formattedTemplate = template;
		
		const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
		const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
		const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '';
		const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
		
		// Extract detailed information
		let genresList = '  - TBD';
		let genresMarkdown = 'Genres will be loaded separately';
		let directorList = '  - TBD';
		let writerList = '  - TBD';
		let studioList = '  - TBD';
		let actorsList = '  - TBD';
		let duration = 'TBD';
		let premiereDate = movie.release_date || 'N/A';
		
		if (movieDetails) {
			// Handle genres
			if (movieDetails.genres && movieDetails.genres.length > 0) {
				genresList = movieDetails.genres.map((genre: any) => `  - ${genre.name}`).join('\n');
				genresMarkdown = movieDetails.genres.map((genre: any) => `- ${genre.name}`).join('\n');
			}
			
			// Handle crew (directors, writers)
			if (movieDetails.credits && movieDetails.credits.crew) {
				const directors = movieDetails.credits.crew.filter((person: any) => person.job === 'Director');
				const writers = movieDetails.credits.crew.filter((person: any) => person.job === 'Writer' || person.job === 'Screenplay');
				
				if (directors.length > 0) {
					directorList = directors.map((director: any) => `  - ${director.name}`).join('\n');
				}
				
				if (writers.length > 0) {
					writerList = writers.map((writer: any) => `  - ${writer.name}`).join('\n');
				}
			}
			
			// Handle cast (actors)
			if (movieDetails.credits && movieDetails.credits.cast) {
				const topActors = movieDetails.credits.cast.slice(0, 5);
				if (topActors.length > 0) {
					actorsList = topActors.map((actor: any) => `  - ${actor.name}`).join('\n');
				}
			}
			
			// Handle production companies (studio)
			if (movieDetails.production_companies && movieDetails.production_companies.length > 0) {
				studioList = movieDetails.production_companies.map((company: any) => `  - ${company.name}`).join('\n');
			}
			
			// Handle duration
			if (movieDetails.runtime && movieDetails.runtime > 0) {
				duration = `${movieDetails.runtime} min`;
			}
			
			// Format premiere date (ISO YYYY-MM-DD)
			if (movieDetails.release_date) {
				const releaseDate = new Date(movieDetails.release_date);
				const yyyy = releaseDate.getFullYear();
				const mm = String(releaseDate.getMonth() + 1).padStart(2, '0');
				const dd = String(releaseDate.getDate()).padStart(2, '0');
				premiereDate = `${yyyy}-${mm}-${dd}`;
			}
		}
		
		// Replace placeholders
		formattedTemplate = formattedTemplate.replace(/\{\{title\}\}/g, movie.title);
		formattedTemplate = formattedTemplate.replace(/\{\{year\}\}/g, year.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{overview\}\}/g, movie.overview || 'No overview available');
		formattedTemplate = formattedTemplate.replace(/\{\{rating\}\}/g, movie.vote_average.toFixed(1));
		formattedTemplate = formattedTemplate.replace(/\{\{vote_count\}\}/g, movie.vote_count.toString());
		
		// Normalize release_date to ISO when possible
		if (movie.release_date) {
			const d = new Date(movie.release_date);
			const yyyy = d.getFullYear();
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			formattedTemplate = formattedTemplate.replace(/\{\{release_date\}\}/g, `${yyyy}-${mm}-${dd}`);
		} else {
			formattedTemplate = formattedTemplate.replace(/\{\{release_date\}\}/g, 'N/A');
		}
		
		formattedTemplate = formattedTemplate.replace(/\{\{language\}\}/g, movie.original_language);
		formattedTemplate = formattedTemplate.replace(/\{\{original_title\}\}/g, movie.original_title);
		formattedTemplate = formattedTemplate.replace(/\{\{popularity\}\}/g, movie.popularity.toFixed(1));
		formattedTemplate = formattedTemplate.replace(/\{\{adult\}\}/g, movie.adult ? 'Yes' : 'No');
		formattedTemplate = formattedTemplate.replace(/\{\{id\}\}/g, movie.id.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{current_date\}\}/g, currentDate);
		
		// Always include poster URL in YAML format
		formattedTemplate = formattedTemplate.replace(/\{\{poster_url\}\}/g, posterUrl);
		formattedTemplate = formattedTemplate.replace(/\{\{backdrop_url\}\}/g, backdropUrl);
		
		// Remove any markdown elements that might be in old templates
		formattedTemplate = formattedTemplate.replace(/!\[.*?\]\(.*?\)/g, '');
		formattedTemplate = formattedTemplate.replace(/\*\*.*?\*\*/g, '');
		formattedTemplate = formattedTemplate.replace(/##.*$/gm, '');
		formattedTemplate = formattedTemplate.replace(/---\s*\*Data from.*$/gm, '');
		
		// Replace detailed information
		formattedTemplate = formattedTemplate.replace(/\{\{genres_list\}\}/g, genresList);
		formattedTemplate = formattedTemplate.replace(/\{\{genres\}\}/g, genresMarkdown);
		formattedTemplate = formattedTemplate.replace(/\{\{director_list\}\}/g, directorList);
		formattedTemplate = formattedTemplate.replace(/\{\{writer_list\}\}/g, writerList);
		formattedTemplate = formattedTemplate.replace(/\{\{studio_list\}\}/g, studioList);
		formattedTemplate = formattedTemplate.replace(/\{\{actors_list\}\}/g, actorsList);
		formattedTemplate = formattedTemplate.replace(/\{\{duration\}\}/g, duration);
		formattedTemplate = formattedTemplate.replace(/\{\{premiere_date\}\}/g, premiereDate);
		
		// Clean up YAML formatting issues
		formattedTemplate = this.cleanYamlFormatting(formattedTemplate);
		
		return formattedTemplate;
	}

	// Format TV show data for insertion
	async formatTVData(tvShow: TMDBTVShow, tvDetails: TMDBTVShowDetails | null, template: string): Promise<string> {
		let formattedTemplate = template;
		
		const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';
		const posterUrl = tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : '';
		const backdropUrl = tvShow.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}` : '';
		const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
		
		// Year range (fallback single year)
		let yearRange = year.toString();
		
		// Dates ISO
		const firstAirISO = tvShow.first_air_date ? (() => { const d = new Date(tvShow.first_air_date); const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0'); return `${yyyy}-${mm}-${dd}`; })() : 'unknown';
		let lastAirISO = 'unknown';
		let isAiring = false;
		
		// Defaults
		let genresList = '  - TBD';
		let createdByList = '  - TBD';
		let networksList = '  - TBD';
		// actors list not used for TV formatting
		let numberOfEpisodes = 0;
		let episodeRunTime = 24;
		
		if (tvDetails) {
			// genres
			if (tvDetails.genres && tvDetails.genres.length > 0) {
				genresList = tvDetails.genres.map((g: any) => `  - ${g.name}`).join('\n');
			}
			// created_by -> writers
			if (tvDetails.created_by && tvDetails.created_by.length > 0) {
				createdByList = tvDetails.created_by.map((p: any) => `  - ${p.name}`).join('\n');
			}
			// networks -> studio
			if (tvDetails.networks && tvDetails.networks.length > 0) {
				networksList = tvDetails.networks.map((n: any) => `  - ${n.name}`).join('\n');
			}
			// cast not used in current TV template
			// episodes / runtime
			if (typeof tvDetails.number_of_episodes === 'number') {
				numberOfEpisodes = tvDetails.number_of_episodes;
			}
			if (Array.isArray(tvDetails.episode_run_time) && tvDetails.episode_run_time.length > 0) {
				episodeRunTime = tvDetails.episode_run_time[0];
			}
			// airing and dates
			if (tvDetails.status) {
				isAiring = tvDetails.status.toLowerCase() === 'returning series' || tvDetails.status.toLowerCase() === 'in production';
			}
			if (tvDetails.first_air_date) {
				const d = new Date(tvDetails.first_air_date); const yyyy = d.getFullYear();
				yearRange = tvDetails.last_air_date ? `${yyyy}-${new Date(tvDetails.last_air_date).getFullYear()}` : `${yyyy}-${isAiring ? 'present' : yyyy}`;
			}
			if (tvDetails.last_air_date) {
				const ld = new Date(tvDetails.last_air_date); const ly = ld.getFullYear(); const lm = String(ld.getMonth()+1).padStart(2,'0'); const ldD = String(ld.getDate()).padStart(2,'0');
				lastAirISO = `${ly}-${lm}-${ldD}`;
			}
		}
		
		// Replace placeholders
		formattedTemplate = formattedTemplate.replace(/\{\{name\}\}/g, tvShow.name);
		formattedTemplate = formattedTemplate.replace(/\{\{year_range\}\}/g, yearRange);
		formattedTemplate = formattedTemplate.replace(/\{\{overview\}\}/g, tvShow.overview || 'No overview available');
		formattedTemplate = formattedTemplate.replace(/\{\{rating\}\}/g, tvShow.vote_average.toFixed(1));
		formattedTemplate = formattedTemplate.replace(/\{\{vote_count\}\}/g, tvShow.vote_count.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{first_air_date_formatted\}\}/g, firstAirISO);
		formattedTemplate = formattedTemplate.replace(/\{\{last_air_date_formatted\}\}/g, lastAirISO);
		formattedTemplate = formattedTemplate.replace(/\{\{language\}\}/g, tvShow.original_language);
		formattedTemplate = formattedTemplate.replace(/\{\{original_name\}\}/g, tvShow.original_name);
		formattedTemplate = formattedTemplate.replace(/\{\{popularity\}\}/g, tvShow.popularity.toFixed(1));
		formattedTemplate = formattedTemplate.replace(/\{\{adult\}\}/g, tvShow.adult ? 'Yes' : 'No');
		formattedTemplate = formattedTemplate.replace(/\{\{origin_countries\}\}/g, tvShow.origin_country.join(', '));
		formattedTemplate = formattedTemplate.replace(/\{\{id\}\}/g, tvShow.id.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{current_date\}\}/g, currentDate);
		formattedTemplate = formattedTemplate.replace(/\{\{is_airing\}\}/g, isAiring.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{number_of_episodes\}\}/g, numberOfEpisodes.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{episode_run_time\}\}/g, episodeRunTime.toString());
		
		// Always include poster URL in YAML format and strip legacy markdown
		formattedTemplate = formattedTemplate.replace(/\{\{poster_url\}\}/g, posterUrl);
		formattedTemplate = formattedTemplate.replace(/\{\{backdrop_url\}\}/g, backdropUrl);
		formattedTemplate = formattedTemplate.replace(/!\[.*?\]\(.*?\)/g, '');
		formattedTemplate = formattedTemplate.replace(/\*\*.*?\*\*/g, '');
		formattedTemplate = formattedTemplate.replace(/##.*$/gm, '');
		formattedTemplate = formattedTemplate.replace(/---\s*\*Data from.*$/gm, '');
		
		// Apply lists
		formattedTemplate = formattedTemplate.replace(/\{\{genres_list\}\}/g, genresList);
		formattedTemplate = formattedTemplate.replace(/\{\{created_by_list\}\}/g, createdByList);
		formattedTemplate = formattedTemplate.replace(/\{\{networks_list\}\}/g, networksList);
		
		// Clean up YAML formatting issues
		formattedTemplate = this.cleanYamlFormatting(formattedTemplate);
		
		return formattedTemplate;
	}

	// Format anime data for insertion
	async formatAnimeData(anime: JikanAnime, animeDetails: JikanAnimeDetails | null, template: string, provider: string): Promise<string> {
		let formattedTemplate = template;
		
		const currentDate = new Date().toISOString().split('T')[0];
		const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || '';
		
		// Extract detailed information
		let genresList = '  - TBD';
		let studiosList = '  - TBD';
		let producersList = '  - TBD';
		
		if (animeDetails) {
			// Handle genres
			if (animeDetails.genres && animeDetails.genres.length > 0) {
				genresList = animeDetails.genres.map((genre: any) => `  - ${genre.name}`).join('\n');
			}
			
			// Handle studios
			if (animeDetails.studios && animeDetails.studios.length > 0) {
				studiosList = animeDetails.studios.map((studio: any) => `  - ${studio.name}`).join('\n');
			}
			
			// Handle producers
			if (animeDetails.producers && animeDetails.producers.length > 0) {
				producersList = animeDetails.producers.map((producer: any) => `  - ${producer.name}`).join('\n');
			}
		} else {
			// Use basic anime data
			if (anime.genres && anime.genres.length > 0) {
				genresList = anime.genres.map((genre: any) => `  - ${genre.name}`).join('\n');
			}
			
			if (anime.studios && anime.studios.length > 0) {
				studiosList = anime.studios.map((studio: any) => `  - ${studio.name}`).join('\n');
			}
			
			if (anime.producers && anime.producers.length > 0) {
				producersList = anime.producers.map((producer: any) => `  - ${producer.name}`).join('\n');
			}
		}
		
		// Format dates properly
		const airedFrom = anime.aired?.from ? new Date(anime.aired.from).toISOString().split('T')[0] : '';
		const airedTo = anime.aired?.to ? new Date(anime.aired.to).toISOString().split('T')[0] : '';
		
		// Clean and format values to avoid YAML issues
		const cleanTitle = this.cleanYamlValue(anime.title);
		const cleanEnglishTitle = this.cleanYamlValue(anime.title_english || anime.title);
		const cleanJapaneseTitle = this.cleanYamlValue(anime.title_japanese || anime.title);
		const cleanSynopsis = this.cleanYamlValue(anime.synopsis || 'No synopsis available');
		const cleanRating = anime.rating || '';
		const cleanDuration = anime.duration || '';
		
		// Replace placeholders with cleaned values
		formattedTemplate = formattedTemplate.replace(/\{\{title\}\}/g, cleanTitle);
		formattedTemplate = formattedTemplate.replace(/\{\{title_english\}\}/g, cleanEnglishTitle);
		formattedTemplate = formattedTemplate.replace(/\{\{title_japanese\}\}/g, cleanJapaneseTitle);
		formattedTemplate = formattedTemplate.replace(/\{\{year\}\}/g, anime.year?.toString() || '');
		formattedTemplate = formattedTemplate.replace(/\{\{synopsis\}\}/g, cleanSynopsis);
		formattedTemplate = formattedTemplate.replace(/\{\{rating\}\}/g, cleanRating);
		formattedTemplate = formattedTemplate.replace(/\{\{score\}\}/g, anime.score?.toString() || '');
		formattedTemplate = formattedTemplate.replace(/\{\{scored_by\}\}/g, anime.scored_by?.toString() || '');
		formattedTemplate = formattedTemplate.replace(/\{\{members\}\}/g, anime.members?.toString() || '');
		formattedTemplate = formattedTemplate.replace(/\{\{favorites\}\}/g, anime.favorites?.toString() || '');
		formattedTemplate = formattedTemplate.replace(/\{\{episodes\}\}/g, anime.episodes?.toString() || '');
		formattedTemplate = formattedTemplate.replace(/\{\{duration\}\}/g, cleanDuration);
		formattedTemplate = formattedTemplate.replace(/\{\{airing\}\}/g, anime.airing.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{aired_from\}\}/g, airedFrom);
		formattedTemplate = formattedTemplate.replace(/\{\{aired_to\}\}/g, airedTo);
		formattedTemplate = formattedTemplate.replace(/\{\{mal_id\}\}/g, anime.mal_id.toString());
		formattedTemplate = formattedTemplate.replace(/\{\{url\}\}/g, anime.url);
		formattedTemplate = formattedTemplate.replace(/\{\{provider\}\}/g, provider);
		formattedTemplate = formattedTemplate.replace(/\{\{current_date\}\}/g, currentDate);
		formattedTemplate = formattedTemplate.replace(/\{\{image_url\}\}/g, imageUrl);
		
		// Replace detailed information
		formattedTemplate = formattedTemplate.replace(/\{\{genres_list\}\}/g, genresList);
		formattedTemplate = formattedTemplate.replace(/\{\{studios_list\}\}/g, studiosList);
		formattedTemplate = formattedTemplate.replace(/\{\{producers_list\}\}/g, producersList);
		
		// Clean up YAML formatting issues
		formattedTemplate = this.cleanYamlFormatting(formattedTemplate);
		
		return formattedTemplate;
	}

	// Clean YAML values to prevent parsing issues
	private cleanYamlValue(value: string): string {
		if (!value) return '';
		
		// Remove or replace problematic characters
		return value
			.replace(/[\r\n]/g, ' ') // Replace newlines with spaces
			.replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
			.replace(/\s+/g, ' ') // Normalize whitespace
			.trim();
	}

	// Clean YAML formatting to ensure valid YAML
	private cleanYamlFormatting(yaml: string): string {
		// Remove empty values and clean up formatting
		let cleaned = yaml;
		
		// Keep essential fields even if empty, but clean up others
		cleaned = cleaned.replace(/^(subType|lastWatched):\s*$/gm, '$1: ');
		cleaned = cleaned.replace(/^(\w+):\s*N\/A$/gm, '');
		cleaned = cleaned.replace(/^(\w+):\s*unknown$/gm, '');
		
		// Keep essential arrays even if empty
		cleaned = cleaned.replace(/^(streamingServices):\s*\[\s*\]$/gm, '$1: []');
		cleaned = cleaned.replace(/^(actors):\s*\[\s*\]$/gm, '$1: []');
		
		// Only quote values that contain special characters or spaces
		cleaned = cleaned.replace(/^(title|englishTitle|japaneseTitle|plot|synopsis|duration|rating):\s*([^"\n].*)$/gm, (match, key, value) => {
			const cleanValue = this.cleanYamlValue(value);
			// Only quote if the value contains special characters, spaces, or starts with numbers
			if (cleanValue.includes(' ') || cleanValue.includes(':') || cleanValue.includes('-') || /^\d/.test(cleanValue) || cleanValue.includes('&') || cleanValue.includes('@')) {
				return `${key}: "${cleanValue}"`;
			}
			return `${key}: ${cleanValue}`;
		});
		
		// Ensure proper YAML structure for lists
		cleaned = cleaned.replace(/^(genres|studio|producers|director|writer|actors|tags|categories):\s*$/gm, '$1:');
		
		// Clean up multiple empty lines
		cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
		
		return cleaned;
	}
}
