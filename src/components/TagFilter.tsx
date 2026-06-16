import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Tag, Filter, Hash } from 'lucide-react';
import { useTags, useTagCloud } from '../hooks/useTags';

interface TagFilterProps {
  items: any[];
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  showCategories?: boolean;
  showTagCloud?: boolean;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({
  items,
  selectedTags: externalSelectedTags,
  onTagsChange,
  showCategories = true,
  showTagCloud = false,
  maxTags = 50,
  placeholder = 'Filter by tags...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const {
    tags,
    categories,
    selectedTags,
    toggleTag,
    toggleCategory,
    selectAllTags,
    clearAllTags,
    selectTagsByCategory,
    getPopularTags,
    getRelatedTags,
    getTagStats,
    searchTags
  } = useTags({
    items,
    tagField: 'tags',
    categoryField: 'category',
    autoGenerate: true
  });

  // Sync with external selected tags
  React.useEffect(() => {
    if (externalSelectedTags !== undefined) {
      // Handle external tag selection
      externalSelectedTags.forEach(tag => {
        if (!selectedTags.includes(tag)) {
          toggleTag(tag);
        }
      });
    }
  }, [externalSelectedTags]);

  // Filter tags based on search and category
  const filteredTags = useMemo(() => {
    let filtered = searchTags(searchQuery);
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(tag => tag.category === activeCategory);
    }
    
    return filtered.slice(0, maxTags);
  }, [tags, searchQuery, activeCategory, maxTags, searchTags]);

  // Get tag cloud data
  const tagCloud = useTagCloud(tags, showTagCloud ? 30 : 0);

  // Get popular tags
  const popularTags = getPopularTags(10);

  const handleTagClick = (tagName: string) => {
    toggleTag(tagName);
    onTagsChange?.(selectedTags.includes(tagName) 
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName]
    );
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
  };

  const handleClearAll = () => {
    clearAllTags();
    onTagsChange?.([]);
  };

  const handleSelectPopular = () => {
    const popularTagNames = popularTags.map(tag => tag.name);
    onTagsChange?.(popularTagNames);
    popularTagNames.forEach(tag => toggleTag(tag));
  };

  const stats = getTagStats();

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-app-border rounded-lg text-xs text-app-text hover:border-neon-cyan transition-all"
      >
        <Filter size={14} />
        <span>Tags</span>
        {selectedTags.length > 0 && (
          <span className="px-2 py-0.5 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded-full text-[10px]">
            {selectedTags.length}
          </span>
        )}
        <ChevronDown 
          size={14} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card-bg border border-app-border rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-app-border">
              {/* Search Input */}
              <div className="relative mb-3">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2 bg-app-bg border border-app-border rounded text-xs text-app-text placeholder:text-app-text-muted focus:border-neon-cyan focus:ring-0"
                />
              </div>

              {/* Categories */}
              {showCategories && (
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      activeCategory === 'all'
                        ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                        : 'bg-app-bg border-app-border text-app-text hover:border-app-border/80'
                    }`}
                  >
                    All ({stats.totalTags})
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all ${
                        activeCategory === category
                          ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                          : 'bg-app-bg border-app-border text-app-text hover:border-app-border/80'
                      }`}
                    >
                      {category} ({tags.filter(t => t.category === category).length})
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectPopular}
                  className="px-3 py-1 text-xs bg-neon-purple/20 border border-neon-purple text-neon-purple rounded hover:bg-neon-purple/30 transition-all"
                >
                  Popular
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1 text-xs bg-app-border/50 text-app-text-muted hover:text-app-text rounded transition-all"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Tag Cloud */}
            {showTagCloud && tagCloud.length > 0 && (
              <div className="p-4 border-b border-app-border">
                <div className="flex flex-wrap gap-2">
                  {tagCloud.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className={`px-3 py-1 rounded-full border transition-all ${tag.color} ${
                        selectedTags.includes(tag.name)
                          ? 'ring-2 ring-neon-cyan ring-offset-1 ring-offset-card-bg'
                          : 'hover:scale-105'
                      } ${tag.size}`}
                      style={{ opacity: 0.7 + tag.weight * 0.3 }}
                    >
                      {tag.name}
                      {tag.count && (
                        <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags List */}
            <div className="max-h-64 overflow-y-auto p-4">
              {filteredTags.length === 0 ? (
                <div className="text-center py-8">
                  <Tag size={24} className="mx-auto text-app-text-muted mb-2" />
                  <p className="text-xs text-app-text-muted">
                    No tags found
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all ${tag.color} ${
                        selectedTags.includes(tag.name)
                          ? 'ring-2 ring-neon-cyan ring-offset-1 ring-offset-card-bg'
                          : 'hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      {tag.name}
                      {tag.count && (
                        <span className="ml-1 opacity-70">({tag.count})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-app-border bg-app-bg/50">
              <div className="flex items-center justify-between text-[10px] text-app-text-muted">
                <span>{stats.filteredItems} of {stats.totalItems} items</span>
                <span>{selectedTags.length} tags selected</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTags.map(tagName => {
            const tag = tags.find(t => t.name === tagName);
            return (
              <span
                key={tagName}
                className={`px-3 py-1 text-xs rounded-full border flex items-center gap-1 ${tag?.color || 'bg-app-bg border-app-border text-app-text'}`}
              >
                {tagName}
                <button
                  onClick={() => handleTagClick(tagName)}
                  className="hover:text-app-text transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
