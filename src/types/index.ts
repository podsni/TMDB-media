// Export all types from a single file
export * from './tmdb';
export * from './jikan';
export * from './settings';

// Import types for union types
import { TMDBMovie, TMDBTVShow, TMDBMovieDetails, TMDBTVShowDetails } from './tmdb';
import { JikanAnime, JikanAnimeDetails } from './jikan';

// Common types used across the plugin
export type ContentType = 'movie' | 'tv' | 'anime';
export type SearchType = 'movie' | 'tv' | 'anime' | 'both';

// Union types for API responses
export type MediaItem = TMDBMovie | TMDBTVShow | JikanAnime;
export type MediaDetails = TMDBMovieDetails | TMDBTVShowDetails | JikanAnimeDetails;
