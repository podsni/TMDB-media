import { Notice, requestUrl } from 'obsidian';
import { 
    JikanAnime, 
    JikanAnimeSearchResult, 
    JikanAnimeDetails
} from '../types/jikan';
import { TMDBPluginSettings } from '../types/settings';

export class JikanService {
	private settings: TMDBPluginSettings;

	constructor(settings: TMDBPluginSettings) {
		this.settings = settings;
	}

	async searchAnime(query: string): Promise<JikanAnime[]> {
		if (!this.settings.jikanConfig.enabled) {
			new Notice('Jikan API is disabled. Please enable it in settings.');
			return [];
		}

        try {
            const response = await requestUrl({
                url: `${this.settings.jikanConfig.baseUrl}/anime?q=${encodeURIComponent(query)}&limit=20`,
                method: 'GET'
            });

            const data = response.json as JikanAnimeSearchResult;
            return data.data;
		} catch (error) {
			console.error('Error searching anime:', error);
			new Notice('Error searching anime. Check your internet connection.');
			return [];
		}
	}

	async getAnimeDetails(animeId: number): Promise<JikanAnimeDetails | null> {
		if (!this.settings.jikanConfig.enabled) {
			return null;
		}

        try {
            const response = await requestUrl({
                url: `${this.settings.jikanConfig.baseUrl}/anime/${animeId}/full`,
                method: 'GET'
            });

            const data = response.json as { data: JikanAnimeDetails };
            return data.data;
		} catch (error) {
			console.error('Error fetching anime details:', error);
			return null;
		}
	}

	async getTopAnime(type: 'airing' | 'upcoming' | 'bypopularity' | 'favorite' = 'bypopularity'): Promise<JikanAnime[]> {
		if (!this.settings.jikanConfig.enabled) {
			return [];
		}

        try {
            const response = await requestUrl({
                url: `${this.settings.jikanConfig.baseUrl}/top/anime?type=${type}&limit=20`,
                method: 'GET'
            });

            const data = response.json as JikanAnimeSearchResult;
            return data.data;
		} catch (error) {
			console.error('Error fetching top anime:', error);
			return [];
		}
	}

	async getSeasonalAnime(year: number, season: 'winter' | 'spring' | 'summer' | 'fall'): Promise<JikanAnime[]> {
		if (!this.settings.jikanConfig.enabled) {
			return [];
		}

        try {
            const response = await requestUrl({
                url: `${this.settings.jikanConfig.baseUrl}/seasons/${year}/${season}?limit=20`,
                method: 'GET'
            });

            const data = response.json as JikanAnimeSearchResult;
            return data.data;
		} catch (error) {
			console.error('Error fetching seasonal anime:', error);
			return [];
		}
	}

	// Get current season anime
	async getCurrentSeasonAnime(): Promise<JikanAnime[]> {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1; // 0-based to 1-based
		
		let season: 'winter' | 'spring' | 'summer' | 'fall';
		if (month >= 12 || month <= 2) {
			season = 'winter';
		} else if (month >= 3 && month <= 5) {
			season = 'spring';
		} else if (month >= 6 && month <= 8) {
			season = 'summer';
		} else {
			season = 'fall';
		}

		return this.getSeasonalAnime(year, season);
	}
}
