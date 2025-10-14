// Jikan API Types for Anime
export interface JikanAnime {
	mal_id: number;
	url: string;
	images: {
		jpg: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
		webp: {
			image_url: string;
			small_image_url: string;
			large_image_url: string;
		};
	};
	trailer: {
		youtube_id: string | null;
		url: string | null;
		embed_url: string | null;
		images: {
			image_url: string | null;
			small_image_url: string | null;
			medium_image_url: string | null;
			large_image_url: string | null;
			maximum_image_url: string | null;
		};
	};
	approved: boolean;
	titles: Array<{
		type: string;
		title: string;
	}>;
	title: string;
	title_english: string | null;
	title_japanese: string | null;
	title_synonyms: string[];
	type: string;
	source: string;
	episodes: number | null;
	status: string;
	airing: boolean;
	aired: {
		from: string | null;
		to: string | null;
		prop: {
			from: {
				day: number | null;
				month: number | null;
				year: number | null;
			};
			to: {
				day: number | null;
				month: number | null;
				year: number | null;
			};
		};
		string: string;
	};
	duration: string;
	rating: string;
	score: number | null;
	scored_by: number | null;
	rank: number | null;
	popularity: number | null;
	members: number | null;
	favorites: number | null;
	synopsis: string | null;
	background: string | null;
	season: string | null;
	year: number | null;
	broadcast: {
		day: string | null;
		time: string | null;
		timezone: string | null;
		string: string | null;
	};
	producers: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
	licensors: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
	studios: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
	genres: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
	explicit_genres: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
	themes: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
	demographics: Array<{
		mal_id: number;
		type: string;
		name: string;
		url: string;
	}>;
}

export interface JikanAnimeSearchResult {
	data: JikanAnime[];
	pagination: {
		last_visible_page: number;
		has_next_page: boolean;
		current_page: number;
		items: {
			count: number;
			total: number;
			per_page: number;
		};
	};
}

export interface JikanAnimeDetails extends JikanAnime {
	relations: Array<{
		relation: string;
		entry: Array<{
			mal_id: number;
			type: string;
			name: string;
			url: string;
		}>;
	}>;
	theme: {
		openings: string[];
		endings: string[];
	};
	external: Array<{
		name: string;
		url: string;
	}>;
	streaming: Array<{
		name: string;
		url: string;
	}>;
}

// Supported anime providers
export type AnimeProvider = 'jikan' | 'anilist' | 'kitsu';

export interface AnimeProviderConfig {
	name: string;
	baseUrl: string;
	apiKey?: string;
	enabled: boolean;
}
