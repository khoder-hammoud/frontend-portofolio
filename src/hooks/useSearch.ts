import { useState, useEffect, useMemo } from 'react';

interface SearchOptions {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
  minQueryLength?: number;
}

export const useSearch = <T extends Record<string, any>>(
  items: T[],
  options: SearchOptions
) => {
  const {
    query,
    fields = ['title', 'description', 'tags'],
    fuzzy = true,
    caseSensitive = false,
    minQueryLength = 2
  } = options;

  const results = useMemo(() => {
    if (!query || query.length < minQueryLength) {
      return items.map(item => ({ item, score: 1, matches: [] }));
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase();
    
    return items
      .map(item => {
        let score = 0;
        const matches: string[] = [];

        fields.forEach(field => {
          const fieldValue = item[field];
          if (!fieldValue) return;

          const value = caseSensitive ? fieldValue : fieldValue.toString().toLowerCase();
          
          if (value === searchQuery) {
            score += 100;
            matches.push(field);
          } else if (value.startsWith(searchQuery)) {
            score += 50;
            matches.push(field);
          } else if (value.includes(searchQuery)) {
            score += 25;
            matches.push(field);
          } else if (fuzzy) {
            const fuzzyScore = calculateFuzzyScore(searchQuery, value);
            if (fuzzyScore > 0.5) {
              score += fuzzyScore * 10;
              matches.push(field);
            }
          }
        });

        return { item, score, matches };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [items, query, fields, fuzzy, caseSensitive, minQueryLength]);

  return results;
};

const calculateFuzzyScore = (query: string, text: string): number => {
  const queryLength = query.length;
  const textLength = text.length;
  if (queryLength === 0) return 1;
  if (textLength === 0) return 0;
  const matrix: number[][] = [];
  for (let i = 0; i <= textLength; i++) matrix[i] = [i];
  for (let j = 0; j <= queryLength; j++) matrix[0][j] = j;
  for (let i = 1; i <= textLength; i++) {
    for (let j = 1; j <= queryLength; j++) {
      if (text.charAt(i - 1) === query.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return 1 - matrix[textLength][queryLength] / Math.max(queryLength, textLength);
};

export const useDebouncedSearch = <T extends Record<string, any>>(
  items: T[],
  searchOptions: Omit<SearchOptions, 'query'>,
  debounceMs: number = 300
) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const searchResults = useSearch(items, {
    ...searchOptions,
    query: debouncedQuery
  });

  return { query, setQuery, debouncedQuery, results: searchResults, isSearching: query !== debouncedQuery };
};

export const useProjectSearch = (projects: any[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [highlightedResults, setHighlightedResults] = useState<Set<string>>(new Set());

  const searchableProjects = useMemo(() =>
    projects.map(p => ({
      ...p,
      _searchStack: p.stack?.map((t: any) => t.name).join(' ') || ''
    }))
  , [projects]);

  const searchOptions = useMemo(() => ({
    fields: ['title', 'description', '_searchStack', 'subtitle'],
    fuzzy: true,
    caseSensitive: false,
    minQueryLength: 2
  }), []);

  const { results, isSearching } = useDebouncedSearch(searchableProjects, searchOptions, 300);

  const filteredResults = useMemo(() => {
    return results.filter(result => {
      if (selectedTags.length === 0) return true;
      const projectTags = result.item.stack?.map((t: any) => t.name) || [];
      return selectedTags.some(tag => projectTags.some((tech: string) => tech.toLowerCase().includes(tag.toLowerCase())));
    });
  }, [results, selectedTags]);

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    highlightedResults,
    results: filteredResults,
    isSearching,
    clearSearch: () => { setSearchQuery(''); setSelectedTags([]); setHighlightedResults(new Set()); },
    toggleTag: (tag: string) => { setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); }
  };
};

export const useSearchSuggestions = (items: any[], fields: string[] = ['title']) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fieldsKey = fields.join(',');
  useEffect(() => {
    if (!query || query.length < 2) { setSuggestions([]); return; }
    const lowerQuery = query.toLowerCase();
    const allTerms = new Set<string>();
    items.forEach(item => {
      fields.forEach(field => {
        const value = item[field];
        if (typeof value === 'string') {
          value.toLowerCase().split(/\s+/).forEach(word => {
            if (word.includes(lowerQuery) && word !== lowerQuery) allTerms.add(word);
          });
        }
      });
    });
    setSuggestions(Array.from(allTerms).slice(0, 5));
  }, [query, items, fieldsKey]);
  return { query, setQuery, suggestions };
};
