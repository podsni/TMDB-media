import { Notice } from 'obsidian';
import { TMDBService } from './TMDBService';
import { JikanService } from './JikanService';
import { 
	TMDBMovie, 
	TMDBTVShow, 
	JikanAnime, 
	MediaItem, 
	ContentType 
} from '../types';
import { TMDBPluginSettings } from '../types/settings';

export class MediaService {
	private tmdbService: TMDBService;
	private jikanService: JikanService;
	private settings: TMDBPluginSettings;

	constructor(settings: TMDBPluginSettings) {
		this.settings = settings;
		this.tmdbService = new TMDBService(settings);
		this.jikanService = new JikanService(settings);
	}

	// Update settings when they change
	updateSettings(newSettings: TMDBPluginSettings): void {
		this.settings = newSettings;
		this.tmdbService = new TMDBService(newSettings);
		this.jikanService = new JikanService(newSettings);
	}

	// Search movies using TMDB
	async searchMovies(query: string): Promise<TMDBMovie[]> {
		return this.tmdbService.searchMovies(query);
	}

	// Search TV shows using TMDB
	async searchTVShows(query: string): Promise<TMDBTVShow[]> {
		return this.tmdbService.searchTVShows(query);
	}

	// Search anime using selected provider
	async searchAnime(query: string): Promise<JikanAnime[]> {
		const provider = this.settings.animeProvider;
		const providerConfig = this.getProviderConfig(provider);
		
		if (!providerConfig.enabled) {
			new Notice(`Anime provider ${providerConfig.name} is disabled. Please enable it in settings.`);
			return [];
		}

		switch (provider) {
			case 'jikan':
				return this.jikanService.searchAnime(query);
			case 'anilist':
				// TODO: Implement AniList service
				new Notice('AniList provider not yet implemented. Using Jikan instead.');
				return this.jikanService.searchAnime(query);
			case 'kitsu':
				// TODO: Implement Kitsu service
				new Notice('Kitsu provider not yet implemented. Using Jikan instead.');
				return this.jikanService.searchAnime(query);
			default:
				new Notice(`Unknown anime provider: ${provider}. Using Jikan instead.`);
				return this.jikanService.searchAnime(query);
		}
	}

	// Get provider configuration
	private getProviderConfig(provider: string): { name: string; enabled: boolean; baseUrl: string } {
		switch (provider) {
			case 'jikan':
				return {
					name: 'Jikan',
					enabled: this.settings.jikanConfig.enabled,
					baseUrl: this.settings.jikanConfig.baseUrl
				};
			case 'anilist':
				return {
					name: 'AniList',
					enabled: this.settings.anilistConfig.enabled,
					baseUrl: this.settings.anilistConfig.baseUrl
				};
			case 'kitsu':
				return {
					name: 'Kitsu',
					enabled: this.settings.kitsuConfig.enabled,
					baseUrl: this.settings.kitsuConfig.baseUrl
				};
			default:
				return {
					name: 'Unknown',
					enabled: false,
					baseUrl: ''
				};
		}
	}

	// Validate provider configuration
	validateProviderConfiguration(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		
		// Check TMDB configuration
		if (!this.settings.apiKey) {
			errors.push('TMDB API key is required for movies and TV shows');
		}
		
		// Check anime provider configuration
		const animeProvider = this.settings.animeProvider;
		const providerConfig = this.getProviderConfig(animeProvider);
		
		if (!providerConfig.enabled) {
			errors.push(`Anime provider ${providerConfig.name} is disabled`);
		}
		
		if (!providerConfig.baseUrl) {
			errors.push(`Anime provider ${providerConfig.name} base URL is not configured`);
		}
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}

	// Search all content types
	async searchAll(query: string): Promise<MediaItem[]> {
		const results: MediaItem[] = [];
		
		// Search movies and TV shows
		const [movies, tvShows] = await Promise.all([
			this.searchMovies(query),
			this.searchTVShows(query)
		]);
		
		results.push(...movies, ...tvShows);
		
		// Search anime if enabled
		if (this.settings.jikanConfig.enabled) {
			const anime = await this.searchAnime(query);
			results.push(...anime);
		}
		
		return results;
	}

	// Get top anime
	async getTopAnime(): Promise<JikanAnime[]> {
		return this.jikanService.getTopAnime();
	}

	// Get current season anime
	async getCurrentSeasonAnime(): Promise<JikanAnime[]> {
		return this.jikanService.getCurrentSeasonAnime();
	}

	// Determine content type for an item
	getContentType(item: MediaItem): ContentType {
		if ('mal_id' in item) {
			return 'anime';
		} else if ('title' in item) {
			return 'movie';
		} else {
			return 'tv';
		}
	}

	// Check if TMDB content is anime
	isAnime(item: TMDBMovie | TMDBTVShow): boolean {
		return this.tmdbService.isAnime(item);
	}

	// Get appropriate folder for content type
	getFolderForContentType(item: MediaItem): string {
		const contentType = this.getContentType(item);
		
		if (contentType === 'anime') {
			return this.settings.rememberLastLocation 
				? this.settings.lastUsedAnimeFolder 
				: this.settings.animeFolder;
		} else if (contentType === 'movie') {
			const movie = item as TMDBMovie;
			if (this.isAnime(movie)) {
				return this.settings.rememberLastLocation 
					? this.settings.lastUsedAnimeFolder 
					: this.settings.animeFolder;
			} else {
				return this.settings.rememberLastLocation 
					? this.settings.lastUsedMovieFolder 
					: this.settings.movieFolder;
			}
		} else {
			const tvShow = item as TMDBTVShow;
			if (this.isAnime(tvShow)) {
				return this.settings.rememberLastLocation 
					? this.settings.lastUsedAnimeFolder 
					: this.settings.animeFolder;
			} else {
				return this.settings.rememberLastLocation 
					? this.settings.lastUsedTVFolder 
					: this.settings.tvFolder;
			}
		}
	}

	// Get movie details
	async getMovieDetails(movieId: number): Promise<any> {
		return this.tmdbService.getMovieDetails(movieId);
	}

	// Get TV show details
	async getTVShowDetails(tvId: number): Promise<any> {
		return this.tmdbService.getTVShowDetails(tvId);
	}

	// Get anime details
	async getAnimeDetails(animeId: number): Promise<any> {
		return this.jikanService.getAnimeDetails(animeId);
	}
}
