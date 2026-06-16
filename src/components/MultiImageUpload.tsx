import { useState } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

const MultiImageUpload = ({ 
  values, 
  onChange, 
  label = 'Images',
  maxImages = 5 
}: MultiImageUploadProps) => {
  const [newUrl, setNewUrl] = useState('');

  const addUrl = () => {
    if (!newUrl) return;
    if (values.length >= maxImages) return;
    onChange([...values, newUrl]);
    setNewUrl('');
  };

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-app-text-muted uppercase tracking-widest">
          {label} ({values.length}/{maxImages})
        </label>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4">
        {values.map((url, index) => (
          <div
            key={index}
            className="relative aspect-video rounded-lg overflow-hidden border-2 border-app-border group"
          >
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/80 text-app-text rounded hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[8px] text-neon-cyan uppercase tracking-widest rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Add Button */}
        {values.length < maxImages && (
          <div className="aspect-video border-2 border-dashed border-app-border hover:border-neon-cyan rounded-lg flex flex-col items-center justify-center gap-2 bg-card-bg transition-all cursor-pointer">
            <Plus size={24} className="text-app-text-muted" />
            <span className="text-[8px] text-app-text-muted uppercase tracking-widest">
              Add Image
            </span>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted">
            <ImageIcon size={14} />
          </div>
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
            placeholder="PASTE IMAGE URL"
            disabled={values.length >= maxImages}
            className="w-full bg-card-bg border border-app-border pl-10 pr-3 py-3 text-[10px] text-app-text tracking-widest focus:border-neon-cyan focus:ring-0 transition-all disabled:opacity-50"
          />
        </div>
        <button
          onClick={addUrl}
          disabled={!newUrl || values.length >= maxImages}
          className="px-6 py-3 bg-neon-cyan text-black font-black uppercase tracking-widest text-[8px] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MultiImageUpload;
