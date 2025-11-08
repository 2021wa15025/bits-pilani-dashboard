import { useState, useEffect } from "react";
import { Download, Trash2, Eye, File, Image, FileText, ExternalLink, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { supabaseStorage, type SupabaseFile } from "../utils/supabase/storage";
import { localFileStorage, type LocalFile } from "../utils/localFileStorage";

interface FileManagerProps {
  noteId: string;
  files: (SupabaseFile | LocalFile)[];
  onFilesChange: (files: (SupabaseFile | LocalFile)[]) => void;
  className?: string;
}

export function FileManager({ noteId, files, onFilesChange, className = "" }: FileManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Handle ESC key for fullscreen image
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenImage) {
        setFullscreenImage(null);
      }
    };

    if (fullscreenImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [fullscreenImage]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType === 'application/pdf') return FileText;
    if (fileType.includes('document') || fileType.includes('word')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (fileId: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to delete file:', fileId);
      
      // Find the file to get its name/path
      const fileToDelete = files.find(f => f.id === fileId);
      if (!fileToDelete) {
        throw new Error('File not found');
      }

      let deleteSuccess = false;

      // Check if it's a local file (starts with 'local_')
      if (fileId.startsWith('local_')) {
        console.log('Deleting file from local storage:', fileId);
        deleteSuccess = localFileStorage.deleteFile(fileId);
      } else {
        // Supabase file - extract filename from URL or use stored filename
        let fileName = fileToDelete.name;
        if (fileToDelete.url.includes('/object/public/files/')) {
          // Extract the full path from the public URL
          const urlParts = fileToDelete.url.split('/object/public/files/');
          if (urlParts.length > 1) {
            fileName = urlParts[1];
          }
        } else {
          // Construct the expected file path
          fileName = `${noteId}/${fileName}`;
        }

        console.log('Deleting file from Supabase Storage:', fileName);
        deleteSuccess = await supabaseStorage.deleteFile(fileName);
      }
      
      if (!deleteSuccess) {
        throw new Error('Failed to delete file from storage');
      }

      // Update local state immediately for better UX
      const updatedFiles = files.filter(file => file.id !== fileId);
      onFilesChange(updatedFiles);
      
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(`Failed to delete file: ${error.message}`);
      
      // If delete failed, don't update the local state
      // The file will remain visible
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (file: SupabaseFile | LocalFile) => {
    try {
      console.log('Downloading file:', file.name, file.id);
      
      // Check if it's a local file
      if (file.id.startsWith('local_')) {
        localFileStorage.downloadFile(file as LocalFile);
      } else {
        // Use Supabase storage download method
        supabaseStorage.downloadFile(file as SupabaseFile);
      }
      
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
      
      // Fallback: try to open in new tab (only for Supabase files)
      if (!file.id.startsWith('local_')) {
        try {
          window.open(file.url, '_blank', 'noopener,noreferrer');
        } catch (fallbackError) {
          console.error('Fallback download also failed:', fallbackError);
        }
      }
    }
  };

  const handlePreview = (file: any) => {
    if (file.type.startsWith('image/')) {
      // For images, ALWAYS use fullscreen viewer - NO DIALOG
      console.log('Opening fullscreen image:', file.url);
      handleImageClick(file.url);
    } else {
      // For non-image files, download them directly
      handleDownload(file);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    console.log('Image clicked, opening fullscreen:', imageUrl);
    
    // Test if the image URL is accessible
    const testImage = document.createElement('img');
    testImage.onload = () => {
      console.log('Image URL is accessible:', imageUrl);
      setFullscreenImage(imageUrl);
    };
    testImage.onerror = () => {
      console.error('Image URL is not accessible:', imageUrl);
      // Try different URL variations
      const variations = [
        imageUrl,
        imageUrl.replace('/functions/v1/make-server-917daa5d/', '/storage/v1/object/public/'),
        `https://${projectId}.supabase.co/storage/v1/object/public/files/${imageUrl.split('/').pop()}`,
        `https://${projectId}.supabase.co/storage/v1/object/sign/files/${imageUrl.split('/').pop()}?token=${publicAnonKey}`
      ];
      
      console.log('Trying image URL variations:', variations);
      
      // For now, just show the fullscreen anyway - user can see the error
      setFullscreenImage(imageUrl);
    };
    testImage.src = imageUrl;
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <File className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No files attached</p>
      </div>
    );
  }

  // Debug logging
  console.log('FileManager: Rendering files:', files);
  files.forEach(file => {
    console.log(`File: ${file.name}, URL: ${file.url}, Type: ${file.type}`);
  });

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => {
          const Icon = getFileIcon(file.type);
          const isImage = file.type.startsWith('image/');
          
          return (
            <Card key={file.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* File Preview/Icon */}
                  <div className="aspect-square rounded-lg bg-muted overflow-hidden relative">
                    {isImage ? (
                      <>
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => handleImageClick(file.url)}
                          loading="lazy"
                          onLoad={() => console.log('Thumbnail loaded:', file.name)}
                          onError={(e) => {
                            console.error('Thumbnail load error:', file.name, file.url);
                            console.error('Full file object:', file);
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full items-center justify-center flex-col hidden absolute inset-0 bg-muted">
                          <Icon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground text-center px-2">
                            Failed to load
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Fallback for broken images */}
                    {isImage && (
                      <div className="w-full h-full items-center justify-center hidden">
                        <Icon className="h-12 w-12 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground mt-2">Image failed to load</p>
                      </div>
                    )}
                    
                    {/* Hover overlay for non-images */}
                    {!isImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center cursor-pointer"
                           onClick={() => handlePreview(file)}>
                        <Eye className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isImage ? handleImageClick(file.url) : handlePreview(file)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isImage ? 'View' : 'Open'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="z-[9999] !bg-white border border-gray-300 shadow-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete File</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{file.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(file.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-[99999] flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onLoad={() => {
                console.log('Fullscreen image loaded successfully:', fullscreenImage);
              }}
              onError={(e) => {
                console.error('Fullscreen image load error:', fullscreenImage);
                // Show a fallback or error message
                const img = e.currentTarget;
                img.style.display = 'none';
                
                // Create error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'text-white text-center p-8';
                errorDiv.innerHTML = `
                  <div class="mb-4">
                    <svg class="mx-auto h-16 w-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium mb-2">Image failed to load</h3>
                  <p class="text-sm text-white/70 mb-4">The image could not be displayed. This might be due to:</p>
                  <ul class="text-sm text-white/70 mb-4 text-left max-w-md">
                    <li>• Network connection issues</li>
                    <li>• Invalid or expired image URL</li>
                    <li>• Server configuration problems</li>
                  </ul>
                  <p class="text-xs text-white/50 break-all">${fullscreenImage}</p>
                `;
                
                img.parentElement?.appendChild(errorDiv);
              }}
            />
            
            {/* Close hint */}
            <div className="absolute top-4 right-4 text-white/70 text-sm">
              Press ESC or click outside to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}