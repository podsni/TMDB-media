import { App, Modal, Notice } from 'obsidian';
import { MediaItem, TMDBMovie, TMDBTVShow, JikanAnime, SearchType } from '../types';
import { MediaService } from '../services/MediaService';
import { TemplateFormatter } from '../utils/TemplateFormatter';
import { FileManager } from '../utils/FileManager';
import { TMDBPluginSettings } from '../types/settings';
import { MediaPreviewModal } from './MediaPreviewModal';

export class MediaSearchModal extends Modal {
	private mediaService: MediaService;
	private templateFormatter: TemplateFormatter;
	private fileManager: FileManager;
	private settings: TMDBPluginSettings;
	private searchType: SearchType;
	private searchResults: MediaItem[] = [];

	constructor(
		app: App, 
		mediaService: MediaService, 
		templateFormatter: TemplateFormatter,
		fileManager: FileManager,
		settings: TMDBPluginSettings,
		searchType: SearchType = 'both'
	) {
		super(app);
		this.mediaService = mediaService;
		this.templateFormatter = templateFormatter;
		this.fileManager = fileManager;
		this.settings = settings;
		this.searchType = searchType;
	}

	onOpen() {
		const { contentEl } = this;
		while (contentEl.firstChild) contentEl.removeChild(contentEl.firstChild);

		const h2 = document.createElement('h2');
		h2.textContent = this.getModalTitle();
		contentEl.appendChild(h2);

		// Provider indicator
		const providerIndicator = this.buildProviderIndicator();
		contentEl.appendChild(providerIndicator);

		// Provider selection
		const providerSelection = this.buildProviderSelection();
		contentEl.appendChild(providerSelection);

		// Search input
		const searchContainer = document.createElement('div');
		searchContainer.className = 'tmdb-search-container';
		contentEl.appendChild(searchContainer);
		
		const searchInput = document.createElement('input');
		searchInput.type = 'text';
		searchInput.placeholder = this.getSearchPlaceholder();
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

			while (resultsContainer.firstChild) resultsContainer.removeChild(resultsContainer.firstChild);
			const searchingP = document.createElement('p');
			searchingP.textContent = 'Searching...';
			resultsContainer.appendChild(searchingP);

			let results: MediaItem[] = [];

			try {
				const selectedProviders = this.getSelectedProviders();
				
				if (selectedProviders.length === 0) {
					new Notice('Please select at least one provider.');
					return;
				}

				// Search based on selected providers
				if (selectedProviders.includes('tmdb')) {
					if (this.searchType === 'movie' || this.searchType === 'both') {
						const movieResults = await this.mediaService.searchMovies(query);
						results = results.concat(movieResults);
					}

					if (this.searchType === 'tv' || this.searchType === 'both') {
						const tvResults = await this.mediaService.searchTVShows(query);
						results = results.concat(tvResults);
					}
				}

				if (selectedProviders.includes('jikan') || selectedProviders.includes('anilist') || selectedProviders.includes('kitsu')) {
					if (this.searchType === 'anime' || this.searchType === 'both') {
						const animeResults = await this.mediaService.searchAnime(query);
						results = results.concat(animeResults);
					}
				}

				this.searchResults = results;
				this.displayResults(resultsContainer);
			} catch (error) {
				console.error('Search error:', error);
				new Notice('Error performing search. Please try again.');
			}
		};

		searchButton.addEventListener('click', performSearch);
		searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				performSearch();
			}
		});

		// Add provider selection event listeners
		this.addProviderSelectionListeners(providerSelection);
	}

	private getModalTitle(): string {
		switch (this.searchType) {
			case 'movie':
				return 'Search Movies';
			case 'tv':
				return 'Search TV Shows';
			case 'anime':
				return 'Search Anime';
			case 'both':
			default:
				return 'Search Media';
		}
	}

	private getSearchPlaceholder(): string {
		switch (this.searchType) {
			case 'movie':
				return 'Search for movies...';
			case 'tv':
				return 'Search for TV shows...';
			case 'anime':
				return 'Search for anime...';
			case 'both':
			default:
				return 'Search for movies, TV shows, or anime...';
		}
	}

	private buildProviderIndicator(): HTMLElement {
		const container = document.createElement('div');
		container.className = 'tmdb-provider-indicator';
		const providers = [];
		
		if (this.searchType === 'movie' || this.searchType === 'tv' || this.searchType === 'both') {
			providers.push({
				name: 'TMDB',
				status: this.settings.apiKey ? 'active' : 'inactive',
				description: 'The Movie Database'
			});
		}
		
		if (this.searchType === 'anime' || this.searchType === 'both') {
			const animeProvider = this.settings.animeProvider;
			const animeConfig = this.getAnimeProviderConfig(animeProvider);
			providers.push({
				name: animeConfig.name,
				status: animeConfig.enabled ? 'active' : 'inactive',
				description: animeConfig.description || 'Anime Database'
			});
		}
		
		for (const provider of providers) {
			const item = document.createElement('div');
			item.className = `provider-item ${provider.status}`;
			const name = document.createElement('span');
			name.className = 'provider-name';
			name.textContent = provider.name;
			const status = document.createElement('span');
			status.className = 'provider-status';
			status.textContent = provider.status === 'active' ? '✓' : '✗';
			const desc = document.createElement('span');
			desc.className = 'provider-description';
			desc.textContent = provider.description;
			item.appendChild(name);
			item.appendChild(status);
			item.appendChild(desc);
			container.appendChild(item);
		}
		return container;
	}

	private getAnimeProviderConfig(provider: string): { name: string; enabled: boolean; description: string } {
		switch (provider) {
			case 'jikan':
				return {
					name: 'Jikan',
					enabled: this.settings.jikanConfig.enabled,
					description: 'MyAnimeList API'
				};
			case 'anilist':
				return {
					name: 'AniList',
					enabled: this.settings.anilistConfig.enabled,
					description: 'AniList GraphQL API'
				};
			case 'kitsu':
				return {
					name: 'Kitsu',
					enabled: this.settings.kitsuConfig.enabled,
					description: 'Kitsu API'
				};
			default:
				return {
					name: 'Unknown',
					enabled: false,
					description: 'Unknown Provider'
				};
		}
	}

	private buildProviderSelection(): HTMLElement {
		const providers = this.getAvailableProviders();
		const wrapper = document.createElement('div');
		wrapper.className = 'tmdb-provider-selection';
		const header = document.createElement('div');
		header.className = 'provider-selection-header';
		const title = document.createElement('span');
		title.className = 'provider-selection-title';
		title.textContent = 'Select Providers:';
		const controls = document.createElement('div');
		controls.className = 'provider-selection-controls';
		const selectAll = document.createElement('button');
		selectAll.className = 'provider-select-all-btn';
		selectAll.textContent = 'Select All';
		selectAll.addEventListener('click', () => {
			const checkboxes = wrapper.querySelectorAll('.provider-checkbox:not(:disabled)') as NodeListOf<HTMLInputElement>;
			checkboxes.forEach(cb => cb.checked = true);
		});
		const selectNone = document.createElement('button');
		selectNone.className = 'provider-select-none-btn';
		selectNone.textContent = 'Select None';
		selectNone.addEventListener('click', () => {
			const checkboxes = wrapper.querySelectorAll('.provider-checkbox') as NodeListOf<HTMLInputElement>;
			checkboxes.forEach(cb => cb.checked = false);
		});
		controls.appendChild(selectAll);
		controls.appendChild(selectNone);
		header.appendChild(title);
		header.appendChild(controls);
		wrapper.appendChild(header);
		const grid = document.createElement('div');
		grid.className = 'provider-selection-grid';
		for (const provider of providers) {
			const item = document.createElement('div');
			item.className = 'provider-selection-item';
			const label = document.createElement('label');
			label.className = 'provider-checkbox-label';
			const input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'provider-checkbox';
			input.dataset.provider = provider.id;
			input.checked = provider.enabled;
			input.disabled = !provider.available;
			const text = document.createElement('span');
			text.className = 'provider-checkbox-text';
			const icon = document.createElement('span');
			icon.className = 'provider-icon';
			icon.textContent = provider.icon;
			const name = document.createElement('span');
			name.className = 'provider-name';
			name.textContent = provider.name;
			const desc = document.createElement('span');
			desc.className = 'provider-description';
			desc.textContent = provider.description;
			text.appendChild(icon);
			text.appendChild(name);
			text.appendChild(desc);
			label.appendChild(input);
			label.appendChild(text);
			item.appendChild(label);
			grid.appendChild(item);
		}
		wrapper.appendChild(grid);
		return wrapper;
	}

	private getAvailableProviders(): Array<{
		id: string;
		name: string;
		icon: string;
		description: string;
		enabled: boolean;
		available: boolean;
	}> {
		return [
			{
				id: 'tmdb',
				name: 'TMDB',
				icon: '🎬',
				description: 'Movies & TV Shows',
				enabled: this.settings.enabledProviders.tmdb,
				available: !!this.settings.apiKey
			},
			{
				id: 'jikan',
				name: 'Jikan',
				icon: '🎌',
				description: 'Anime (MyAnimeList)',
				enabled: this.settings.enabledProviders.jikan,
				available: this.settings.jikanConfig.enabled
			},
			{
				id: 'anilist',
				name: 'AniList',
				icon: '📊',
				description: 'Anime (AniList)',
				enabled: this.settings.enabledProviders.anilist,
				available: this.settings.anilistConfig.enabled
			},
			{
				id: 'kitsu',
				name: 'Kitsu',
				icon: '🎭',
				description: 'Anime (Kitsu)',
				enabled: this.settings.enabledProviders.kitsu,
				available: this.settings.kitsuConfig.enabled
			}
		];
	}

	private addProviderSelectionListeners(providerSelection: HTMLElement): void {
		// Select All button
		const selectAllBtn = providerSelection.querySelector('.provider-select-all-btn') as HTMLButtonElement;
		if (selectAllBtn) {
			selectAllBtn.addEventListener('click', () => {
				const checkboxes = providerSelection.querySelectorAll('.provider-checkbox:not(:disabled)') as NodeListOf<HTMLInputElement>;
				checkboxes.forEach(checkbox => {
					checkbox.checked = true;
				});
			});
		}

		// Select None button
		const selectNoneBtn = providerSelection.querySelector('.provider-select-none-btn') as HTMLButtonElement;
		if (selectNoneBtn) {
			selectNoneBtn.addEventListener('click', () => {
				const checkboxes = providerSelection.querySelectorAll('.provider-checkbox') as NodeListOf<HTMLInputElement>;
				checkboxes.forEach(checkbox => {
					checkbox.checked = false;
				});
			});
		}

		// Individual checkbox listeners
		const checkboxes = providerSelection.querySelectorAll('.provider-checkbox') as NodeListOf<HTMLInputElement>;
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener('change', () => {
				this.updateProviderSelection(checkbox.dataset.provider!, checkbox.checked);
			});
		});
	}

	private updateProviderSelection(providerId: string, enabled: boolean): void {
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
	}

	private getSelectedProviders(): string[] {
		const selected: string[] = [];
		if (this.settings.enabledProviders.tmdb) selected.push('tmdb');
		if (this.settings.enabledProviders.jikan) selected.push('jikan');
		if (this.settings.enabledProviders.anilist) selected.push('anilist');
		if (this.settings.enabledProviders.kitsu) selected.push('kitsu');
		return selected;
	}

		displayResults(container: HTMLElement) {
			while (container.firstChild) container.removeChild(container.firstChild);

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
			const posterPath = this.getPosterPath(item);
			if (posterPath) {
				const img = document.createElement('img');
				img.src = posterPath;
				img.className = 'tmdb-poster';
				resultItem.appendChild(img);
			}

			// Content
			const content = document.createElement('div');
			content.className = 'tmdb-result-content';
			resultItem.appendChild(content);
			
			const title = this.getTitle(item);
			const year = this.getYear(item);
			
			const h4 = document.createElement('h4');
			h4.textContent = `${title} (${year})`;
			content.appendChild(h4);

			// Provider indicator for each result
			const providerIndicator = this.buildResultProviderIndicator(item);
			content.appendChild(providerIndicator);
			
			const overviewP = document.createElement('p');
			overviewP.textContent = this.getOverview(item);
			content.appendChild(overviewP);
			
			const ratingP = document.createElement('p');
			ratingP.textContent = this.getRatingText(item);
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

			// Event listeners
			previewButton.addEventListener('click', async () => {
				const formattedData = await this.formatItemData(item);
				this.showPreview(formattedData, item);
			});

			insertButton.addEventListener('click', async () => {
				const formattedData = await this.formatItemData(item);
				this.fileManager.insertIntoEditor(formattedData);
				this.close();
			});

			saveButton.addEventListener('click', async () => {
				const formattedData = await this.formatItemData(item);
				const fileName = this.settings.fileNameTemplate;
				await this.fileManager.saveToFile(formattedData, fileName, item, this.settings);
				this.close();
			});
		});
	}

	private getPosterPath(item: MediaItem): string {
		if ('mal_id' in item) {
			// Anime
			const anime = item as JikanAnime;
			return anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || '';
		} else if ('poster_path' in item) {
			// TMDB Movie or TV Show
			const tmdbItem = item as TMDBMovie | TMDBTVShow;
			return tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w200${tmdbItem.poster_path}` : '';
		}
		return '';
	}

	private getTitle(item: MediaItem): string {
		if ('mal_id' in item) {
			return (item as JikanAnime).title;
		} else if ('title' in item) {
			return (item as TMDBMovie).title;
		} else {
			return (item as TMDBTVShow).name;
		}
	}

	private getYear(item: MediaItem): string {
		if ('mal_id' in item) {
			const anime = item as JikanAnime;
			return anime.year?.toString() || 'N/A';
		} else if ('release_date' in item) {
			const movie = item as TMDBMovie;
			return movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
		} else {
			const tvShow = item as TMDBTVShow;
			return tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear().toString() : 'N/A';
		}
	}

	private getOverview(item: MediaItem): string {
		if ('mal_id' in item) {
			return (item as JikanAnime).synopsis || 'No synopsis available.';
		} else {
			return (item as TMDBMovie | TMDBTVShow).overview || 'No overview available.';
		}
	}

	private getRatingText(item: MediaItem): string {
		if ('mal_id' in item) {
			const anime = item as JikanAnime;
			return `Score: ${anime.score || 'N/A'}/10 (${anime.scored_by || 0} votes)`;
		} else {
			const tmdbItem = item as TMDBMovie | TMDBTVShow;
			return `Rating: ${tmdbItem.vote_average}/10 (${tmdbItem.vote_count} votes)`;
		}
	}

	private buildResultProviderIndicator(item: MediaItem): HTMLElement {
		const container = document.createElement('div');
		container.className = 'result-provider-indicator';
		if ('mal_id' in item) {
			const animeProvider = this.settings.animeProvider;
			const animeConfig = this.getAnimeProviderConfig(animeProvider);
			const badge = document.createElement('div');
			badge.className = 'provider-badge anime';
			const icon = document.createElement('span');
			icon.className = 'provider-icon';
			icon.textContent = '🎌';
			const name = document.createElement('span');
			name.className = 'provider-name';
			name.textContent = animeConfig.name;
			badge.appendChild(icon);
			badge.appendChild(name);
			container.appendChild(badge);
		} else {
			const badge = document.createElement('div');
			badge.className = 'provider-badge tmdb';
			const icon = document.createElement('span');
			icon.className = 'provider-icon';
			icon.textContent = '🎬';
			const name = document.createElement('span');
			name.className = 'provider-name';
			name.textContent = 'TMDB';
			badge.appendChild(icon);
			badge.appendChild(name);
			container.appendChild(badge);
		}
		return container;
	}

	private async formatItemData(item: MediaItem): Promise<string> {
		if ('mal_id' in item) {
			// Anime
			const anime = item as JikanAnime;
			const animeDetails = await this.mediaService.getAnimeDetails(anime.mal_id);
			const provider = this.settings.animeProvider;
			return await this.templateFormatter.formatAnimeData(anime, animeDetails, this.settings.animeTemplate, provider);
		} else if ('title' in item) {
			// Movie
			const movie = item as TMDBMovie;
			const movieDetails = await this.mediaService.getMovieDetails(movie.id);
			return await this.templateFormatter.formatMovieData(movie, movieDetails, this.settings.movieTemplate);
		} else {
			// TV Show
			const tvShow = item as TMDBTVShow;
			const tvDetails = await this.mediaService.getTVShowDetails(tvShow.id);
			return await this.templateFormatter.formatTVData(tvShow, tvDetails, this.settings.tvTemplate);
		}
	}

	private showPreview(data: string, item: MediaItem): void {
		new MediaPreviewModal(this.app, data, item, this.templateFormatter, this.fileManager, this.settings).open();
	}

	onClose() {
		const { contentEl } = this;
		while (contentEl.firstChild) contentEl.removeChild(contentEl.firstChild);
	}
}
