// TMDB API Types
export interface TMDBMovie {
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

export interface TMDBTVShow {
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

export interface TMDBGenre {
	id: number;
	name: string;
}

export interface TMDBResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
	runtime: number;
	genres: TMDBGenre[];
	production_companies: Array<{
		id: number;
		name: string;
		logo_path: string | null;
		origin_country: string;
	}>;
	credits: {
		cast: Array<{
			id: number;
			name: string;
			character: string;
			order: number;
		}>;
		crew: Array<{
			id: number;
			name: string;
			job: string;
			department: string;
		}>;
	};
}

export interface TMDBTVShowDetails extends TMDBTVShow {
	number_of_episodes: number;
	episode_run_time: number[];
	status: string;
	last_air_date: string;
	created_by: Array<{
		id: number;
		name: string;
		gender: number;
		profile_path: string | null;
	}>;
	networks: Array<{
		id: number;
		name: string;
		logo_path: string | null;
		origin_country: string;
	}>;
	genres: TMDBGenre[];
	credits: {
		cast: Array<{
			id: number;
			name: string;
			character: string;
			order: number;
		}>;
		crew: Array<{
			id: number;
			name: string;
			job: string;
			department: string;
		}>;
	};
}
