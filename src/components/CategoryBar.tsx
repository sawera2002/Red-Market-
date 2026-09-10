import React from 'react';
import { 
  LayoutGrid, 
  Apple, 
  Carrot, 
  Milk, 
  Croissant, 
  Beef, 
  Package, 
  Coffee, 
  Cookie,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Percent,
  Leaf,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/mockProducts';
import { DietaryFilter, SortOption } from '../types';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  dietaryFilter: DietaryFilter;
  setDietaryFilter: (filter: DietaryFilter) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  totalProductsCount: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  dietaryFilter,
  setDietaryFilter,
  sortBy,
  setSortBy,
  totalProductsCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Apple': return <Apple className="w-4 h-4" />;
      case 'Carrot': return <Carrot className="w-4 h-4" />;
      case 'Milk': return <Milk className="w-4 h-4" />;
      case 'Croissant': return <Croissant className="w-4 h-4" />;
      case 'Beef': return <Beef className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Cookie': return <Cookie className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  const dietaryTabs: { id: DietaryFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'sale', label: 'On Sale', icon: <Percent className="w-3.5 h-3.5 text-red-400" /> },
    { id: 'organic', label: '100% Organic', icon: <Leaf className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'vegan', label: 'Plant Based', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'gluten-free', label: 'Gluten-Free' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Category Pills Row - Scrollable */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500/50 scale-[1.02]'
                  : 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800/80 border border-neutral-800/90 hover:border-neutral-700'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-neutral-400 group-hover:text-red-400'}>
                {getCategoryIcon(cat.iconName)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Filters and Sort Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-y border-neutral-800/80 text-xs">
        {/* Dietary Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-neutral-400 font-semibold flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            Filter:
          </span>
          {dietaryTabs.map((tab) => {
            const isSelected = dietaryFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDietaryFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-red-950/80 border border-red-700 text-red-200 font-semibold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Count & Sort Selector */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-neutral-400 font-medium">
            Showing <strong className="text-white">{totalProductsCount}</strong> items
          </span>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-neutral-900 text-neutral-200 text-xs font-semibold pl-8 pr-7 py-1.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-red-600 cursor-pointer appearance-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <div className="absolute right-2.5 pointer-events-none text-neutral-500 text-[10px]">▼</div>
          </div>
        </div>
      </div>
    </div>
  );
};
