import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import { SettingsManager } from '../settings/SettingsManager';

export class MediaSettingsTab extends PluginSettingTab {
	private settingsManager: SettingsManager;

	constructor(app: App, settingsManager: SettingsManager) {
		super(app, settingsManager['plugin']);
		this.settingsManager = settingsManager;
	}

	display(): void {
		const { containerEl } = this;
		const settings = this.settingsManager.getSettings();

		while (containerEl.firstChild) containerEl.removeChild(containerEl.firstChild);

		const h2 = document.createElement('h2');
		h2.textContent = 'Media Plugin Settings';
		containerEl.appendChild(h2);

		// API Configuration Section
		this.createSectionHeader(containerEl, 'API Configuration');

		// TMDB API Key
		new Setting(containerEl)
			.setName('TMDB API Key')
			.setDesc('Get your API key from https://www.themoviedb.org/settings/api')
			.addText((text: any) => text
				.setPlaceholder('Enter your TMDB API key')
				.setValue(settings.apiKey)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ apiKey: value });
					await this.settingsManager.saveSettings();
				}));

		// Language
		new Setting(containerEl)
			.setName('Language')
			.setDesc('Language for TMDB data (e.g., en-US, id-ID)')
			.addText((text: any) => text
				.setPlaceholder('en-US')
				.setValue(settings.language)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ language: value });
					await this.settingsManager.saveSettings();
				}));

		// Anime Provider Configuration
		this.createSectionHeader(containerEl, 'Anime Provider Configuration');

		// Provider Status Indicator
		let providerStatusContainer = this.buildProviderStatus(settings);
		containerEl.appendChild(providerStatusContainer);

		// Provider Validation
		const validationResult = this.validateProviderConfiguration(settings);
		if (!validationResult.isValid) {
			const validationContainer = document.createElement('div');
			validationContainer.className = 'tmdb-validation-errors';
			const header = document.createElement('div');
			header.className = 'validation-header';
			const icon = document.createElement('span');
			icon.className = 'validation-icon';
			icon.textContent = '⚠️';
			const title = document.createElement('span');
			title.className = 'validation-title';
			title.textContent = 'Configuration Issues';
			header.appendChild(icon);
			header.appendChild(title);
			validationContainer.appendChild(header);
			const errorsEl = document.createElement('div');
			errorsEl.className = 'validation-errors';
			for (const error of validationResult.errors) {
				const e = document.createElement('div');
				e.className = 'validation-error';
				e.textContent = `• ${error}`;
				errorsEl.appendChild(e);
			}
			validationContainer.appendChild(errorsEl);
			containerEl.appendChild(validationContainer);
		}

		// Provider Selection Settings
		this.createSectionHeader(containerEl, 'Provider Selection');

		// Enabled Providers
		new Setting(containerEl)
			.setName('Enable TMDB Provider')
			.setDesc('Enable TMDB for movies and TV shows')
			.addToggle((toggle: any) => toggle
				.setValue(settings.enabledProviders.tmdb)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						enabledProviders: { ...settings.enabledProviders, tmdb: value }
					});
					await this.settingsManager.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable Jikan Provider')
			.setDesc('Enable Jikan for anime (MyAnimeList)')
			.addToggle((toggle: any) => toggle
				.setValue(settings.enabledProviders.jikan)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						enabledProviders: { ...settings.enabledProviders, jikan: value }
					});
					await this.settingsManager.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable AniList Provider')
			.setDesc('Enable AniList for anime (when implemented)')
			.addToggle((toggle: any) => toggle
				.setValue(settings.enabledProviders.anilist)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						enabledProviders: { ...settings.enabledProviders, anilist: value }
					});
					await this.settingsManager.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable Kitsu Provider')
			.setDesc('Enable Kitsu for anime (when implemented)')
			.addToggle((toggle: any) => toggle
				.setValue(settings.enabledProviders.kitsu)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						enabledProviders: { ...settings.enabledProviders, kitsu: value }
					});
					await this.settingsManager.saveSettings();
				}));

		// Default Search Providers
		this.createSectionHeader(containerEl, 'Default Search Providers');

		new Setting(containerEl)
			.setName('Default: Search Movies')
			.setDesc('Include movies in default search')
			.addToggle((toggle: any) => toggle
				.setValue(settings.defaultSearchProviders.movies)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						defaultSearchProviders: { ...settings.defaultSearchProviders, movies: value }
					});
					await this.settingsManager.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default: Search TV Shows')
			.setDesc('Include TV shows in default search')
			.addToggle((toggle: any) => toggle
				.setValue(settings.defaultSearchProviders.tv)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						defaultSearchProviders: { ...settings.defaultSearchProviders, tv: value }
					});
					await this.settingsManager.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default: Search Anime')
			.setDesc('Include anime in default search')
			.addToggle((toggle: any) => toggle
				.setValue(settings.defaultSearchProviders.anime)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						defaultSearchProviders: { ...settings.defaultSearchProviders, anime: value }
					});
					await this.settingsManager.saveSettings();
				}));

		// Reset Provider Selection
		new Setting(containerEl)
			.setName('Reset Provider Selection')
			.setDesc('Reset all provider selections to default values')
			.addButton((button: any) => button
				.setButtonText('Reset')
				.setCta()
				.onClick(async () => {
					await this.settingsManager.resetProviderSelection();
					new Notice('Provider selection reset to defaults');
					this.display();
				}));

		// Anime Provider Selection
		new Setting(containerEl)
			.setName('Anime Provider')
			.setDesc('Choose which anime API provider to use')
			.addDropdown((dropdown: any) => dropdown
				.addOption('jikan', 'Jikan (MyAnimeList)')
				.addOption('anilist', 'AniList')
				.addOption('kitsu', 'Kitsu')
				.setValue(settings.animeProvider)
				.onChange(async (value: 'jikan' | 'anilist' | 'kitsu') => {
					this.settingsManager.updateSettings({ animeProvider: value });
					await this.settingsManager.saveSettings();
					// Refresh provider status
					const newStatus = this.buildProviderStatus(this.settingsManager.getSettings());
					providerStatusContainer.replaceWith(newStatus);
					providerStatusContainer = newStatus;
				}));

		// Jikan Configuration
		new Setting(containerEl)
			.setName('Enable Jikan API')
			.setDesc('Enable Jikan API for anime data (MyAnimeList)')
			.addToggle((toggle: any) => toggle
				.setValue(settings.jikanConfig.enabled)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ 
						jikanConfig: { ...settings.jikanConfig, enabled: value }
					});
					await this.settingsManager.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Jikan API Base URL')
			.setDesc('Base URL for Jikan API')
			.addText((text: any) => text
				.setPlaceholder('https://api.jikan.moe/v4')
				.setValue(settings.jikanConfig.baseUrl)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ 
						jikanConfig: { ...settings.jikanConfig, baseUrl: value }
					});
					await this.settingsManager.saveSettings();
				}));

		// Display Options Section
		this.createSectionHeader(containerEl, 'Display Options');

		// Include Poster
		new Setting(containerEl)
			.setName('Include Poster Images')
			.setDesc('Include poster images in the formatted output')
			.addToggle((toggle: any) => toggle
				.setValue(settings.includePoster)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ includePoster: value });
					await this.settingsManager.saveSettings();
				}));

		// Include Backdrop
		new Setting(containerEl)
			.setName('Include Backdrop Images')
			.setDesc('Include backdrop images in the formatted output')
			.addToggle((toggle: any) => toggle
				.setValue(settings.includeBackdrop)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ includeBackdrop: value });
					await this.settingsManager.saveSettings();
				}));

		// Show Preview
		new Setting(containerEl)
			.setName('Show Preview')
			.setDesc('Show preview modal before inserting or saving data')
			.addToggle((toggle: any) => toggle
				.setValue(settings.showPreview)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ showPreview: value });
					await this.settingsManager.saveSettings();
				}));

		// Templates Section
		this.createSectionHeader(containerEl, 'Templates');

		// Movie Template
		new Setting(containerEl)
			.setName('Movie Template')
			.setDesc('Template for formatting movie data. Use {{variable}} for placeholders.')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter movie template...')
				.setValue(settings.movieTemplate)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ movieTemplate: value });
					await this.settingsManager.saveSettings();
				}));

		// TV Template
		new Setting(containerEl)
			.setName('TV Show Template')
			.setDesc('Template for formatting TV show data. Use {{variable}} for placeholders.')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter TV show template...')
				.setValue(settings.tvTemplate)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ tvTemplate: value });
					await this.settingsManager.saveSettings();
				}));

		// Anime Template
		new Setting(containerEl)
			.setName('Anime Template')
			.setDesc('Template for formatting anime data. Use {{variable}} for placeholders.')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter anime template...')
				.setValue(settings.animeTemplate)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ animeTemplate: value });
					await this.settingsManager.saveSettings();
				}));

		// Folder Management Section
		this.createSectionHeader(containerEl, 'Folder Management');

		// Save to Folder
		new Setting(containerEl)
			.setName('Save to Folder')
			.setDesc('Enable saving media data to files instead of just inserting into editor')
			.addToggle((toggle: any) => toggle
				.setValue(settings.saveToFolder)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ saveToFolder: value });
					await this.settingsManager.saveSettings();
				}));

		// Default Folder
		new Setting(containerEl)
			.setName('Default Folder')
			.setDesc('Default base folder to save media files (e.g., TMDB)')
			.addText((text: any) => text
				.setPlaceholder('TMDB')
				.setValue(settings.defaultFolder)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ defaultFolder: value });
					await this.settingsManager.saveSettings();
				}));

		// Sync subfolders to default base
		new Setting(containerEl)
			.setName('Sync Subfolders with Default Folder')
			.setDesc('Update movie/TV/Anime folders to be inside the Default Folder')
			.addButton((btn: any) => btn
				.setButtonText('Sync Now')
				.onClick(async () => {
					await this.settingsManager.syncSubfoldersToDefaultBase();
					new Notice('Synced subfolders to Default Folder.');
				}));

		// Movie Folder
		new Setting(containerEl)
			.setName('Movie Folder')
			.setDesc('Default folder to save movie files (e.g., TMDB/Movies)')
			.addText((text: any) => text
				.setPlaceholder('TMDB/Movies')
				.setValue(settings.movieFolder)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ movieFolder: value });
					await this.settingsManager.saveSettings();
				}));

		// TV Folder
		new Setting(containerEl)
			.setName('TV Show Folder')
			.setDesc('Default folder to save TV show files (e.g., TMDB/TV Shows)')
			.addText((text: any) => text
				.setPlaceholder('TMDB/TV Shows')
				.setValue(settings.tvFolder)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ tvFolder: value });
					await this.settingsManager.saveSettings();
				}));

		// Anime Folder
		new Setting(containerEl)
			.setName('Anime Folder')
			.setDesc('Default folder to save anime files (e.g., TMDB/Anime)')
			.addText((text: any) => text
				.setPlaceholder('TMDB/Anime')
				.setValue(settings.animeFolder)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ animeFolder: value });
					await this.settingsManager.saveSettings();
				}));

		// Reset folder settings to defaults
		new Setting(containerEl)
			.setName('Reset Folder Settings')
			.setDesc('Reset Default/Movie/TV/Anime folders back to defaults')
			.addButton((btn: any) => btn
				.setButtonText('Reset to Defaults')
				.onClick(async () => {
					await this.settingsManager.resetFolderSettings();
					new Notice('Folder settings reset to defaults.');
				}));

		// Auto Create Folder
		new Setting(containerEl)
			.setName('Auto Create Folder')
			.setDesc('Automatically create the default folder if it does not exist')
			.addToggle((toggle: any) => toggle
				.setValue(settings.autoCreateFolder)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ autoCreateFolder: value });
					await this.settingsManager.saveSettings();
				}));

		// File Name Template
		new Setting(containerEl)
			.setName('File Name Template')
			.setDesc('Template for generated file names. Use {{title}}, {{year}}, {{name}} for placeholders. Example: "{{title}} {{year}}" will create "Jack 2004.md"')
			.addText((text: any) => text
				.setPlaceholder('{{title}} {{year}}')
				.setValue(settings.fileNameTemplate)
				.onChange(async (value: string) => {
					this.settingsManager.updateSettings({ fileNameTemplate: value });
					await this.settingsManager.saveSettings();
				}));

		// Location Management Section
		this.createSectionHeader(containerEl, 'Location Management');

		// Ask for Location
		new Setting(containerEl)
			.setName('Ask for Save Location')
			.setDesc('Show folder selection dialog when saving files')
			.addToggle((toggle: any) => toggle
				.setValue(settings.askForLocation)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ askForLocation: value });
					await this.settingsManager.saveSettings();
				}));

		// Remember Last Location
		new Setting(containerEl)
			.setName('Remember Last Location')
			.setDesc('Remember the last used folder for future saves')
			.addToggle((toggle: any) => toggle
				.setValue(settings.rememberLastLocation)
				.onChange(async (value: boolean) => {
					this.settingsManager.updateSettings({ rememberLastLocation: value });
					await this.settingsManager.saveSettings();
				}));

		// Help section
		this.createHelpSection(containerEl);
	}

	private createSectionHeader(containerEl: HTMLElement, title: string): void {
		const h3 = document.createElement('h3');
		h3.textContent = title;
		h3.className = 'tmdb-section-header';
		containerEl.appendChild(h3);
	}

	private buildProviderStatus(settings: any): HTMLElement {
		const container = document.createElement('div');
		container.className = 'tmdb-provider-indicator';
		const providers = [
			{
				name: 'TMDB',
				status: settings.apiKey ? 'active' : 'inactive',
				description: 'The Movie Database',
				icon: '🎬'
			},
			{
				name: this.getAnimeProviderName(settings.animeProvider),
				status: this.getAnimeProviderStatus(settings) ? 'active' : 'inactive',
				description: this.getAnimeProviderDescription(settings.animeProvider),
				icon: '🎌'
			}
		];
		for (const provider of providers) {
			const item = document.createElement('div');
			item.className = `provider-item ${provider.status}`;
			const icon = document.createElement('span');
			icon.className = 'provider-icon';
			icon.textContent = provider.icon;
			const name = document.createElement('span');
			name.className = 'provider-name';
			name.textContent = provider.name;
			const status = document.createElement('span');
			status.className = 'provider-status';
			status.textContent = provider.status === 'active' ? '✓' : '✗';
			const desc = document.createElement('span');
			desc.className = 'provider-description';
			desc.textContent = provider.description;
			item.appendChild(icon);
			item.appendChild(name);
			item.appendChild(status);
			item.appendChild(desc);
			container.appendChild(item);
		}
		return container;
	}

	private getAnimeProviderName(provider: string): string {
		switch (provider) {
			case 'jikan': return 'Jikan';
			case 'anilist': return 'AniList';
			case 'kitsu': return 'Kitsu';
			default: return 'Unknown';
		}
	}

	private getAnimeProviderStatus(settings: any): boolean {
		switch (settings.animeProvider) {
			case 'jikan': return settings.jikanConfig.enabled;
			case 'anilist': return settings.anilistConfig.enabled;
			case 'kitsu': return settings.kitsuConfig.enabled;
			default: return false;
		}
	}

	private getAnimeProviderDescription(provider: string): string {
		switch (provider) {
			case 'jikan': return 'MyAnimeList API';
			case 'anilist': return 'AniList GraphQL API';
			case 'kitsu': return 'Kitsu API';
			default: return 'Unknown Provider';
		}
	}

	private validateProviderConfiguration(settings: any): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		
		// Check TMDB configuration
		if (!settings.apiKey) {
			errors.push('TMDB API key is required for movies and TV shows');
		}
		
		// Check anime provider configuration
		const animeProvider = settings.animeProvider;
		let providerEnabled = false;
		let providerBaseUrl = '';
		
		switch (animeProvider) {
			case 'jikan':
				providerEnabled = settings.jikanConfig.enabled;
				providerBaseUrl = settings.jikanConfig.baseUrl;
				break;
			case 'anilist':
				providerEnabled = settings.anilistConfig.enabled;
				providerBaseUrl = settings.anilistConfig.baseUrl;
				break;
			case 'kitsu':
				providerEnabled = settings.kitsuConfig.enabled;
				providerBaseUrl = settings.kitsuConfig.baseUrl;
				break;
		}
		
		if (!providerEnabled) {
			errors.push(`Anime provider ${this.getAnimeProviderName(animeProvider)} is disabled`);
		}
		
		if (!providerBaseUrl) {
			errors.push(`Anime provider ${this.getAnimeProviderName(animeProvider)} base URL is not configured`);
		}
		
		return {
			isValid: errors.length === 0,
			errors
		};
	}

	private createHelpSection(containerEl: HTMLElement): void {
		this.createSectionHeader(containerEl, 'Template Variables');

		const helpContainer = document.createElement('div');
		helpContainer.className = 'tmdb-help-container';
		containerEl.appendChild(helpContainer);
		
		const movieVars = document.createElement('div');
		const movieVarsH4 = document.createElement('h4');
		movieVarsH4.textContent = 'Movie Variables:';
		movieVars.appendChild(movieVarsH4);
		
		const movieVarsUl = document.createElement('ul');
		movieVarsUl.textContent = '{{title}}, {{year}}, {{overview}}, {{rating}}, {{vote_count}}, {{release_date}}, {{language}}, {{original_title}}, {{popularity}}, {{adult}}, {{id}}, {{poster_url}}, {{backdrop_url}}, {{genres}}';
		movieVars.appendChild(movieVarsUl);
		helpContainer.appendChild(movieVars);
		
		const tvVars = document.createElement('div');
		const tvVarsH4 = document.createElement('h4');
		tvVarsH4.textContent = 'TV Show Variables:';
		tvVars.appendChild(tvVarsH4);
		
		const tvVarsUl = document.createElement('ul');
		tvVarsUl.textContent = '{{name}}, {{year}}, {{overview}}, {{rating}}, {{vote_count}}, {{first_air_date}}, {{language}}, {{original_name}}, {{popularity}}, {{adult}}, {{origin_countries}}, {{id}}, {{poster_url}}, {{backdrop_url}}, {{genres}}';
		tvVars.appendChild(tvVarsUl);
		helpContainer.appendChild(tvVars);

		const animeVars = document.createElement('div');
		const animeVarsH4 = document.createElement('h4');
		animeVarsH4.textContent = 'Anime Variables:';
		animeVars.appendChild(animeVarsH4);
		
		const animeVarsUl = document.createElement('ul');
		animeVarsUl.textContent = '{{title}}, {{title_english}}, {{title_japanese}}, {{year}}, {{synopsis}}, {{rating}}, {{score}}, {{scored_by}}, {{members}}, {{favorites}}, {{episodes}}, {{duration}}, {{airing}}, {{aired_from}}, {{aired_to}}, {{mal_id}}, {{url}}, {{provider}}, {{image_url}}, {{genres}}, {{studios}}, {{producers}}';
		animeVars.appendChild(animeVarsUl);
		helpContainer.appendChild(animeVars);

		// Filename examples
		const filenameExamples = document.createElement('div');
		const filenameH4 = document.createElement('h4');
		filenameH4.textContent = 'Filename Template Examples:';
		filenameExamples.appendChild(filenameH4);
		
		const filenameUl = document.createElement('ul');
		const examples: Array<[string,string]> = [
			['{{title}} {{year}}', 'Attack on Titan 2013.md'],
			['{{title}} ({{year}})', 'Attack on Titan (2013).md'],
			['{{title}}', 'Attack on Titan.md'],
			['{{title_english}}', 'Attack on Titan.md'],
			['{{name}} - TV', 'Breaking Bad - TV.md']
		];
		for (const [tmpl, result] of examples) {
			const li = document.createElement('li');
			const code = document.createElement('code');
			code.textContent = tmpl;
			li.appendChild(code);
			li.append(` → "${result}"`);
			filenameUl.appendChild(li);
		}
		filenameExamples.appendChild(filenameUl);
		helpContainer.appendChild(filenameExamples);
	}
}
