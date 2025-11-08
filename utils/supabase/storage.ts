import { projectId, publicAnonKey } from './info';

export interface SupabaseFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: string;
  noteId: string;
}

class SupabaseStorageClient {
  private readonly baseUrl: string;
  private readonly storageUrl: string;
  private readonly bucket = 'files';

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co`;
    this.storageUrl = `${this.baseUrl}/storage/v1`;
  }

  // Get authorization headers
  private getHeaders(contentType?: string): HeadersInit {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${publicAnonKey}`,
    };
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    return headers;
  }

  // Upload file to Supabase Storage
  async uploadFile(file: File, noteId: string): Promise<SupabaseFile> {
    try {
      const fileName = `${noteId}/${Date.now()}_${file.name}`;
      
      console.log('Uploading to Supabase Storage:', fileName);
      
      // Upload file to storage bucket
      const uploadResponse = await fetch(
        `${this.storageUrl}/object/${this.bucket}/${fileName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': file.type,
            'x-upsert': 'true'
          },
          body: file
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Storage upload error:', uploadResponse.status, errorText);
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload successful:', uploadResult);

      // Get public URL for the uploaded file
      const publicUrl = this.getPublicUrl(fileName);

      // Create file metadata
      const fileMetadata: SupabaseFile = {
        id: uploadResult.Id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: publicUrl,
        uploadDate: new Date().toISOString(),
        noteId
      };

      // Store file metadata (you might want to store this in a database table)
      await this.storeFileMetadata(fileMetadata);

      return fileMetadata;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  // Get public URL for a file
  getPublicUrl(fileName: string): string {
    return `${this.storageUrl}/object/public/${this.bucket}/${fileName}`;
  }

  // Get signed URL for private files
  async getSignedUrl(fileName: string, expiresIn = 3600): Promise<string> {
    try {
      const response = await fetch(
        `${this.storageUrl}/object/sign/${this.bucket}/${fileName}`,
        {
          method: 'POST',
          headers: {
            ...this.getHeaders('application/json'),
          },
          body: JSON.stringify({ expiresIn })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get signed URL: ${response.status}`);
      }

      const result = await response.json();
      return `${this.baseUrl}${result.signedURL}`;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
  }

  // Delete file from storage
  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.storageUrl}/object/${this.bucket}/${fileName}`,
        {
          method: 'DELETE',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error:', response.status, errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Download file
  downloadFile(file: SupabaseFile): void {
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloaded "${file.name}"`);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }

  // List files for a note
  async listFiles(noteId: string): Promise<SupabaseFile[]> {
    try {
      console.log('Listing files for note:', noteId);
      
      // List objects in the note's folder
      const response = await fetch(
        `${this.storageUrl}/object/list/${this.bucket}?prefix=${noteId}/`,
        {
          method: 'POST',
          headers: this.getHeaders('application/json'),
          body: JSON.stringify({
            limit: 100,
            offset: 0
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('List files error:', response.status, errorText);
        
        // If the folder doesn't exist, return empty array
        if (response.status === 404) {
          return [];
        }
        
        throw new Error(`Failed to list files: ${response.status} ${errorText}`);
      }

      const files = await response.json();
      console.log('Raw file list:', files);

      // Convert to SupabaseFile format
      const supabaseFiles: SupabaseFile[] = files
        .filter((file: any) => file.name && !file.name.endsWith('/')) // Filter out folders
        .map((file: any) => ({
          id: file.id || file.name,
          name: file.name.split('/').pop() || file.name, // Get filename without path
          type: this.getMimeType(file.name),
          size: file.metadata?.size || 0,
          url: this.getPublicUrl(file.name),
          uploadDate: file.created_at || file.updated_at || new Date().toISOString(),
          noteId
        }));

      console.log('Processed files:', supabaseFiles);
      return supabaseFiles;
    } catch (error) {
      console.error('Error listing files:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  }

  // Store file metadata (in a real app, you'd store this in a database table)
  private async storeFileMetadata(file: SupabaseFile): Promise<void> {
    try {
      // For now, we'll store metadata in localStorage as a backup
      const existingMetadata = this.getStoredMetadata();
      existingMetadata.push(file);
      localStorage.setItem('supabase_file_metadata', JSON.stringify(existingMetadata));
    } catch (error) {
      console.error('Error storing file metadata:', error);
    }
  }

  // Get stored metadata
  private getStoredMetadata(): SupabaseFile[] {
    try {
      const stored = localStorage.getItem('supabase_file_metadata');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored metadata:', error);
      return [];
    }
  }

  // Get MIME type from filename
  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'md': 'text/markdown'
    };
    
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  // Check if storage is accessible
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.storageUrl}/object/list/${this.bucket}`, {
        method: 'POST',
        headers: this.getHeaders('application/json'),
        body: JSON.stringify({ limit: 1 })
      });
      
      return response.ok || response.status === 404; // 404 is OK (empty bucket)
    } catch (error) {
      console.error('Storage connection check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const supabaseStorage = new SupabaseStorageClient();