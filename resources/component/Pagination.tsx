import React from "react";

// 1. Define the shape of the pager data from CI4
type PagerData = {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
  get_first: number;
  get_last: number;
};

// 2. Define the component Props (including a callback to change pages)
interface PaginationProps {
  pager?: PagerData;
  onPageChange?: (page: number) => void;
}

function Pagination({ pager, onPageChange }: PaginationProps) {
  if (!pager || pager.total_pages <= 1) return null;

  // Helper to generate the page numbers with dots
  const getPageNumbers = () => {
    const { current_page, total_pages } = pager;
    const pages: (number | string)[] = [];
    const sideItems = 1; // Number of pages to show on each side of current

    for (let i = 1; i <= total_pages; i++) {
      if (
        i === 1 || // Always show first
        i === total_pages || // Always show last
        (i >= current_page - sideItems && i <= current_page + sideItems) // Show neighbors
      ) {
        pages.push(i);
      } else if (
        pages[pages.length - 1] !== "..." // Add dots if not already there
      ) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Total {pager.total_items} Items
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange?.(pager.current_page - 1)}
          className="px-3 py-1.5 text-xs border border-gray-200 dark:border-slate-600 rounded-lg disabled:opacity-40"
          disabled={!pager.has_prev}
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 text-slate-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange?.(page as number)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  pager.current_page === page
                    ? "bg-amber-500 text-white"
                    : "border border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange?.(pager.current_page + 1)}
          className="px-3 py-1.5 text-xs border border-gray-200 dark:border-slate-600 rounded-lg disabled:opacity-40"
          disabled={!pager.has_next}
        >
          Next
        </button>
      </div>
    </div>
  );
}


export default Pagination;
