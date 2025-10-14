import { Plugin } from 'obsidian';
import { TMDBPluginSettings, DEFAULT_SETTINGS } from '../types/settings';

export class SettingsManager {
	private plugin: Plugin;
	private settings: TMDBPluginSettings;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		this.settings = { ...DEFAULT_SETTINGS };
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.plugin.loadData());
		
		// Ensure templates are using the correct YAML format
		if (this.settings.movieTemplate.includes('**') || this.settings.movieTemplate.includes('![')) {
			this.settings.movieTemplate = DEFAULT_SETTINGS.movieTemplate;
			await this.saveSettings();
		}
		
		if (this.settings.tvTemplate.includes('**') || this.settings.tvTemplate.includes('![')) {
			this.settings.tvTemplate = DEFAULT_SETTINGS.tvTemplate;
			await this.saveSettings();
		}

		if (this.settings.animeTemplate.includes('**') || this.settings.animeTemplate.includes('![')) {
			this.settings.animeTemplate = DEFAULT_SETTINGS.animeTemplate;
			await this.saveSettings();
		}
	}

	async saveSettings(): Promise<void> {
		await this.plugin.saveData(this.settings);
	}

	getSettings(): TMDBPluginSettings {
		return this.settings;
	}

	updateSettings(updates: Partial<TMDBPluginSettings>): void {
		this.settings = { ...this.settings, ...updates };
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

	// Reset folder settings to defaults
	async resetFolderSettings(): Promise<void> {
		this.settings.defaultFolder = DEFAULT_SETTINGS.defaultFolder;
		this.settings.movieFolder = DEFAULT_SETTINGS.movieFolder;
		this.settings.tvFolder = DEFAULT_SETTINGS.tvFolder;
		this.settings.animeFolder = DEFAULT_SETTINGS.animeFolder;
		this.settings.lastUsedMovieFolder = DEFAULT_SETTINGS.lastUsedMovieFolder;
		this.settings.lastUsedTVFolder = DEFAULT_SETTINGS.lastUsedTVFolder;
		this.settings.lastUsedAnimeFolder = DEFAULT_SETTINGS.lastUsedAnimeFolder;
		await this.saveSettings();
	}

	// Get appropriate folder based on content type
	getFolderForContentType(contentType: 'movie' | 'tv' | 'anime'): string {
		if (this.settings.rememberLastLocation) {
			switch (contentType) {
				case 'movie':
					return this.settings.lastUsedMovieFolder;
				case 'tv':
					return this.settings.lastUsedTVFolder;
				case 'anime':
					return this.settings.lastUsedAnimeFolder;
			}
		} else {
			switch (contentType) {
				case 'movie':
					return this.settings.movieFolder;
				case 'tv':
					return this.settings.tvFolder;
				case 'anime':
					return this.settings.animeFolder;
			}
		}
	}

	// Update last used folder for content type
	async updateLastUsedFolder(contentType: 'movie' | 'tv' | 'anime', folderPath: string): Promise<void> {
		if (this.settings.rememberLastLocation) {
			switch (contentType) {
				case 'movie':
					this.settings.lastUsedMovieFolder = folderPath;
					break;
				case 'tv':
					this.settings.lastUsedTVFolder = folderPath;
					break;
				case 'anime':
					this.settings.lastUsedAnimeFolder = folderPath;
					break;
			}
			await this.saveSettings();
		}
	}

	// Get anime provider configuration
	getAnimeProviderConfig(): { name: string; baseUrl: string; enabled: boolean } {
		switch (this.settings.animeProvider) {
			case 'jikan':
				return {
					name: 'Jikan',
					baseUrl: this.settings.jikanConfig.baseUrl,
					enabled: this.settings.jikanConfig.enabled,
				};
			case 'anilist':
				return {
					name: 'AniList',
					baseUrl: this.settings.anilistConfig.baseUrl,
					enabled: this.settings.anilistConfig.enabled,
				};
			case 'kitsu':
				return {
					name: 'Kitsu',
					baseUrl: this.settings.kitsuConfig.baseUrl,
					enabled: this.settings.kitsuConfig.enabled,
				};
			default:
				return {
					name: 'Jikan',
					baseUrl: this.settings.jikanConfig.baseUrl,
					enabled: this.settings.jikanConfig.enabled,
				};
		}
	}

	// Get enabled providers
	getEnabledProviders(): string[] {
		const enabled: string[] = [];
		if (this.settings.enabledProviders.tmdb) enabled.push('tmdb');
		if (this.settings.enabledProviders.jikan) enabled.push('jikan');
		if (this.settings.enabledProviders.anilist) enabled.push('anilist');
		if (this.settings.enabledProviders.kitsu) enabled.push('kitsu');
		return enabled;
	}

	// Get default search providers
	getDefaultSearchProviders(): { movies: boolean; tv: boolean; anime: boolean } {
		return this.settings.defaultSearchProviders;
	}

	// Update provider selection
	async updateProviderSelection(providerId: string, enabled: boolean): Promise<void> {
		switch (providerId) {
			case 'tmdb':
				this.settings.enabledProviders.tmdb = enabled;
				break;
			case 'jikan':
				this.settings.enabledProviders.jikan = enabled;
				break;
			case 'anilist':
				this.settings.enabledProviders.anilist = enabled;
				break;
			case 'kitsu':
				this.settings.enabledProviders.kitsu = enabled;
				break;
		}
		await this.saveSettings();
	}

	// Reset provider selection to defaults
	async resetProviderSelection(): Promise<void> {
		this.settings.enabledProviders = {
			tmdb: true,
			jikan: true,
			anilist: false,
			kitsu: false,
		};
		this.settings.defaultSearchProviders = {
			movies: true,
			tv: true,
			anime: true,
		};
		await this.saveSettings();
	}
}
