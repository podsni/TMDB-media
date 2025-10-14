import { Plugin } from 'obsidian';

// Import modular components
import { SettingsManager } from './settings/SettingsManager';
import { MediaService } from './services/MediaService';
import { TemplateFormatter } from './utils/TemplateFormatter';
import { FileManager } from './utils/FileManager';
import { MediaSearchModal, MediaSettingsTab } from './ui';

export default class MediaPlugin extends Plugin {
	private settingsManager: SettingsManager;
	private mediaService: MediaService;
	private templateFormatter: TemplateFormatter;
	private fileManager: FileManager;

	async onload() {
		// Initialize components
		this.settingsManager = new SettingsManager(this);
		this.templateFormatter = new TemplateFormatter();
		this.fileManager = new FileManager(this.app);
		
		// Load settings first
		await this.settingsManager.loadSettings();
		
		// Initialize media service with settings
		this.mediaService = new MediaService(this.settingsManager.getSettings());

		// Add ribbon icon
		const ribbonIconEl = this.addRibbonIcon('film', 'Media Plugin', (evt: MouseEvent) => {
			new MediaSearchModal(
				this.app, 
				this.mediaService, 
				this.templateFormatter,
				this.fileManager,
				this.settingsManager.getSettings()
			).open();
		});
		ribbonIconEl.addClass('tmdb-plugin-ribbon-class');

		// Add commands
		this.addCommand({
			id: 'media-search-movie',
			name: 'Search Movie',
			callback: () => {
				new MediaSearchModal(
					this.app, 
					this.mediaService, 
					this.templateFormatter,
					this.fileManager,
					this.settingsManager.getSettings(),
					'movie'
				).open();
			}
		});

		this.addCommand({
			id: 'media-search-tv',
			name: 'Search TV Show',
			callback: () => {
				new MediaSearchModal(
					this.app, 
					this.mediaService, 
					this.templateFormatter,
					this.fileManager,
					this.settingsManager.getSettings(),
					'tv'
				).open();
			}
		});

		this.addCommand({
			id: 'media-search-anime',
			name: 'Search Anime',
			callback: () => {
				new MediaSearchModal(
					this.app, 
					this.mediaService, 
					this.templateFormatter,
					this.fileManager,
					this.settingsManager.getSettings(),
					'anime'
				).open();
			}
		});

		this.addCommand({
			id: 'media-search-general',
			name: 'Search Movie/TV Show/Anime',
			callback: () => {
				new MediaSearchModal(
					this.app, 
					this.mediaService, 
					this.templateFormatter,
					this.fileManager,
					this.settingsManager.getSettings()
				).open();
			}
		});

		// Add settings tab
		this.addSettingTab(new MediaSettingsTab(this.app, this.settingsManager));

		// Register settings change handler
		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
				// Update media service when settings change
				this.mediaService.updateSettings(this.settingsManager.getSettings());
			})
		);
	}

	onunload() {
		// Cleanup if needed
	}

	// Public methods for external access
	getSettingsManager(): SettingsManager {
		return this.settingsManager;
	}

	getMediaService(): MediaService {
		return this.mediaService;
	}

	getTemplateFormatter(): TemplateFormatter {
		return this.templateFormatter;
	}

	getFileManager(): FileManager {
		return this.fileManager;
	}
}
