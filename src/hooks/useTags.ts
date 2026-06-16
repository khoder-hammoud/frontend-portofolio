import { useState, useMemo } from 'react';

interface Tag {
  id: string;
  name: string;
  category: string;
  count?: number;
  color?: string;
}

interface UseTagsOptions {
  items: any[];
  tagField?: string;
  categoryField?: string;
  autoGenerate?: boolean;
}

export const useTags = ({
  items,
  tagField = 'tags',
  categoryField = 'category',
  autoGenerate = true
}: UseTagsOptions) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Generate tags from items
  const allTags = useMemo(() => {
    if (!autoGenerate) return [];

    const tagMap = new Map<string, Tag>();
    
    items.forEach(item => {
      const tags = item[tagField] || [];
      const category = item[categoryField] || 'Uncategorized';
      
      tags.forEach((tag: string) => {
        const existingTag = tagMap.get(tag);
        if (existingTag) {
          tagMap.set(tag, {
            ...existingTag,
            count: (existingTag.count || 0) + 1
          });
        } else {
          tagMap.set(tag, {
            id: tag.toLowerCase().replace(/\s+/g, '-'),
            name: tag,
            category,
            count: 1,
            color: generateTagColor(tag)
          });
        }
      });
    });

    return Array.from(tagMap.values()).sort((a, b) => b.count! - a.count!);
  }, [items, tagField, categoryField, autoGenerate]);

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(allTags.map(tag => tag.category));
    return Array.from(categorySet).sort();
  }, [allTags]);

  // Filter items by selected tags and categories
  const filteredItems = useMemo(() => {
    if (selectedTags.length === 0 && selectedCategories.length === 0) {
      return items;
    }

    return items.filter(item => {
      const itemTags = item[tagField] || [];
      const itemCategory = item[categoryField] || 'Uncategorized';

      const hasSelectedTag = selectedTags.length === 0 || 
        selectedTags.some(selectedTag => itemTags.includes(selectedTag));

      const hasSelectedCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(itemCategory);

      return hasSelectedTag && hasSelectedCategory;
    });
  }, [items, selectedTags, selectedCategories, tagField, categoryField]);

  // Tag management functions
  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectAllTags = () => {
    setSelectedTags(allTags.map(tag => tag.name));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
    setSelectedCategories([]);
  };

  const selectTagsByCategory = (category: string) => {
    const categoryTags = allTags
      .filter(tag => tag.category === category)
      .map(tag => tag.name);
    
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      categoryTags.forEach(tag => newTags.add(tag));
      return Array.from(newTags);
    });
  };

  const getPopularTags = (limit: number = 10) => {
    return allTags
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, limit);
  };

  const getRelatedTags = (tagName: string, limit: number = 5) => {
    const targetTag = allTags.find(tag => tag.name === tagName);
    if (!targetTag) return [];

    const itemsWithTag = items.filter(item => 
      (item[tagField] || []).includes(tagName)
    );

    const relatedTagCounts = new Map<string, number>();
    
    itemsWithTag.forEach(item => {
      const tags = item[tagField] || [];
      tags.forEach((tag: string) => {
        if (tag !== tagName) {
          relatedTagCounts.set(tag, (relatedTagCounts.get(tag) || 0) + 1);
        }
      });
    });

    return Array.from(relatedTagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name]) => allTags.find(tag => tag.name === name))
      .filter(Boolean) as Tag[];
  };

  // Get tag statistics
  const getTagStats = () => {
    return {
      totalTags: allTags.length,
      selectedTags: selectedTags.length,
      totalCategories: categories.length,
      selectedCategories: selectedCategories.length,
      filteredItems: filteredItems.length,
      totalItems: items.length
    };
  };

  // Search tags
  const searchTags = (query: string) => {
    if (!query) return allTags;
    
    const lowerQuery = query.toLowerCase();
    return allTags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery) ||
      tag.category.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    // Data
    tags: allTags,
    categories,
    filteredItems,
    selectedTags,
    selectedCategories,
    
    // Actions
    toggleTag,
    toggleCategory,
    selectAllTags,
    clearAllTags,
    selectTagsByCategory,
    
    // Utilities
    getPopularTags,
    getRelatedTags,
    getTagStats,
    searchTags
  };
};

// Generate consistent colors for tags
const generateTagColor = (tagName: string): string => {
  const colors = [
    'bg-blue-500/20 border-blue-500 text-blue-400',
    'bg-green-500/20 border-green-500 text-green-400',
    'bg-purple-500/20 border-purple-500 text-purple-400',
    'bg-pink-500/20 border-pink-500 text-pink-400',
    'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    'bg-cyan-500/20 border-cyan-500 text-cyan-400',
    'bg-red-500/20 border-red-500 text-red-400',
    'bg-indigo-500/20 border-indigo-500 text-indigo-400',
    'bg-orange-500/20 border-orange-500 text-orange-400',
    'bg-teal-500/20 border-teal-500 text-teal-400'
  ];

  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

// Hook for tag cloud visualization
export const useTagCloud = (tags: Tag[], maxTags: number = 20) => {
  const tagCloud = useMemo(() => {
    const sortedTags = tags
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, maxTags);

    const maxCount = Math.max(...sortedTags.map(tag => tag.count || 0));
    const minCount = Math.min(...sortedTags.map(tag => tag.count || 0));

    return sortedTags.map(tag => ({
      ...tag,
      size: calculateTagSize(tag.count || 0, minCount, maxCount),
      weight: calculateTagWeight(tag.count || 0, maxCount)
    }));
  }, [tags, maxTags]);

  return tagCloud;
};

const calculateTagSize = (count: number, min: number, max: number): string => {
  if (max === min) return 'text-base';
  
  const ratio = (count - min) / (max - min);
  if (ratio < 0.2) return 'text-xs';
  if (ratio < 0.4) return 'text-sm';
  if (ratio < 0.6) return 'text-base';
  if (ratio < 0.8) return 'text-lg';
  return 'text-xl';
};

const calculateTagWeight = (count: number, max: number): number => {
  return max > 0 ? count / max : 0;
};
