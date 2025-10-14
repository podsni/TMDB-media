// Plugin Settings Interface
export interface TMDBPluginSettings {
	// API Configuration
	apiKey: string;
	language: string;
	
	// Provider Selection Configuration
	enabledProviders: {
		tmdb: boolean;
		jikan: boolean;
		anilist: boolean;
		kitsu: boolean;
	};
	defaultSearchProviders: {
		movies: boolean;
		tv: boolean;
		anime: boolean;
	};
	
	// Anime Provider Configuration
	animeProvider: 'jikan' | 'anilist' | 'kitsu';
	jikanConfig: {
		baseUrl: string;
		enabled: boolean;
	};
	anilistConfig: {
		baseUrl: string;
		enabled: boolean;
	};
	kitsuConfig: {
		baseUrl: string;
		enabled: boolean;
	};
	
	// Display Options
	includePoster: boolean;
	includeBackdrop: boolean;
	showPreview: boolean;
	
	// Templates
	movieTemplate: string;
	tvTemplate: string;
	animeTemplate: string;
	
	// Folder Management
	saveToFolder: boolean;
	defaultFolder: string;
	movieFolder: string;
	tvFolder: string;
	animeFolder: string;
	autoCreateFolder: boolean;
	fileNameTemplate: string;
	
	// Location Management
	askForLocation: boolean;
	rememberLastLocation: boolean;
	lastUsedMovieFolder: string;
	lastUsedTVFolder: string;
	lastUsedAnimeFolder: string;
}

export const DEFAULT_SETTINGS: TMDBPluginSettings = {
	// API Configuration
	apiKey: '',
	language: 'en-US',
	
	// Provider Selection Configuration
	enabledProviders: {
		tmdb: true,
		jikan: true,
		anilist: false,
		kitsu: false,
	},
	defaultSearchProviders: {
		movies: true,
		tv: true,
		anime: true,
	},
	
	// Anime Provider Configuration
	animeProvider: 'jikan',
	jikanConfig: {
		baseUrl: 'https://api.jikan.moe/v4',
		enabled: true,
	},
	anilistConfig: {
		baseUrl: 'https://graphql.anilist.co',
		enabled: false,
	},
	kitsuConfig: {
		baseUrl: 'https://kitsu.io/api/edge',
		enabled: false,
	},
	
	// Display Options
	includePoster: true,
	includeBackdrop: false,
	showPreview: true,
	
	// Templates
	movieTemplate: `---
type: movie
subType: 
title: {{title}}
englishTitle: {{original_title}}
year: {{year}}
dataSource: TMDB
url: https://www.themoviedb.org/movie/{{id}}
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
lastWatched: 
personalRating: 0
tags: 
  - tmdb/movie
categories:
  - "[[Movies]]"
created: {{current_date}}
---`,
	tvTemplate: `---
type: series
subType: 
title: {{name}}
englishTitle: {{original_name}}
year: {{year_range}}
dataSource: TMDB
url: https://www.themoviedb.org/tv/{{id}}
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
lastWatched: 
personalRating: 0
tags: 
  - tmdb/series
categories:
  - "[[Series]]"
created: {{current_date}}
---`,
	animeTemplate: `---
type: anime
subType: 
title: {{title}}
englishTitle: {{title_english}}
japaneseTitle: {{title_japanese}}
year: {{year}}
dataSource: {{provider}}
url: {{url}}
mal_id: {{mal_id}}
plot: {{synopsis}}
genres:
{{genres_list}}
studio:
{{studios_list}}
producers:
{{producers_list}}
episodes: {{episodes}}
duration: {{duration}}
rating: {{rating}}
score: {{score}}
scored_by: {{scored_by}}
members: {{members}}
favorites: {{favorites}}
image: {{image_url}}
released: true
streamingServices: []
airing: {{airing}}
airedFrom: {{aired_from}}
airedTo: {{aired_to}}
watched: false
lastWatched: 
personalRating: 0
tags: 
  - tmdb/anime
categories:
  - "[[Anime]]"
created: {{current_date}}
---`,
	
	// Folder Management
	saveToFolder: false,
	defaultFolder: 'TMDB',
	movieFolder: 'TMDB/Movies',
	tvFolder: 'TMDB/TV Shows',
	animeFolder: 'TMDB/Anime',
	autoCreateFolder: true,
	fileNameTemplate: '{{title}} {{year}}',
	
	// Location Management
	askForLocation: true,
	rememberLastLocation: true,
	lastUsedMovieFolder: 'TMDB/Movies',
	lastUsedTVFolder: 'TMDB/TV Shows',
	lastUsedAnimeFolder: 'TMDB/Anime',
};
