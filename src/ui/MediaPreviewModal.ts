import { App, Modal } from 'obsidian';
import { MediaItem, TMDBMovie, TMDBTVShow, JikanAnime } from '../types';
import { TemplateFormatter } from '../utils/TemplateFormatter';
import { FileManager } from '../utils/FileManager';
import { TMDBPluginSettings } from '../types/settings';

export class MediaPreviewModal extends Modal {
	private data: string;
	private item: MediaItem;
	private templateFormatter: TemplateFormatter;
	private fileManager: FileManager;
	private settings: TMDBPluginSettings;

	constructor(
		app: App, 
		data: string, 
		item: MediaItem,
		templateFormatter: TemplateFormatter,
		fileManager: FileManager,
		settings: TMDBPluginSettings
	) {
		super(app);
		this.data = data;
		this.item = item;
		this.templateFormatter = templateFormatter;
		this.fileManager = fileManager;
		this.settings = settings;
	}

	onOpen() {
		const { contentEl } = this;
		while (contentEl.firstChild) contentEl.removeChild(contentEl.firstChild);

		// Header
		const header = document.createElement('div');
		header.className = 'tmdb-preview-header';
		
		const title = document.createElement('h2');
		const itemTitle = this.getItemTitle();
		const itemYear = this.getItemYear();
		title.textContent = `Preview: ${itemTitle} (${itemYear})`;
		header.appendChild(title);
		contentEl.appendChild(header);

		// Provider indicator
		const providerIndicator = this.buildProviderIndicator();
		contentEl.appendChild(providerIndicator);

		// Preview content
		const previewContainer = document.createElement('div');
		previewContainer.className = 'tmdb-preview-container';
		
		// Create syntax highlighted YAML
		const highlightedYamlEl = this.highlightYAML(this.data);
		previewContainer.appendChild(highlightedYamlEl);
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
			this.fileManager.insertIntoEditor(this.data);
			this.close();
		});

		saveButton.addEventListener('click', async () => {
			const fileName = this.settings.fileNameTemplate;
			await this.fileManager.saveToFile(this.data, fileName, this.item, this.settings);
			this.close();
		});

		closeButton.addEventListener('click', () => {
			this.close();
		});
	}

	private getItemTitle(): string {
		if ('mal_id' in this.item) {
			return (this.item as JikanAnime).title;
		} else if ('title' in this.item) {
			return (this.item as TMDBMovie).title;
		} else {
			return (this.item as TMDBTVShow).name;
		}
	}

	private getItemYear(): string {
		if ('mal_id' in this.item) {
			const anime = this.item as JikanAnime;
			return anime.year?.toString() || 'N/A';
		} else if ('release_date' in this.item) {
			const movie = this.item as TMDBMovie;
			return movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
		} else {
			const tvShow = this.item as TMDBTVShow;
			return tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear().toString() : 'N/A';
		}
	}

    private buildProviderIndicator(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'tmdb-provider-indicator';
		if ('mal_id' in this.item) {
			const animeProvider = this.settings.animeProvider;
			const animeConfig = this.getAnimeProviderConfig(animeProvider);
            const item = document.createElement('div');
            item.className = `provider-item ${animeConfig.enabled ? 'active' : 'inactive'}`;
            const name = document.createElement('span');
            name.className = 'provider-name';
            name.textContent = animeConfig.name;
            const status = document.createElement('span');
            status.className = 'provider-status';
            status.textContent = animeConfig.enabled ? '✓' : '✗';
            const desc = document.createElement('span');
            desc.className = 'provider-description';
            desc.textContent = animeConfig.description;
            item.appendChild(name);
            item.appendChild(status);
            item.appendChild(desc);
            container.appendChild(item);
		} else {
            const item = document.createElement('div');
            item.className = `provider-item ${this.settings.apiKey ? 'active' : 'inactive'}`;
            const name = document.createElement('span');
            name.className = 'provider-name';
            name.textContent = 'TMDB';
            const status = document.createElement('span');
            status.className = 'provider-status';
            status.textContent = this.settings.apiKey ? '✓' : '✗';
            const desc = document.createElement('span');
            desc.className = 'provider-description';
            desc.textContent = 'The Movie Database';
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

	onClose() {
		const { contentEl } = this;
		while (contentEl.firstChild) contentEl.removeChild(contentEl.firstChild);
	}

	// Highlight YAML syntax
    private highlightYAML(yamlText: string): HTMLElement {
        const container = document.createElement('div');
        container.className = 'yaml-container';
		const lines = yamlText.split('\n');
        for (const line of lines) {
            const lineEl = document.createElement('div');
            lineEl.className = 'yaml-line';
            const trimmed = line.trim();
            if (trimmed === '') {
                container.appendChild(lineEl);
                continue;
            }
            if (trimmed === '---') {
                lineEl.classList.add('yaml-delimiter');
                lineEl.textContent = '---';
                container.appendChild(lineEl);
                continue;
            }
            if (line.startsWith('  - ')) {
                lineEl.classList.add('yaml-list-item');
                lineEl.append('  - ');
                const val = document.createElement('span');
                val.className = 'yaml-value';
                val.textContent = line.substring(4);
                lineEl.appendChild(val);
                container.appendChild(lineEl);
                continue;
            }
			if (line.includes(':')) {
				const colonIndex = line.indexOf(':');
				const key = line.substring(0, colonIndex).trim();
				const value = line.substring(colonIndex + 1).trim();
                const keyEl = document.createElement('span');
                keyEl.className = 'yaml-key';
                keyEl.textContent = key;
                lineEl.appendChild(keyEl);
                lineEl.append(':');
                if (value) {
                    lineEl.append(' ');
                    const valueEl = document.createElement('span');
                    valueEl.className = 'yaml-value';
                    valueEl.textContent = value;
                    lineEl.appendChild(valueEl);
                }
                container.appendChild(lineEl);
                continue;
            }
			if (line.startsWith('- ')) {
                lineEl.classList.add('yaml-list-item');
                lineEl.append('- ');
                const val = document.createElement('span');
                val.className = 'yaml-value';
                val.textContent = line.substring(2);
                lineEl.appendChild(val);
                container.appendChild(lineEl);
                continue;
            }
            lineEl.textContent = line;
            container.appendChild(lineEl);
        }
        return container;
	}
}
