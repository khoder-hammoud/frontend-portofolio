import { motion } from "framer-motion";

interface CardSuitFilterProps {
  selectedSuit: string;
  onSuitChange: (suit: string) => void;
}

const suits = [
  { id: 'all', label: 'All Cards', symbol: '🃏', color: 'text-app-text' },
  { id: 'featured', label: 'Featured', symbol: '★', color: 'text-neon-purple' },
  { id: 'fullstack', label: 'Full Stack', symbol: '♠', color: 'text-white' },
  { id: 'frontend', label: 'Frontend', symbol: '♥', color: 'text-red-500' },
  { id: 'backend', label: 'Backend', symbol: '♦', color: 'text-neon-cyan' },
  { id: 'other', label: 'Other', symbol: '♣', color: 'text-green-500' },
];

export const CardSuitFilter = ({ selectedSuit, onSuitChange }: CardSuitFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {suits.map((suit) => (
        <motion.button
          key={suit.id}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSuitChange(suit.id)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            selectedSuit === suit.id
              ? 'bg-neon-cyan text-black border-neon-cyan'
              : 'bg-card-bg text-app-text-muted border-app-border hover:border-neon-cyan/50'
          }`}
        >
          <span className={`text-xl mr-2 ${suit.color}`}>{suit.symbol}</span>
          <span className="text-xs font-black uppercase tracking-widest">
            {suit.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};
