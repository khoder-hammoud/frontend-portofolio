import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { validateImage, compressImage } from '../utils/imageUpload';
import { mediaAPI } from '../services/api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  compress?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  label = 'Project Image',
  compress = true 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      let fileToUpload: File | Blob = file;

      if (compress && file.size > 500 * 1024) {
        const compressed = await compressImage(file, 1920, 0.7);
        fileToUpload = compressed;
      }

      // Upload to backend (compressed on both client and server)
      const result = await mediaAPI.upload(fileToUpload as File, file.name);
      const url = result.url;
      setPreview(url);
      onChange(url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">
        {label}
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer
          transition-all duration-200 group
          ${isDragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-app-border hover:border-neon-cyan/50'}
          ${preview ? 'aspect-video' : 'aspect-video'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card-bg">
            <Loader className="w-8 h-8 text-neon-cyan animate-spin mb-2" />
            <span className="text-xs text-app-text-muted uppercase tracking-wider">Uploading...</span>
          </div>
        ) : preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="p-3 bg-neon-cyan text-black rounded-lg hover:bg-neon-cyan/80 transition-colors"
              >
                <Upload size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-app-text-muted">
            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-xs font-bold uppercase tracking-wider mb-1">
              {isDragging ? 'Drop image here' : 'Click or drag image'}
            </p>
            <p className="text-[10px] opacity-50 uppercase tracking-wider">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>

      {preview && (
        <div className="flex items-center gap-2 text-[10px] text-app-text-muted">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="uppercase tracking-wider">Image loaded</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
