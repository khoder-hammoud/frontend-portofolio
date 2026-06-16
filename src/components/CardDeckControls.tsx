import { motion } from "framer-motion";
import { Shuffle, Grid3x3, LayoutGrid, Layers } from "lucide-react";
import { cardSounds } from "../utils/cardSounds";

interface CardDeckControlsProps {
  onShuffle: () => void;
  viewMode: 'grid' | 'deck' | 'stacked';
  onViewModeChange: (mode: 'grid' | 'deck' | 'stacked') => void;
}

export const CardDeckControls = ({ 
  onShuffle, 
  viewMode, 
  onViewModeChange 
}: CardDeckControlsProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          onShuffle();
          cardSounds.playShuffle();
        }}
        className="px-6 py-3 bg-neon-purple text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors"
      >
        <Shuffle size={16} />
        Shuffle Cards
      </motion.button>

      <div className="flex gap-2 p-1 bg-card-bg border border-app-border rounded-lg">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('grid')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            viewMode === 'grid' 
              ? 'bg-neon-cyan text-black' 
              : 'text-app-text-muted hover:text-app-text'
          }`}
          title="Grid View"
        >
          <Grid3x3 size={16} />
          Grid
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('deck')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            viewMode === 'deck' 
              ? 'bg-neon-cyan text-black' 
              : 'text-app-text-muted hover:text-app-text'
          }`}
          title="Deck View"
        >
          <LayoutGrid size={16} />
          Deck
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewModeChange('stacked')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            viewMode === 'stacked' 
              ? 'bg-neon-cyan text-black' 
              : 'text-app-text-muted hover:text-app-text'
          }`}
          title="Stacked View"
        >
          <Layers size={16} />
          Stack
        </motion.button>
      </div>
    </div>
  );
};
