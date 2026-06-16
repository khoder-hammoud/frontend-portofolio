import { useState } from 'react';
import { Upload, Video, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mediaAPI } from '../services/api';

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const VideoUpload = ({ value, onChange, label = 'Video' }: VideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Video size must be less than 50MB');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const result = await mediaAPI.upload(file, file.name);
      onChange(result.url);
    } catch (err) {
      setError('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const clearVideo = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-app-text-muted uppercase tracking-widest">
          {label}
        </label>
        {value && (
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-[8px] text-neon-cyan uppercase tracking-widest hover:underline"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {value && showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative rounded-lg overflow-hidden border-2 border-neon-cyan/30 bg-card-bg"
          >
            <video
              src={value}
              controls
              className="w-full h-48 object-cover"
              onError={() => setError('Failed to load video')}
            />
            <button
              onClick={clearVideo}
              className="absolute top-2 right-2 p-2 bg-black/80 text-app-text rounded-lg hover:bg-red-500 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 text-[8px] text-neon-cyan uppercase tracking-widest rounded">
              Video Loaded
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        <div className={`
          relative p-8 border-2 border-dashed rounded-lg transition-all
          ${isUploading ? 'border-neon-purple bg-neon-purple/5' : 'border-app-border hover:border-neon-cyan bg-card-bg'}
          ${value ? 'border-neon-cyan/50' : ''}
        `}>
          <div className="flex flex-col items-center gap-4 text-center">
            {isUploading ? (
              <>
                <Loader size={32} className="text-neon-purple animate-spin" />
                <p className="text-[10px] text-neon-purple uppercase tracking-widest font-bold">
                  Uploading & Compressing...
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-neon-cyan/10 flex items-center justify-center">
                  <Upload size={24} className="text-neon-cyan" />
                </div>
                <div>
                  <p className="text-[10px] text-app-text uppercase tracking-widest font-bold mb-1">
                    Click to Upload Video
                  </p>
                  <p className="text-[8px] text-app-text-muted uppercase tracking-widest">
                    MP4, WebM, MOV (Max 50MB) — Auto-compressed
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-[10px] text-red-500 uppercase tracking-widest">
            {error}
          </p>
        </motion.div>
      )}

      <div className="flex items-start gap-2 p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
        <Video size={14} className="text-neon-cyan mt-0.5 flex-shrink-0" />
        <p className="text-[8px] text-app-text-muted leading-relaxed">
          Video is automatically compressed on upload (720p, H.264). Supported formats: MP4, WebM, MOV.
        </p>
      </div>
    </div>
  );
};

export default VideoUpload;
