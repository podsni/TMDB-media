import { App, MarkdownView, Notice, TFile } from 'obsidian';
import { MediaItem, TMDBMovie, TMDBTVShow, JikanAnime, ContentType } from '../types';
import { FolderSelectionModal } from '../ui/FolderSelectionModal';

export class FileManager {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	// Insert formatted data into editor
	insertIntoEditor(data: string): void {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const editor = activeView.editor;
			const cursor = editor.getCursor();
			editor.replaceRange(data, cursor);
			new Notice('Media data inserted successfully!');
		} else {
			new Notice('Please open a markdown file to insert media data.');
		}
	}

	// Save formatted data to file
	async saveToFile(
		data: string, 
		fileName: string, 
		item: MediaItem, 
		settings: any,
		customFolder?: string
	): Promise<void> {
		try {
			// Determine folder to use
			let folderPath: string;
			
			if (customFolder) {
				folderPath = customFolder;
			} else if (settings.askForLocation) {
				// Show folder selection modal with content type
				const contentType = this.getContentType(item);
				const selectedFolder = await this.showFolderSelectionModal(contentType, settings);
				if (!selectedFolder) {
					new Notice('No folder selected. Operation cancelled.');
					return;
				}
				folderPath = selectedFolder;
				
				// Remember last used folder if enabled
				if (settings.rememberLastLocation) {
					if (contentType === 'movie') {
						settings.lastUsedMovieFolder = folderPath;
					} else if (contentType === 'tv') {
						settings.lastUsedTVFolder = folderPath;
					} else if (contentType === 'anime') {
						settings.lastUsedAnimeFolder = folderPath;
					}
				}
			} else {
				// Use appropriate default folder based on content type
				folderPath = this.getDefaultFolderForContentType(item, settings);
			}

			// Ensure folder exists (supports nested paths)
			if (settings.autoCreateFolder) {
				await this.ensureFolderPathExists(folderPath);
			} else {
				const folder = this.app.vault.getAbstractFileByPath(folderPath);
				if (!folder) {
					new Notice(`Folder ${folderPath} does not exist. Please create it first or enable auto-create folder.`);
					return;
				}
			}

			// Generate filename
			const baseFileName = this.generateFileName(fileName, item);
			let finalFileName = baseFileName;
			let filePath = `${folderPath}/${finalFileName}.md`;
			let counter = 1;

			// Check if file already exists and add number if needed
			while (this.app.vault.getAbstractFileByPath(filePath)) {
				finalFileName = `${baseFileName} (${counter})`;
				filePath = `${folderPath}/${finalFileName}.md`;
				counter++;
			}

			// Create file
			await this.app.vault.create(filePath, data);
			new Notice(`Saved: ${finalFileName}.md in ${folderPath}`);

			// Open the created file
            const file = this.app.vault.getAbstractFileByPath(filePath);
            if (file instanceof TFile) {
                await this.app.workspace.getLeaf().openFile(file);
            }

		} catch (error) {
			console.error('Error saving file:', error);
			new Notice('Error saving file. Check console for details.');
		}
	}

	// Generate filename from template
	generateFileName(template: string, item: MediaItem): string {
		let fileName = template;
		
		if ('mal_id' in item) {
			// Anime
			const anime = item as JikanAnime;
			const year = anime.year || 'N/A';
			fileName = fileName.replace(/\{\{title\}\}/g, anime.title);
			fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{title_english\}\}/g, anime.title_english || anime.title);
			fileName = fileName.replace(/\{\{title_japanese\}\}/g, anime.title_japanese || anime.title);
		} else if ('title' in item) {
			// Movie
			const movie = item as TMDBMovie;
			const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
			fileName = fileName.replace(/\{\{title\}\}/g, movie.title);
			fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{original_title\}\}/g, movie.original_title);
		} else {
			// TV Show
			const tvShow = item as TMDBTVShow;
			const year = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A';
			fileName = fileName.replace(/\{\{title\}\}/g, tvShow.name);
			fileName = fileName.replace(/\{\{name\}\}/g, tvShow.name);
			fileName = fileName.replace(/\{\{year\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{year_range\}\}/g, year.toString());
			fileName = fileName.replace(/\{\{original_name\}\}/g, tvShow.original_name);
		}

		// Clean filename for filesystem - more comprehensive cleaning
		fileName = fileName
			.replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
			.replace(/[^\w\s\-().]/g, '') // Keep only alphanumeric, spaces, hyphens, parentheses, dots
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
			.trim();

		// If filename is empty or too short, use a fallback
		if (!fileName || fileName.length < 2) {
			let fallbackName = 'Unknown';
			if ('title' in item) {
				fallbackName = (item as TMDBMovie).title;
			} else if ('name' in item) {
				fallbackName = (item as TMDBTVShow).name;
			} else if ('mal_id' in item) {
				fallbackName = (item as JikanAnime).title;
			}
			fileName = fallbackName.replace(/[<>:"/\\|?*]/g, '').trim();
		}

		return fileName;
	}

	// Determine content type
	private getContentType(item: MediaItem): 'movie' | 'tv' | 'anime' {
		if ('mal_id' in item) {
			return 'anime';
		} else if ('title' in item) {
			return 'movie';
		} else {
			return 'tv';
		}
	}

	// Get default folder for content type
	private getDefaultFolderForContentType(item: MediaItem, settings: any): string {
		const contentType = this.getContentType(item);
		
		// Check if TMDB content is anime
		if (contentType === 'movie' || contentType === 'tv') {
			const tmdbItem = item as TMDBMovie | TMDBTVShow;
			// Simple anime detection based on common anime keywords
			const title = 'title' in tmdbItem ? tmdbItem.title : tmdbItem.name;
			const overview = tmdbItem.overview || '';
			const combinedText = `${title} ${overview}`.toLowerCase();
			
			const animeKeywords = [
				'anime', 'manga', 'otaku', 'shounen', 'shoujo', 'seinen', 'josei',
				'studio ghibli', 'ghibli', 'pokemon', 'dragon ball', 'naruto',
				'one piece', 'attack on titan', 'demon slayer', 'my hero academia',
				'death note', 'fullmetal alchemist', 'spirited away', 'totoro',
				'princess mononoke', 'howl\'s moving castle', 'kiki\'s delivery service'
			];
			
			const isAnime = animeKeywords.some(keyword => combinedText.includes(keyword));
			
			if (isAnime) {
				return settings.rememberLastLocation ? settings.lastUsedAnimeFolder : settings.animeFolder;
			}
		}
		
		switch (contentType) {
			case 'movie':
				return settings.rememberLastLocation ? settings.lastUsedMovieFolder : settings.movieFolder;
			case 'tv':
				return settings.rememberLastLocation ? settings.lastUsedTVFolder : settings.tvFolder;
			case 'anime':
				return settings.rememberLastLocation ? settings.lastUsedAnimeFolder : settings.animeFolder;
		}
	}

	// Show folder selection modal
	private async showFolderSelectionModal(contentType: ContentType, settings: any): Promise<string | null> {
		return new Promise((resolve) => {
			new FolderSelectionModal(this.app, resolve, contentType, settings).open();
		});
	}

	// Ensure a nested folder path exists (creates intermediate folders as needed)
	private async ensureFolderPathExists(folderPath: string): Promise<void> {
		const segments = folderPath.split('/').filter(Boolean);
		let currentPath = '';
		for (const segment of segments) {
			currentPath = currentPath ? `${currentPath}/${segment}` : segment;
			const exists = this.app.vault.getAbstractFileByPath(currentPath);
			if (!exists) {
				await this.app.vault.createFolder(currentPath);
			}
		}
	}
}
