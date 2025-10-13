import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// TMDB API Types
interface TMDBMovie {
	id: number;
	title: string;
	overview: string;
	release_date: string;
	poster_path: string;
	backdrop_path: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	adult: boolean;
	original_language: string;
	original_title: string;
	popularity: number;
	video: boolean;
}

interface TMDBTVShow {
	id: number;
	name: string;
	overview: string;
	first_air_date: string;
	poster_path: string;
	backdrop_path: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	adult: boolean;
	original_language: string;
	original_name: string;
	popularity: number;
	origin_country: string[];
}

interface TMDBGenre {
	id: number;
	name: string;
}

interface TMDBResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

// Plugin Settings
interface TMDBPluginSettings {
	apiKey: string;
	language: string;
	includePoster: boolean;
	includeBackdrop: boolean;
	movieTemplate: string;
	tvTemplate: string;
	saveToFolder: boolean;
	defaultFolder: string;
	movieFolder: string;
	tvFolder: string;
	animeFolder: string;
	autoCreateFolder: boolean;
	fileNameTemplate: string;
	showPreview: boolean;
	askForLocation: boolean;
	rememberLastLocation: boolean;
	lastUsedMovieFolder: string;
	lastUsedTVFolder: string;
	lastUsedAnimeFolder: string;
}

const DEFAULT_SETTINGS: TMDBPluginSettings = {
	apiKey: '',
	language: 'en-US',
	includePoster: true,
	includeBackdrop: false,
	saveToFolder: false,
	defaultFolder: 'TMDB',
	movieFolder: 'TMDB/Movies',
	tvFolder: 'TMDB/TV Shows',
	animeFolder: 'TMDB/Anime',
	autoCreateFolder: true,
	fileNameTemplate: '{{title}} {{year}}',
	showPreview: true,
	askForLocation: true,
	rememberLastLocation: true,
	lastUsedMovieFolder: 'TMDB/Movies',
	lastUsedTVFolder: 'TMDB/TV Shows',
	lastUsedAnimeFolder: 'TMDB/Anime',
	movieTemplate: `---
type: movie
subType: ""
title: {{title}}
englishTitle: {{original_title}}
year: "{{year}}"
dataSource: OMDbAPI
url: https://www.imdb.com/title/{{id}}/
id: {{id}}
plot: {{overview}}
genres:
{{genres_list}}
director:
{{director_list}}
writer:
{{writer_list}}
studio:
{{studio_list}}
duration: {{duration}}
onlineRating: {{rating}}
actors:
{{actors_list}}
image: {{poster_url}}
released: true
streamingServices: []
premiere: {{premiere_date}}
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/movie
categories:
  - "[[Movies]]"
created: {{current_date}}
---`,
	tvTemplate: `---
type: series
subType: ""
title: "{{name}}"
englishTitle: "{{original_name}}"
year: {{year_range}}
dataSource: OMDbAPI
url: https://www.imdb.com/title/{{id}}/
id: {{id}}
plot: {{overview}}
genres:
{{genres_list}}
writer:
{{created_by_list}}
studio:
{{networks_list}}
episodes: {{number_of_episodes}}
duration: {{episode_run_time}} min
onlineRating: {{rating}}
actors: []
image: {{poster_url}}
released: true
streamingServices: []
airing: {{is_airing}}
airedFrom: {{first_air_date_formatted}}
airedTo: {{last_air_date_formatted}}
watched: false
lastWatched: ""
personalRating: 0
tags: 
  - mediaDB/tv/series
categories:
  - "[[Series]]"
created: {{current_date}}
---`,
}

export default class TMDBPlugin extends Plugin {
	settings: TMDBPluginSettings;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon
		const ribbonIconEl = this.addRibbonIcon('film', 'TMDB Plugin', (evt: MouseEvent) => {
			new TMDBModal(this.app, this).open();
		});
		ribbonIconEl.addClass('tmdb-plugin-ribbon-class');

		// Add commands
		this.addCommand({
			id: 'tmdb-search-movie',
			name: 'Search Movie',
			callback: () => {
				new TMDBModal(this.app, this, 'movie').open();
			}
		});

		this.addCommand({
			id: 'tmdb-search-tv',
			name: 'Search TV Show',
			callback: () => {
				new TMDBModal(this.app, this, 'tv').open();
			}
		});

		this.addCommand({
			id: 'tmdb-search-general',
			name: 'Search Movie/TV Show',
			callback: () => {
				new TMDBModal(this.app, this).open();
			}
		});

		// Add settings tab
		this.addSettingTab(new TMDBSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup if needed
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		
		// Ensure templates are using the correct YAML format
		if (this.settings.movieTemplate.includes('**') || this.settings.movieTemplate.includes('![')) {
			this.settings.movieTemplate = DEFAULT_SETTINGS.movieTemplate;
			await this.saveSettings();
		}
		
		if (this.settings.tvTemplate.includes('**') || this.settings.tvTemplate.includes('![')) {
			this.settings.tvTemplate = DEFAULT_SETTINGS.tvTemplate;
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// TMDB API Service
	async searchMovies(query: string): Promise<TMDBMovie[]> {
		if (!this.settings.apiKey) {
			new Notice('TMDB API key is required. Please set it in settings.');
			return [];
		}

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/search/movie?api_key=${this.settings.apiKey}&language=${this.settings.language}&query=${encodeURIComponent(query)}`
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: TMDBResponse<TMDBMovie> = await response.json();
			return data.results;
		} catch (error) {
			console.error('Error searching movies:', error);
			new Notice('Error searching movies. Check your API key and internet connection.');
			return [];
		}
	}

	async searchTVShows(query: string): Promise<TMDBTVShow[]> {
		if (!this.settings.apiKey) {
			new Notice('TMDB API key is required. Please set it in settings.');
			return [];
		}

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/search/tv?api_key=${this.settings.apiKey}&language=${this.settings.language}&query=${encodeURIComponent(query)}`
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: TMDBResponse<TMDBTVShow> = await response.json();
			return data.results;
		} catch (error) {
			console.error('Error searching TV shows:', error);
			new Notice('Error searching TV shows. Check your API key and internet connection.');
			return [];
		}
	}

	async getGenres(): Promise<TMDBGenre[]> {
		if (!this.settings.apiKey) {
			return [];
		}

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.settings.apiKey}&language=${this.settings.language}`
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data.genres;
		} catch (error) {
			console.error('Error fetching genres:', error);
			return [];
		}
	}

	// Get detailed movie information including cast and crew
	async getMovieDetails(movieId: number): Promise<any> {
		if (!this.settings.apiKey) {
			return null;
		}

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.settings.apiKey}&language=${this.settings.language}&append_to_response=credits`
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching movie details:', error);
			return null;
		}
	}

	// Get detailed TV show information including cast and crew
	async getTVShowDetails(tvId: number): Promise<any> {
		if (!this.settings.apiKey) {
			return null;
		}

		try {
			const response = await fetch(
				`https://api.themoviedb.org/3/tv/${tvId}?api_key=${this.settings.apiKey}&language=${this.settings.language}&append_to_response=credits`
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching TV show details:', error);
			return null;
		}
	}

	// Format movie data for insertion
	async formatMovieData(movie: TMDBMovie): Promise<string> {
		let template = this.settings.movieTemplate;
		
		// Get detailed movie information
		const movieDetails = await this.getMovieDetails(movie.id);
		
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
		template = template.replace(/\{\{title\}\}/g, movie.title);
		template = template.replace(/\{\{year\}\}/g, year.toString());
		template = template.replace(/\{\{overview\}\}/g, movie.overview || 'No overview available');
		template = template.replace(/\{\{rating\}\}/g, movie.vote_average.toFixed(1));
		template = template.replace(/\{\{vote_count\}\}/g, movie.vote_count.toString());
		// Normalize release_date to ISO when possible
		if (movie.release_date) {
			const d = new Date(movie.release_date);
			const yyyy = d.getFullYear();
			const mm = String(d.getMonth() + 1).padStart(2, '0');
			const dd = String(d.getDate()).padStart(2, '0');
			template = template.replace(/\{\{release_date\}\}/g, `${yyyy}-${mm}-${dd}`);
		} else {
			template = template.replace(/\{\{release_date\}\}/g, 'N/A');
		}
		template = template.replace(/\{\{language\}\}/g, movie.original_language);
		template = template.replace(/\{\{original_title\}\}/g, movie.original_title);
		template = template.replace(/\{\{popularity\}\}/g, movie.popularity.toFixed(1));
		template = template.replace(/\{\{adult\}\}/g, movie.adult ? 'Yes' : 'No');
		template = template.replace(/\{\{id\}\}/g, movie.id.toString());
		template = template.replace(/\{\{current_date\}\}/g, currentDate);
		
		// Always include poster URL in YAML format
		template = template.replace(/\{\{poster_url\}\}/g, posterUrl);
		
		// Remove any markdown elements that might be in old templates
		template = template.replace(/!\[.*?\]\(.*?\)/g, '');
		template = template.replace(/\*\*.*?\*\*/g, '');
		template = template.replace(/##.*$/gm, '');
		template = template.replace(/---\s*\*Data from.*$/gm, '');
		
		// Replace detailed information
		template = template.replace(/\{\{genres_list\}\}/g, genresList);
		template = template.replace(/\{\{genres\}\}/g, genresMarkdown);
		template = template.replace(/\{\{director_list\}\}/g, directorList);
		template = template.replace(/\{\{writer_list\}\}/g, writerList);
		template = template.replace(/\{\{studio_list\}\}/g, studioList);
		template = template.replace(/\{\{actors_list\}\}/g, actorsList);
		template = template.replace(/\{\{duration\}\}/g, duration);
		template = template.replace(/\{\{premiere_date\}\}/g, premiereDate);
		
		// Adjust tag based on anime detection
		const movieIsAnime = this.isAnime(movie);
		if (movieIsAnime) {
			template = template.replace(/\n\s*tags:\s*[\s\S]*?\n\s*categories:/, '\n' + 'tags:\n  - mediaDB/tv/anime\n' + 'categories:');
		} else {
			template = template.replace(/\n\s*tags:\s*[\s\S]*?\n\s*categories:/, '\n' + 'tags:\n  - mediaDB/tv/movie\n' + 'categories:');
		}

		// Ensure title and englishTitle are quoted (in case user template removed quotes)
		template = template.replace(/(^title:\s*)([^"\n].*)$/m, (m, p1, p2) => `${p1}"${p2.replace(/"/g, '\\"')}"`);
		template = template.replace(/(^englishTitle:\s*)([^"\n].*)$/m, (m, p1, p2) => `${p1}"${p2.replace(/"/g, '\\"')}"`);
		
		return template;
	}

	// Format TV show data for insertion
	async formatTVData(tvShow: TMDBTVShow): Promise<string> {
		let template = this.settings.tvTemplate;
		
		// Fetch detailed TV show information (including credits)
		const tvDetails = await this.getTVShowDetails(tvShow.id);
		
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
		let actorsList = '  - TBD';
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
			// cast
			if (tvDetails.credits && tvDetails.credits.cast) {
				const topActors = tvDetails.credits.cast.slice(0, 5);
				if (topActors.length > 0) {
					actorsList = topActors.map((a: any) => `  - ${a.name}`).join('\n');
				}
			}
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
				const d = new Date(tvDetails.first_air_date); const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0');
				yearRange = tvDetails.last_air_date ? `${yyyy}-${new Date(tvDetails.last_air_date).getFullYear()}` : `${yyyy}-${isAiring ? 'present' : yyyy}`;
			}
			if (tvDetails.last_air_date) {
				const ld = new Date(tvDetails.last_air_date); const ly = ld.getFullYear(); const lm = String(ld.getMonth()+1).padStart(2,'0'); const ldD = String(ld.getDate()).padStart(2,'0');
				lastAirISO = `${ly}-${lm}-${ldD}`;
			}
		}
		
		// Replace placeholders
		template = template.replace(/\{\{name\}\}/g, tvShow.name);
		template = template.replace(/\{\{year_range\}\}/g, yearRange);
		template = template.replace(/\{\{overview\}\}/g, tvShow.overview || 'No overview available');
		template = template.replace(/\{\{rating\}\}/g, tvShow.vote_average.toFixed(1));
		template = template.replace(/\{\{vote_count\}\}/g, tvShow.vote_count.toString());
		template = template.replace(/\{\{first_air_date_formatted\}\}/g, firstAirISO);
		template = template.replace(/\{\{last_air_date_formatted\}\}/g, lastAirISO);
		template = template.replace(/\{\{language\}\}/g, tvShow.original_language);
		template = template.replace(/\{\{original_name\}\}/g, tvShow.original_name);
		template = template.replace(/\{\{popularity\}\}/g, tvShow.popularity.toFixed(1));
		template = template.replace(/\{\{adult\}\}/g, tvShow.adult ? 'Yes' : 'No');
		template = template.replace(/\{\{origin_countries\}\}/g, tvShow.origin_country.join(', '));
		template = template.replace(/\{\{id\}\}/g, tvShow.id.toString());
		template = template.replace(/\{\{current_date\}\}/g, currentDate);
		template = template.replace(/\{\{is_airing\}\}/g, isAiring.toString());
		template = template.replace(/\{\{number_of_episodes\}\}/g, numberOfEpisodes.toString());
		template = template.replace(/\{\{episode_run_time\}\}/g, episodeRunTime.toString());
		
		// Always include poster URL in YAML format and strip legacy markdown
		template = template.replace(/\{\{poster_url\}\}/g, posterUrl);
		template = template.replace(/!\[.*?\]\(.*?\)/g, '');
		template = template.replace(/\*\*.*?\*\*/g, '');
		template = template.replace(/##.*$/gm, '');
		template = template.replace(/---\s*\*Data from.*$/gm, '');
		
		// Apply lists
		template = template.replace(/\{\{genres_list\}\}/g, genresList);
		template = template.replace(/\{\{created_by_list\}\}/g, createdByList);
		template = template.replace(/\{\{networks_list\}\}/g, networksList);
		
		// Adjust tag based on anime detection
		const tvIsAnime = this.isAnime(tvShow);
		if (tvIsAnime) {
			template = template.replace(/\n\s*tags:\s*[\s\S]*?\n\s*categories:/, '\n' + 'tags:\n  - mediaDB/tv/anime\n' + 'categories:');
		} else {
			template = template.replace(/\n\s*tags:\s*[\s\S]*?\n\s*categories:/, '\n' + 'tags:\n  - mediaDB/tv/series\n' + 'categories:');
		}

		// Ensure title and englishTitle are quoted (in case user template removed quotes)
		template = template.replace(/(^title:\s*)([^"\n].*)$/m, (m, p1, p2) => `${p1}\"${p2.replace(/\"/g, '\\"')}\"`);
		template = template.replace(/(^englishTitle:\s*)([^"\n].*)$/m, (m, p1, p2) => `${p1}\"${p2.replace(/\"/g, '\\"')}\"`);
		
		return template;
	}

	// Insert formatted data into editor
	insertIntoEditor(data: string) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const editor = activeView.editor;
			const cursor = editor.getCursor();
			editor.replaceRange(data, cursor);
			new Notice('TMDB data inserted successfully!');
		} else {
			new Notice('Please open a markdown file to insert TMDB data.');
		}
	}

	// Save formatted data to file
	async saveToFile(data: string, fileName: string, item: TMDBMovie | TMDBTVShow, customFolder?: string) {
		try {
			// Determine folder to use
			let folderPath: string;
			
			if (customFolder) {
				folderPath = customFolder;
			} else if (this.settings.askForLocation) {
				// Show folder selection modal with content type
				const contentType = this.getContentTypeAndFolder(item);
				const selectedFolder = await this.showFolderSelectionModal(contentType.type);
				if (!selectedFolder) {
					new Notice('No folder selected. Operation cancelled.');
					return;
				}
				folderPath = selectedFolder;
				
				// Remember last used folder if enabled
				if (this.settings.rememberLastLocation) {
					if (contentType.type === 'movie') {
						this.settings.lastUsedMovieFolder = folderPath;
					} else if (contentType.type === 'tv') {
						this.settings.lastUsedTVFolder = folderPath;
					} else if (contentType.type === 'anime') {
						this.settings.lastUsedAnimeFolder = folderPath;
					}
					await this.saveSettings();
				}
			} else {
				// Use appropriate default folder based on content type
				const contentType = this.getContentTypeAndFolder(item);
				folderPath = contentType.folder;
			}

			// Ensure folder exists (supports nested paths)
			if (this.settings.autoCreateFolder) {
				await this.ensureFolderPathExists(folderPath);
			} else {
				const folder = this.app.vault.getAbstractFileByPath(folderPath);
				if (!folder) {
					new Notice(`Folder ${folderPath} does not exist. Please create it first or enable auto-create folder.`);
					return;
				}
			}

			// Generate filename
			const baseFileName = this.generateFileName(fileName, item);
			let finalFileName = baseFileName;
			let filePath = `${folderPath}/${finalFileName}.md`;
			let counter = 1;

			// Check if file already exists and add number if needed
			while (this.app.vault.getAbstractFileByPath(filePath)) {
				finalFileName = `${baseFileName} (${counter})`;
				filePath = `${folderPath}/${finalFileName}.md`;
				counter++;
			}

			// Create file
			await this.app.vault.create(filePath, data);
			new Notice(`Saved: ${finalFileName}.md in ${folderPath}`);

			// Open the created file
			const file = this.app.vault.getAbstractFileByPath(filePath);
			if (file) {
				await this.app.workspace.getLeaf().openFile(file as any);
			}

		} catch (error) {
			console.error('Error saving file:', error);
			new Notice('Error saving file. Check console for details.');
		}
	}

	// Generate filename from template
	generateFileName(template: string, item: TMDBMovie | TMDBTVShow): string {
		let fileName = template;
		
		if ('title' in item) {
			// Movie
			const movie = item as TMDBMovie;
			const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
			fileName = fileName.replace(/\{\{title\}\}/g, movie.title);
			fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{original_title\}\}/g, movie.original_title);
		} else {
			// TV Show
			const tvShow = item as TMDBTVShow;
			const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';
			fileName = fileName.replace(/\{\{title\}\}/g, tvShow.name);
			fileName = fileName.replace(/\{\{name\}\}/g, tvShow.name);
			fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{year_range\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{original_name\}\}/g, tvShow.original_name);
		}

		// Clean filename for filesystem - more comprehensive cleaning
		fileName = fileName
			.replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
			.replace(/[^\w\s\-\(\)\.]/g, '') // Keep only alphanumeric, spaces, hyphens, parentheses, dots
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
			.trim();

		// If filename is empty or too short, use a fallback
		if (!fileName || fileName.length < 2) {
			const fallbackName = 'title' in item ? item.title : item.name;
			fileName = fallbackName.replace(/[<>:"/\\|?*]/g, '').trim();
		}

		return fileName;
	}

	// Show preview modal
	showPreview(data: string, item: TMDBMovie | TMDBTVShow) {
		new TMDBPreviewModal(this.app, this, data, item).open();
	}

	// Determine content type and appropriate folder
	private getContentTypeAndFolder(item: TMDBMovie | TMDBTVShow): { type: 'movie' | 'tv' | 'anime', folder: string } {
		const isMovie = 'title' in item;
		
		if (isMovie) {
			const movie = item as TMDBMovie;
			// Check if it's anime based on genres or keywords
			const isAnime = this.isAnime(movie);
			
			if (isAnime) {
				return {
					type: 'anime',
					folder: this.settings.rememberLastLocation ? this.settings.lastUsedAnimeFolder : this.settings.animeFolder
				};
			} else {
				return {
					type: 'movie',
					folder: this.settings.rememberLastLocation ? this.settings.lastUsedMovieFolder : this.settings.movieFolder
				};
			}
		} else {
			const tvShow = item as TMDBTVShow;
			// Check if it's anime based on genres or keywords
			const isAnime = this.isAnime(tvShow);
			
			if (isAnime) {
				return {
					type: 'anime',
					folder: this.settings.rememberLastLocation ? this.settings.lastUsedAnimeFolder : this.settings.animeFolder
				};
			} else {
				return {
					type: 'tv',
					folder: this.settings.rememberLastLocation ? this.settings.lastUsedTVFolder : this.settings.tvFolder
				};
			}
		}
	}

	// Check if content is anime based on genres or keywords
	private isAnime(item: TMDBMovie | TMDBTVShow): boolean {
		// Simple anime detection based on common anime keywords
		const title = 'title' in item ? item.title : item.name;
		const overview = item.overview || '';
		const combinedText = `${title} ${overview}`.toLowerCase();
		
		const animeKeywords = [
			'anime', 'manga', 'otaku', 'shounen', 'shoujo', 'seinen', 'josei',
			'studio ghibli', 'ghibli', 'pokemon', 'dragon ball', 'naruto',
			'one piece', 'attack on titan', 'demon slayer', 'my hero academia',
			'death note', 'fullmetal alchemist', 'spirited away', 'totoro',
			'princess mononoke', 'howl\'s moving castle', 'kiki\'s delivery service'
		];
		
		return animeKeywords.some(keyword => combinedText.includes(keyword));
	}

	// Show folder selection modal
	async showFolderSelectionModal(contentType: 'movie' | 'tv' | 'anime' = 'movie'): Promise<string | null> {
		return new Promise((resolve) => {
			new TMDBFolderSelectionModal(this.app, this, resolve, contentType).open();
		});
	}

	// Ensure a nested folder path exists (creates intermediate folders as needed)
	private async ensureFolderPathExists(folderPath: string): Promise<void> {
		const segments = folderPath.split('/').filter(Boolean);
		let currentPath = '';
		for (const segment of segments) {
			currentPath = currentPath ? `${currentPath}/${segment}` : segment;
			const exists = this.app.vault.getAbstractFileByPath(currentPath);
			if (!exists) {
				await this.app.vault.createFolder(currentPath);
			}
		}
	}

	// Sync movie/tv/anime folders to the current default base folder
	async syncSubfoldersToDefaultBase(): Promise<void> {
		const base = (this.settings.defaultFolder || 'TMDB').replace(/\/+$/, '');
		this.settings.movieFolder = `${base}/Movies`;
		this.settings.tvFolder = `${base}/TV Shows`;
		this.settings.animeFolder = `${base}/Anime`;
		if (this.settings.rememberLastLocation) {
			this.settings.lastUsedMovieFolder = this.settings.movieFolder;
			this.settings.lastUsedTVFolder = this.settings.tvFolder;
			this.settings.lastUsedAnimeFolder = this.settings.animeFolder;
		}
		await this.saveSettings();
	}
}

// TMDB Search Modal
class TMDBModal extends Modal {
	plugin: TMDBPlugin;
	searchType: 'movie' | 'tv' | 'both';
	searchResults: (TMDBMovie | TMDBTVShow)[] = [];

	constructor(app: App, plugin: TMDBPlugin, searchType: 'movie' | 'tv' | 'both' = 'both') {
		super(app);
		this.plugin = plugin;
		this.searchType = searchType;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.innerHTML = '';

		const h2 = document.createElement('h2');
		h2.textContent = 'TMDB Search';
		contentEl.appendChild(h2);

		// Search input
		const searchContainer = document.createElement('div');
		searchContainer.className = 'tmdb-search-container';
		contentEl.appendChild(searchContainer);
		
		const searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.placeholder = 'Search for movies or TV shows...';
		searchInput.className = 'tmdb-search-input';
		searchContainer.appendChild(searchInput);

		const searchButton = document.createElement('button');
		searchButton.textContent = 'Search';
		searchButton.className = 'tmdb-search-button';
		searchContainer.appendChild(searchButton);

		// Results container
		const resultsContainer = document.createElement('div');
		resultsContainer.className = 'tmdb-results-container';
		contentEl.appendChild(resultsContainer);

		// Search functionality
		const performSearch = async () => {
			const query = searchInput.value.trim();
			if (!query) {
				new Notice('Please enter a search query.');
				return;
			}

			resultsContainer.innerHTML = '';
			const searchingP = document.createElement('p');
			searchingP.textContent = 'Searching...';
			resultsContainer.appendChild(searchingP);

			let results: (TMDBMovie | TMDBTVShow)[] = [];

			if (this.searchType === 'movie' || this.searchType === 'both') {
				const movieResults = await this.plugin.searchMovies(query);
				results = results.concat(movieResults);
			}

			if (this.searchType === 'tv' || this.searchType === 'both') {
				const tvResults = await this.plugin.searchTVShows(query);
				results = results.concat(tvResults);
			}

			this.searchResults = results;
			this.displayResults(resultsContainer);
		};

		searchButton.addEventListener('click', performSearch);
		searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				performSearch();
			}
		});
	}

	displayResults(container: HTMLElement) {
		container.innerHTML = '';

		if (this.searchResults.length === 0) {
			const p = document.createElement('p');
			p.textContent = 'No results found.';
			container.appendChild(p);
			return;
		}

		const h3 = document.createElement('h3');
		h3.textContent = 'Search Results';
		container.appendChild(h3);

		this.searchResults.forEach((item, index) => {
			const resultItem = document.createElement('div');
			resultItem.className = 'tmdb-result-item';
			container.appendChild(resultItem);
			
			// Poster image
			const posterPath = 'poster_path' in item ? (item as TMDBMovie).poster_path : (item as TMDBTVShow).poster_path;
			if (posterPath) {
				const img = document.createElement('img');
				img.src = `https://image.tmdb.org/t/p/w200${posterPath}`;
				img.className = 'tmdb-poster';
				resultItem.appendChild(img);
			}

			// Content
			const content = document.createElement('div');
			content.className = 'tmdb-result-content';
			resultItem.appendChild(content);
			
			const title = 'title' in item ? item.title : item.name;
			const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
			const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
			
			const h4 = document.createElement('h4');
			h4.textContent = `${title} (${year})`;
			content.appendChild(h4);
			
			const overviewP = document.createElement('p');
			overviewP.textContent = item.overview || 'No overview available.';
			content.appendChild(overviewP);
			
			const ratingP = document.createElement('p');
			ratingP.textContent = `Rating: ${item.vote_average}/10 (${item.vote_count} votes)`;
			content.appendChild(ratingP);

			// Action buttons
			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'tmdb-button-container';
			content.appendChild(buttonContainer);

			// Preview button
			const previewButton = document.createElement('button');
			previewButton.textContent = 'Preview';
			previewButton.className = 'tmdb-preview-button';
			buttonContainer.appendChild(previewButton);

			// Insert button
			const insertButton = document.createElement('button');
			insertButton.textContent = 'Insert into Editor';
			insertButton.className = 'tmdb-insert-button';
			buttonContainer.appendChild(insertButton);

			// Save button
			const saveButton = document.createElement('button');
			saveButton.textContent = 'Save to Folder';
			saveButton.className = 'tmdb-save-button';
			buttonContainer.appendChild(saveButton);

			// Preview functionality
			previewButton.addEventListener('click', async () => {
				let formattedData: string;
				if ('title' in item) {
					formattedData = await this.plugin.formatMovieData(item as TMDBMovie);
				} else {
					formattedData = await this.plugin.formatTVData(item as TMDBTVShow);
				}
				
				this.plugin.showPreview(formattedData, item);
			});

			// Insert functionality
			insertButton.addEventListener('click', async () => {
				let formattedData: string;
				if ('title' in item) {
					formattedData = await this.plugin.formatMovieData(item as TMDBMovie);
				} else {
					formattedData = await this.plugin.formatTVData(item as TMDBTVShow);
				}
				
				this.plugin.insertIntoEditor(formattedData);
				this.close();
			});

			// Save functionality
			saveButton.addEventListener('click', async () => {
				let formattedData: string;
				let fileName: string;
				
				if ('title' in item) {
					formattedData = await this.plugin.formatMovieData(item as TMDBMovie);
					fileName = this.plugin.settings.fileNameTemplate;
				} else {
					formattedData = await this.plugin.formatTVData(item as TMDBTVShow);
					fileName = this.plugin.settings.fileNameTemplate;
				}
				
				await this.plugin.saveToFile(formattedData, fileName, item);
				this.close();
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.innerHTML = '';
	}
}

// TMDB Folder Selection Modal
class TMDBFolderSelectionModal extends Modal {
	plugin: TMDBPlugin;
	resolve: (value: string | null) => void;
	contentType: 'movie' | 'tv' | 'anime';

	constructor(app: App, plugin: TMDBPlugin, resolve: (value: string | null) => void, contentType: 'movie' | 'tv' | 'anime' = 'movie') {
		super(app);
		this.plugin = plugin;
		this.resolve = resolve;
		this.contentType = contentType;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.innerHTML = '';

		// Header
		const header = document.createElement('div');
		header.className = 'tmdb-folder-header';
		
		const title = document.createElement('h2');
		const contentTypeText = this.contentType === 'movie' ? 'Movie' : 
			this.contentType === 'tv' ? 'TV Show' : 'Anime';
		title.textContent = `Select Save Location for ${contentTypeText}`;
		header.appendChild(title);
		contentEl.appendChild(header);

		// Folder input
		const inputContainer = document.createElement('div');
		inputContainer.className = 'tmdb-folder-input-container';
		
		const label = document.createElement('label');
		label.textContent = 'Folder Path:';
		label.style.display = 'block';
		label.style.marginBottom = '8px';
		inputContainer.appendChild(label);

		const folderInput = document.createElement('input');
		folderInput.type = 'text';
		folderInput.placeholder = 'Enter folder path (e.g., TMDB/Movies, TMDB/TV Shows, TMDB/Anime)';
		const base = (this.plugin.settings.defaultFolder || 'TMDB').replace(/\/+$/, '');
		if (this.contentType === 'movie') {
			folderInput.value = this.plugin.settings.lastUsedMovieFolder || `${base}/Movies`;
		} else if (this.contentType === 'tv') {
			folderInput.value = this.plugin.settings.lastUsedTVFolder || `${base}/TV Shows`;
		} else {
			folderInput.value = this.plugin.settings.lastUsedAnimeFolder || `${base}/Anime`;
		}
		
		folderInput.className = 'tmdb-folder-input';
		inputContainer.appendChild(folderInput);

		contentEl.appendChild(inputContainer);

		// Quick folder buttons (prefix with current base)
		const quickFolders = document.createElement('div');
		quickFolders.className = 'tmdb-quick-folders';
		
		const quickLabel = document.createElement('p');
		quickLabel.textContent = 'Quick Select:';
		quickLabel.style.marginBottom = '8px';
		quickFolders.appendChild(quickLabel);

		const quickButtonsContainer = document.createElement('div');
		quickButtonsContainer.className = 'tmdb-quick-buttons';
		
		// Show different quick folders based on content type
		let quickFoldersList: string[] = [];
		if (this.contentType === 'movie') {
			quickFoldersList = [`${base}/Movies`, `${base}/Action`, `${base}/Comedy`, `${base}/Drama`, `${base}/Horror`, `${base}/Sci-Fi`, `${base}/Entertainment`, `${base}/Watchlist`];
		} else if (this.contentType === 'tv') {
			quickFoldersList = [`${base}/TV Shows`, `${base}/Series`, `${base}/Drama`, `${base}/Comedy`, `${base}/Action`, `${base}/Sci-Fi`, `${base}/Entertainment`, `${base}/Watchlist`];
		} else if (this.contentType === 'anime') {
			quickFoldersList = [`${base}/Anime`, `${base}/Shounen`, `${base}/Shoujo`, `${base}/Seinen`, `${base}/Josei`, `${base}/Studio Ghibli`, `${base}/Entertainment`, `${base}/Watchlist`];
		}
		
		quickFoldersList.forEach(folderName => {
			const button = document.createElement('button');
			button.textContent = folderName;
			button.className = 'tmdb-quick-folder-btn';
			button.addEventListener('click', () => {
				folderInput.value = folderName;
			});
			quickButtonsContainer.appendChild(button);
		});

		quickFolders.appendChild(quickButtonsContainer);
		contentEl.appendChild(quickFolders);

		// Action buttons
		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'tmdb-folder-buttons';
		
		// Save button
		const saveButton = document.createElement('button');
		saveButton.textContent = 'Save Here';
		saveButton.className = 'tmdb-save-button';
		buttonContainer.appendChild(saveButton);

		// Cancel button
		const cancelButton = document.createElement('button');
		cancelButton.textContent = 'Cancel';
		cancelButton.className = 'tmdb-close-button';
		buttonContainer.appendChild(cancelButton);

		contentEl.appendChild(buttonContainer);

		// Event listeners
		saveButton.addEventListener('click', () => {
			const folderPath = folderInput.value.trim();
			if (folderPath) {
				this.resolve(folderPath);
				this.close();
			} else {
				new Notice('Please enter a folder path.');
			}
		});

		cancelButton.addEventListener('click', () => {
			this.resolve(null);
			this.close();
		});

		// Enter key support
		folderInput.addEventListener('keypress', (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				saveButton.click();
			}
		});

		// Focus on input
		folderInput.focus();
		folderInput.select();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.innerHTML = '';
	}
}

// TMDB Preview Modal
class TMDBPreviewModal extends Modal {
	plugin: TMDBPlugin;
	data: string;
	item: TMDBMovie | TMDBTVShow;

	constructor(app: App, plugin: TMDBPlugin, data: string, item: TMDBMovie | TMDBTVShow) {
		super(app);
		this.plugin = plugin;
		this.data = data;
		this.item = item;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.innerHTML = '';

		// Header
		const header = document.createElement('div');
		header.className = 'tmdb-preview-header';
		
		const title = document.createElement('h2');
		const itemTitle = 'title' in this.item ? this.item.title : this.item.name;
		const itemYear = 'release_date' in this.item ? 
			(this.item.release_date ? new Date(this.item.release_date).getFullYear() : 'N/A') :
			(this.item.first_air_date ? new Date(this.item.first_air_date).getFullYear() : 'N/A');
		title.textContent = `Preview: ${itemTitle} (${itemYear})`;
		header.appendChild(title);
		contentEl.appendChild(header);

		// Preview content
		const previewContainer = document.createElement('div');
		previewContainer.className = 'tmdb-preview-container';
		
		// Create syntax highlighted YAML
		const highlightedYaml = this.highlightYAML(this.data);
		previewContainer.innerHTML = highlightedYaml;
		contentEl.appendChild(previewContainer);

		// Action buttons
		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'tmdb-preview-buttons';
		
		// Insert button
		const insertButton = document.createElement('button');
		insertButton.textContent = 'Insert into Editor';
		insertButton.className = 'tmdb-insert-button';
		buttonContainer.appendChild(insertButton);

		// Save button
		const saveButton = document.createElement('button');
		saveButton.textContent = 'Save to Folder';
		saveButton.className = 'tmdb-save-button';
		buttonContainer.appendChild(saveButton);

		// Close button
		const closeButton = document.createElement('button');
		closeButton.textContent = 'Close';
		closeButton.className = 'tmdb-close-button';
		buttonContainer.appendChild(closeButton);

		contentEl.appendChild(buttonContainer);

		// Event listeners
		insertButton.addEventListener('click', () => {
			this.plugin.insertIntoEditor(this.data);
			this.close();
		});

		saveButton.addEventListener('click', async () => {
			const fileName = this.plugin.settings.fileNameTemplate;
			await this.plugin.saveToFile(this.data, fileName, this.item);
			this.close();
		});

		closeButton.addEventListener('click', () => {
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.innerHTML = '';
	}

	// Highlight YAML syntax
	highlightYAML(yamlText: string): string {
		const lines = yamlText.split('\n');
		const highlightedLines = lines.map(line => {
			// Skip empty lines
			if (line.trim() === '') {
				return '<div class="yaml-line"></div>';
			}

			// Handle YAML frontmatter delimiters
			if (line.trim() === '---') {
				return '<div class="yaml-line yaml-delimiter">---</div>';
			}

			// Handle key-value pairs
			if (line.includes(':')) {
				const colonIndex = line.indexOf(':');
				const key = line.substring(0, colonIndex).trim();
				const value = line.substring(colonIndex + 1).trim();
				
				// Handle indented list items
				if (line.startsWith('  - ')) {
					const listItem = line.substring(4);
					return `<div class="yaml-line yaml-list-item">  - <span class="yaml-value">${this.escapeHtml(listItem)}</span></div>`;
				}
				
				// Handle regular key-value pairs
				if (key && value) {
					return `<div class="yaml-line"><span class="yaml-key">${this.escapeHtml(key)}</span>: <span class="yaml-value">${this.escapeHtml(value)}</span></div>`;
				} else if (key) {
					return `<div class="yaml-line"><span class="yaml-key">${this.escapeHtml(key)}</span>:</div>`;
				}
			}

			// Handle list items
			if (line.startsWith('- ')) {
				const listItem = line.substring(2);
				return `<div class="yaml-line yaml-list-item">- <span class="yaml-value">${this.escapeHtml(listItem)}</span></div>`;
			}

			// Default case
			return `<div class="yaml-line">${this.escapeHtml(line)}</div>`;
		});

		return `<div class="yaml-container">${highlightedLines.join('')}</div>`;
	}

	// Escape HTML characters
	escapeHtml(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}

// Settings Tab
class TMDBSettingTab extends PluginSettingTab {
	plugin: TMDBPlugin;

	constructor(app: App, plugin: TMDBPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.innerHTML = '';

		const h2 = document.createElement('h2');
		h2.textContent = 'TMDB Plugin Settings';
		containerEl.appendChild(h2);

		// API Key
		new Setting(containerEl)
			.setName('TMDB API Key')
			.setDesc('Get your API key from https://www.themoviedb.org/settings/api')
			.addText((text: any) => text
				.setPlaceholder('Enter your TMDB API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value: string) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));

		// Language
		new Setting(containerEl)
			.setName('Language')
			.setDesc('Language for TMDB data (e.g., en-US, id-ID)')
			.addText((text: any) => text
				.setPlaceholder('en-US')
				.setValue(this.plugin.settings.language)
				.onChange(async (value: string) => {
					this.plugin.settings.language = value;
					await this.plugin.saveSettings();
				}));

		// Include Poster
		new Setting(containerEl)
			.setName('Include Poster Images')
			.setDesc('Include poster images in the formatted output')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.includePoster)
				.onChange(async (value: boolean) => {
					this.plugin.settings.includePoster = value;
					await this.plugin.saveSettings();
				}));

		// Include Backdrop
		new Setting(containerEl)
			.setName('Include Backdrop Images')
			.setDesc('Include backdrop images in the formatted output')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.includeBackdrop)
				.onChange(async (value: boolean) => {
					this.plugin.settings.includeBackdrop = value;
					await this.plugin.saveSettings();
				}));

		// Movie Template
		new Setting(containerEl)
			.setName('Movie Template')
			.setDesc('Template for formatting movie data. Use {{variable}} for placeholders.')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter movie template...')
				.setValue(this.plugin.settings.movieTemplate)
				.onChange(async (value: string) => {
					this.plugin.settings.movieTemplate = value;
					await this.plugin.saveSettings();
				}));

		// TV Template
		new Setting(containerEl)
			.setName('TV Show Template')
			.setDesc('Template for formatting TV show data. Use {{variable}} for placeholders.')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter TV show template...')
				.setValue(this.plugin.settings.tvTemplate)
				.onChange(async (value: string) => {
					this.plugin.settings.tvTemplate = value;
					await this.plugin.saveSettings();
				}));

		// Save to Folder
		new Setting(containerEl)
			.setName('Save to Folder')
			.setDesc('Enable saving TMDB data to files instead of just inserting into editor')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.saveToFolder)
				.onChange(async (value: boolean) => {
					this.plugin.settings.saveToFolder = value;
					await this.plugin.saveSettings();
				}));

		// Default Folder
		new Setting(containerEl)
			.setName('Default Folder')
			.setDesc('Default base folder to save TMDB files (e.g., TMDB)')
			.addText((text: any) => text
				.setPlaceholder('TMDB')
				.setValue(this.plugin.settings.defaultFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.defaultFolder = value;
					await this.plugin.saveSettings();
				}));

		// Sync subfolders to default base
		new Setting(containerEl)
			.setName('Sync Subfolders with Default Folder')
			.setDesc('Update movie/TV/Anime folders to be inside the Default Folder')
			.addButton((btn: any) => btn
				.setButtonText('Sync Now')
				.onClick(async () => {
					await this.plugin.syncSubfoldersToDefaultBase();
					new Notice('Synced subfolders to Default Folder.');
				}));

		// Movie Folder
		new Setting(containerEl)
			.setName('Movie Folder')
			.setDesc('Default folder to save movie files (e.g., TMDB/Movies)')
			.addText((text: any) => text
				.setPlaceholder('TMDB/Movies')
				.setValue(this.plugin.settings.movieFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.movieFolder = value;
					await this.plugin.saveSettings();
				}));

		// TV Folder
		new Setting(containerEl)
			.setName('TV Show Folder')
			.setDesc('Default folder to save TV show files (e.g., TMDB/TV Shows)')
			.addText((text: any) => text
				.setPlaceholder('TMDB/TV Shows')
				.setValue(this.plugin.settings.tvFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.tvFolder = value;
					await this.plugin.saveSettings();
				}));

		// Anime Folder
		new Setting(containerEl)
			.setName('Anime Folder')
			.setDesc('Default folder to save anime files (e.g., TMDB/Anime)')
			.addText((text: any) => text
				.setPlaceholder('TMDB/Anime')
				.setValue(this.plugin.settings.animeFolder)
				.onChange(async (value: string) => {
					this.plugin.settings.animeFolder = value;
					await this.plugin.saveSettings();
				}));

		// Reset folder settings to defaults
		new Setting(containerEl)
			.setName('Reset Folder Settings')
			.setDesc('Reset Default/Movie/TV/Anime folders back to defaults')
			.addButton((btn: any) => btn
				.setButtonText('Reset to Defaults')
				.onClick(async () => {
					this.plugin.settings.defaultFolder = DEFAULT_SETTINGS.defaultFolder;
					this.plugin.settings.movieFolder = DEFAULT_SETTINGS.movieFolder;
					this.plugin.settings.tvFolder = DEFAULT_SETTINGS.tvFolder;
					this.plugin.settings.animeFolder = DEFAULT_SETTINGS.animeFolder;
					this.plugin.settings.lastUsedMovieFolder = DEFAULT_SETTINGS.lastUsedMovieFolder;
					this.plugin.settings.lastUsedTVFolder = DEFAULT_SETTINGS.lastUsedTVFolder;
					this.plugin.settings.lastUsedAnimeFolder = DEFAULT_SETTINGS.lastUsedAnimeFolder;
					await this.plugin.saveSettings();
					new Notice('Folder settings reset to defaults.');
				}));

		// Auto Create Folder
		new Setting(containerEl)
			.setName('Auto Create Folder')
			.setDesc('Automatically create the default folder if it does not exist')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.autoCreateFolder)
				.onChange(async (value: boolean) => {
					this.plugin.settings.autoCreateFolder = value;
					await this.plugin.saveSettings();
				}));

		// File Name Template
		new Setting(containerEl)
			.setName('File Name Template')
			.setDesc('Template for generated file names. Use {{title}}, {{year}}, {{name}} for placeholders. Example: "{{title}} {{year}}" will create "Jack 2004.md"')
			.addText((text: any) => text
				.setPlaceholder('{{title}} {{year}}')
				.setValue(this.plugin.settings.fileNameTemplate)
				.onChange(async (value: string) => {
					this.plugin.settings.fileNameTemplate = value;
					await this.plugin.saveSettings();
				}));

		// Show Preview
		new Setting(containerEl)
			.setName('Show Preview')
			.setDesc('Show preview modal before inserting or saving data')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.showPreview)
				.onChange(async (value: boolean) => {
					this.plugin.settings.showPreview = value;
					await this.plugin.saveSettings();
				}));

		// Ask for Location
		new Setting(containerEl)
			.setName('Ask for Save Location')
			.setDesc('Show folder selection dialog when saving files')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.askForLocation)
				.onChange(async (value: boolean) => {
					this.plugin.settings.askForLocation = value;
					await this.plugin.saveSettings();
				}));

		// Remember Last Location
		new Setting(containerEl)
			.setName('Remember Last Location')
			.setDesc('Remember the last used folder for future saves')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.rememberLastLocation)
				.onChange(async (value: boolean) => {
					this.plugin.settings.rememberLastLocation = value;
					await this.plugin.saveSettings();
				}));

		// Help section
		const h3 = document.createElement('h3');
		h3.textContent = 'Available Template Variables';
		containerEl.appendChild(h3);
		
		const helpContainer = document.createElement('div');
		helpContainer.className = 'tmdb-help-container';
		containerEl.appendChild(helpContainer);
		
		const movieVars = document.createElement('div');
		const movieVarsH4 = document.createElement('h4');
		movieVarsH4.textContent = 'Movie Variables:';
		movieVars.appendChild(movieVarsH4);
		
		const movieVarsUl = document.createElement('ul');
		movieVarsUl.textContent = '{{title}}, {{year}}, {{overview}}, {{rating}}, {{vote_count}}, {{release_date}}, {{language}}, {{original_title}}, {{popularity}}, {{adult}}, {{id}}, {{poster_url}}, {{backdrop_url}}, {{genres}}';
		movieVars.appendChild(movieVarsUl);
		helpContainer.appendChild(movieVars);
		
		const tvVars = document.createElement('div');
		const tvVarsH4 = document.createElement('h4');
		tvVarsH4.textContent = 'TV Show Variables:';
		tvVars.appendChild(tvVarsH4);
		
		const tvVarsUl = document.createElement('ul');
		tvVarsUl.textContent = '{{name}}, {{year}}, {{overview}}, {{rating}}, {{vote_count}}, {{first_air_date}}, {{language}}, {{original_name}}, {{popularity}}, {{adult}}, {{origin_countries}}, {{id}}, {{poster_url}}, {{backdrop_url}}, {{genres}}';
		tvVars.appendChild(tvVarsUl);
		helpContainer.appendChild(tvVars);

		// Filename examples
		const filenameExamples = document.createElement('div');
		const filenameH4 = document.createElement('h4');
		filenameH4.textContent = 'Filename Template Examples:';
		filenameExamples.appendChild(filenameH4);
		
		const filenameUl = document.createElement('ul');
		filenameUl.innerHTML = `
			<li><code>{{title}} {{year}}</code> → "Jack 2004.md"</li>
			<li><code>{{title}} ({{year}})</code> → "Jack (2004).md"</li>
			<li><code>{{title}}</code> → "Jack.md"</li>
			<li><code>{{original_title}}</code> → "Jack.md"</li>
			<li><code>{{name}} - TV</code> → "Breaking Bad - TV.md"</li>
		`;
		filenameExamples.appendChild(filenameUl);
		helpContainer.appendChild(filenameExamples);
	}
}