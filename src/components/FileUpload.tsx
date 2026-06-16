import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadAPI, API_URL } from '../services/api';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number;
  currentImage?: string;
}

export const FileUpload = ({ 
  onUploadComplete, 
  accept = "image/*,video/*",
  maxSize = 50 * 1024 * 1024, // 50MB
  currentImage 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const result = await uploadAPI.single(file);
      const fullUrl = `${API_URL}${result.url}`;
      
      onUploadComplete(fullUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      
      {!preview ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-app-border rounded-lg cursor-pointer hover:border-neon-cyan transition-colors"
        >
          <Upload className="w-8 h-8 text-app-text-muted mb-2" />
          <span className="text-sm text-app-text-muted">Click to upload</span>
          <span className="text-xs text-app-text-muted mt-1">Max {maxSize / (1024 * 1024)}MB</span>
        </label>
      ) : (
        <div className="relative w-full h-32 border-2 border-app-border rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          {!uploading && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader className="w-8 h-8 text-neon-cyan animate-spin" />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};
