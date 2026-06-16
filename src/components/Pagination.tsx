import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-8 py-6 border-t border-app-border bg-card-bg">
      <div className="text-[10px] text-app-text-muted uppercase tracking-widest">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-app-border text-app-text-muted hover:text-neon-cyan hover:border-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-app-text-muted disabled:hover:border-app-border transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-[10px] text-app-text-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                currentPage === page
                  ? 'bg-neon-cyan text-black border border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'border border-app-border text-app-text-muted hover:text-neon-cyan hover:border-neon-cyan'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-app-border text-app-text-muted hover:text-neon-cyan hover:border-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-app-text-muted disabled:hover:border-app-border transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="text-[10px] text-app-text-muted uppercase tracking-widest">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
