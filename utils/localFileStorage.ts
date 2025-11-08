import { toast } from "sonner";

export interface LocalFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: string;
  noteId: string;
}

class LocalFileStorage {
  private readonly STORAGE_KEY = 'bits_dashboard_files';
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB total

  // Get all files for a specific note
  getFiles(noteId: string): LocalFile[] {
    try {
      const allFiles = this.getAllFiles();
      return allFiles.filter(file => file.noteId === noteId);
    } catch (error) {
      console.error('Error getting files:', error);
      return [];
    }
  }

  // Get all files from localStorage
  private getAllFiles(): LocalFile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored files:', error);
      return [];
    }
  }

  // Save all files to localStorage
  private saveAllFiles(files: LocalFile[]): void {
    try {
      const dataString = JSON.stringify(files);
      const dataSize = new Blob([dataString]).size;
      
      if (dataSize > this.MAX_STORAGE_SIZE) {
        throw new Error('Storage quota exceeded. Please delete some files.');
      }
      
      localStorage.setItem(this.STORAGE_KEY, dataString);
    } catch (error) {
      console.error('Error saving files:', error);
      if (error.name === 'QuotaExceededError') {
        throw new Error('Browser storage is full. Please delete some files.');
      }
      throw new Error('Failed to save files to local storage');
    }
  }

  // Upload a file and store it locally as base64
  async uploadFile(file: File, noteId: string): Promise<LocalFile> {
    try {
      console.log('Uploading file to local storage:', file.name);
      
      // Check storage space
      const currentSize = this.getStorageSize();
      if (currentSize + file.size > this.MAX_STORAGE_SIZE) {
        throw new Error(`Storage quota exceeded. Current: ${Math.round(currentSize / (1024 * 1024))}MB, File: ${Math.round(file.size / (1024 * 1024))}MB, Limit: ${Math.round(this.MAX_STORAGE_SIZE / (1024 * 1024))}MB`);
      }

      // Generate unique ID
      const id = this.generateId();

      // Convert file to base64 for storage
      const base64Data = await this.fileToBase64(file);

      // Create local file object
      const localFile: LocalFile = {
        id,
        name: file.name,
        type: file.type,
        size: file.size,
        url: base64Data,
        uploadDate: new Date().toISOString(),
        noteId
      };

      // Add to existing files
      const allFiles = this.getAllFiles();
      allFiles.push(localFile);
      this.saveAllFiles(allFiles);

      console.log(`File "${file.name}" stored locally successfully`);
      return localFile;
    } catch (error) {
      console.error('Error uploading file to local storage:', error);
      throw error;
    }
  }

  // Delete a file
  deleteFile(fileId: string): boolean {
    try {
      const allFiles = this.getAllFiles();
      const filteredFiles = allFiles.filter(file => file.id !== fileId);
      
      if (filteredFiles.length === allFiles.length) {
        return false; // File not found
      }

      this.saveAllFiles(filteredFiles);
      console.log('File deleted from local storage');
      return true;
    } catch (error) {
      console.error('Error deleting file from local storage:', error);
      return false;
    }
  }

  // Download a file
  downloadFile(file: LocalFile): void {
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloaded "${file.name}" from local storage`);
    } catch (error) {
      console.error('Error downloading file from local storage:', error);
      throw new Error('Failed to download file');
    }
  }

  // Convert file to base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get current storage size
  private getStorageSize(): number {
    try {
      const allFiles = this.getAllFiles();
      return allFiles.reduce((total, file) => total + file.size, 0);
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return 0;
    }
  }

  // Get storage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const used = this.getStorageSize();
      const available = this.MAX_STORAGE_SIZE - used;
      const percentage = (used / this.MAX_STORAGE_SIZE) * 100;

      return {
        used,
        available: Math.max(0, available),
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: this.MAX_STORAGE_SIZE, percentage: 0 };
    }
  }

  // Check if storage is available
  isAvailable(): boolean {
    try {
      const testKey = 'storage_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('Local storage not available:', error);
      return false;
    }
  }

  // Clear all files
  clearAllFiles(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('All files cleared from local storage');
    } catch (error) {
      console.error('Error clearing files from local storage:', error);
      throw new Error('Failed to clear files');
    }
  }
}

// Export singleton instance
export const localFileStorage = new LocalFileStorage();