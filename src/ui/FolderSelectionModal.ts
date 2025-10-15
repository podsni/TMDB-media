import { App, Modal, Notice } from 'obsidian';
import { ContentType } from '../types';

export class FolderSelectionModal extends Modal {
	private resolve: (value: string | null) => void;
	private contentType: ContentType;
	private settings: any;

	constructor(
		app: App, 
		resolve: (value: string | null) => void, 
		contentType: ContentType,
		settings: any
	) {
		super(app);
		this.resolve = resolve;
		this.contentType = contentType;
		this.settings = settings;
	}

	onOpen() {
		const { contentEl } = this;
		while (contentEl.firstChild) contentEl.removeChild(contentEl.firstChild);

		this.modalEl.classList.add('tmdb-modal', 'tmdb-modal--folder');
		contentEl.classList.add('tmdb-modal-content', 'tmdb-modal-content--folder');

		// Header
		const headerSection = document.createElement('div');
		headerSection.className = 'tmdb-modal-section tmdb-modal-header tmdb-folder-header';
		
		const title = document.createElement('h2');
		title.className = 'tmdb-modal-title';
		const contentTypeText = this.getContentTypeText();
		title.textContent = `Select Save Location for ${contentTypeText}`;
		headerSection.appendChild(title);
		contentEl.appendChild(headerSection);

		// Folder input
		const inputSection = document.createElement('div');
		inputSection.className = 'tmdb-modal-section tmdb-folder-section';

		const inputContainer = document.createElement('div');
		inputContainer.className = 'tmdb-folder-input-container';
		
		const label = document.createElement('label');
		label.textContent = 'Folder Path:';
		label.className = 'tmdb-folder-label';
		inputContainer.appendChild(label);

		const folderInput = document.createElement('input');
		folderInput.type = 'text';
		folderInput.placeholder = 'Enter folder path (e.g., TMDB/Movies, TMDB/TV Shows, TMDB/Anime)';
		const base = (this.settings.defaultFolder || 'TMDB').replace(/\/+$/, '');
		folderInput.value = this.getDefaultFolderPath(base);
		
		folderInput.className = 'tmdb-folder-input';
		inputContainer.appendChild(folderInput);

		inputSection.appendChild(inputContainer);

		// Quick folder buttons (prefix with current base)
		const quickFolders = document.createElement('div');
		quickFolders.className = 'tmdb-quick-folders';
		
		const quickLabel = document.createElement('p');
		quickLabel.textContent = 'Quick Select:';
		quickLabel.className = 'tmdb-quick-label';
		quickFolders.appendChild(quickLabel);

		const quickButtonsContainer = document.createElement('div');
		quickButtonsContainer.className = 'tmdb-quick-buttons';
		
		// Show different quick folders based on content type
		const quickFoldersList = this.getQuickFoldersList(base);
		
		quickFoldersList.forEach(folderName => {
			const button = document.createElement('button');
			button.textContent = folderName;
			button.className = 'tmdb-quick-folder-btn';
			button.addEventListener('click', () => {
				folderInput.value = folderName;
			});
			quickButtonsContainer.appendChild(button);
		});

		quickFolders.appendChild(quickButtonsContainer);
		inputSection.appendChild(quickFolders);
		contentEl.appendChild(inputSection);

		// Action buttons
		const actionsSection = document.createElement('div');
		actionsSection.className = 'tmdb-modal-section tmdb-actions-section';

		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'tmdb-folder-buttons';
		
		// Save button
		const saveButton = document.createElement('button');
		saveButton.textContent = 'Save Here';
		saveButton.className = 'tmdb-save-button';
		buttonContainer.appendChild(saveButton);

		// Cancel button
		const cancelButton = document.createElement('button');
		cancelButton.textContent = 'Cancel';
		cancelButton.className = 'tmdb-close-button';
		buttonContainer.appendChild(cancelButton);

		actionsSection.appendChild(buttonContainer);
		contentEl.appendChild(actionsSection);

		// Event listeners
		saveButton.addEventListener('click', () => {
			const folderPath = folderInput.value.trim();
			if (folderPath) {
				this.resolve(folderPath);
				this.close();
			} else {
				new Notice('Please enter a folder path.');
			}
		});

		cancelButton.addEventListener('click', () => {
			this.resolve(null);
			this.close();
		});

		// Enter key support
		folderInput.addEventListener('keypress', (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				saveButton.click();
			}
		});

		// Focus on input
		folderInput.focus();
		folderInput.select();
	}

	private getContentTypeText(): string {
		switch (this.contentType) {
			case 'movie':
				return 'Movie';
			case 'tv':
				return 'TV Show';
			case 'anime':
				return 'Anime';
			default:
				return 'Media';
		}
	}

	private getDefaultFolderPath(base: string): string {
		switch (this.contentType) {
			case 'movie':
				return this.settings.lastUsedMovieFolder || `${base}/Movies`;
			case 'tv':
				return this.settings.lastUsedTVFolder || `${base}/TV Shows`;
			case 'anime':
				return this.settings.lastUsedAnimeFolder || `${base}/Anime`;
			default:
				return `${base}/Media`;
		}
	}

	private getQuickFoldersList(base: string): string[] {
		switch (this.contentType) {
			case 'movie':
				return [
					`${base}/Movies`, 
					`${base}/Action`, 
					`${base}/Comedy`, 
					`${base}/Drama`, 
					`${base}/Horror`, 
					`${base}/Sci-Fi`, 
					`${base}/Entertainment`, 
					`${base}/Watchlist`
				];
			case 'tv':
				return [
					`${base}/TV Shows`, 
					`${base}/Series`, 
					`${base}/Drama`, 
					`${base}/Comedy`, 
					`${base}/Action`, 
					`${base}/Sci-Fi`, 
					`${base}/Entertainment`, 
					`${base}/Watchlist`
				];
			case 'anime':
				return [
					`${base}/Anime`, 
					`${base}/Shounen`, 
					`${base}/Shoujo`, 
					`${base}/Seinen`, 
					`${base}/Josei`, 
					`${base}/Studio Ghibli`, 
					`${base}/Entertainment`, 
					`${base}/Watchlist`
				];
			default:
				return [
					`${base}/Media`, 
					`${base}/Entertainment`, 
					`${base}/Watchlist`
				];
		}
	}

	onClose() {
		const { contentEl } = this;
		while (contentEl.firstChild) contentEl.removeChild(contentEl.firstChild);
		contentEl.classList.remove('tmdb-modal-content', 'tmdb-modal-content--folder');
		this.modalEl.classList.remove('tmdb-modal', 'tmdb-modal--folder');
	}
}
