import { Notice, requestUrl } from 'obsidian';
import { 
	TMDBMovie, 
	TMDBTVShow, 
	TMDBGenre, 
	TMDBResponse, 
	TMDBMovieDetails, 
	TMDBTVShowDetails 
} from '../types/tmdb';
import { TMDBPluginSettings } from '../types/settings';

export class TMDBService {
	private settings: TMDBPluginSettings;

	constructor(settings: TMDBPluginSettings) {
		this.settings = settings;
	}

	async searchMovies(query: string): Promise<TMDBMovie[]> {
		if (!this.settings.apiKey) {
			new Notice('TMDB API key is required. Please set it in settings.');
			return [];
		}

        try {
            const response = await requestUrl({
                url: `https://api.themoviedb.org/3/search/movie?api_key=${this.settings.apiKey}&language=${this.settings.language}&query=${encodeURIComponent(query)}`,
                method: 'GET'
            });

            const data: TMDBResponse<TMDBMovie> = response.json as TMDBResponse<TMDBMovie>;
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
            const response = await requestUrl({
                url: `https://api.themoviedb.org/3/search/tv?api_key=${this.settings.apiKey}&language=${this.settings.language}&query=${encodeURIComponent(query)}`,
                method: 'GET'
            });

            const data: TMDBResponse<TMDBTVShow> = response.json as TMDBResponse<TMDBTVShow>;
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
            const response = await requestUrl({
                url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.settings.apiKey}&language=${this.settings.language}`,
                method: 'GET'
            });

            const data = response.json as { genres: TMDBGenre[] };
            return data.genres;
		} catch (error) {
			console.error('Error fetching genres:', error);
			return [];
		}
	}

	async getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
		if (!this.settings.apiKey) {
			return null;
		}

        try {
            const response = await requestUrl({
                url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.settings.apiKey}&language=${this.settings.language}&append_to_response=credits`,
                method: 'GET'
            });

            const data = response.json as TMDBMovieDetails;
            return data;
		} catch (error) {
			console.error('Error fetching movie details:', error);
			return null;
		}
	}

	async getTVShowDetails(tvId: number): Promise<TMDBTVShowDetails | null> {
		if (!this.settings.apiKey) {
			return null;
		}

        try {
            const response = await requestUrl({
                url: `https://api.themoviedb.org/3/tv/${tvId}?api_key=${this.settings.apiKey}&language=${this.settings.language}&append_to_response=credits`,
                method: 'GET'
            });

            const data = response.json as TMDBTVShowDetails;
            return data;
		} catch (error) {
			console.error('Error fetching TV show details:', error);
			return null;
		}
	}

	// Check if content is anime based on genres or keywords
	isAnime(item: TMDBMovie | TMDBTVShow): boolean {
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
}
