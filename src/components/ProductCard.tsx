import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Heart, 
  Star, 
  Eye, 
  Sparkles, 
  Leaf, 
  ShoppingBag,
  Check
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product, unit: string) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  isWishlisted,
  onToggleWishlist,
  onOpenQuickView,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(
    product.unit
  );
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between bg-neutral-900/90 rounded-2xl border border-neutral-800/90 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-950/30 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top badges & Wishlist */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden cursor-pointer"
           onClick={() => onOpenQuickView(product)}>
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark subtle gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Badges container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-extrabold shadow-md shadow-red-950">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold backdrop-blur-xs">
              <Leaf className="w-2.5 h-2.5" /> Organic
            </span>
          )}
          {product.badge && !product.discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-neutral-900/90 border border-neutral-700 text-neutral-200 text-[10px] font-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/60'
              : 'bg-neutral-950/70 hover:bg-neutral-900 text-neutral-400 hover:text-white backdrop-blur-xs border border-white/10'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button Hover trigger */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="px-3.5 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-red-400" />
            Quick View
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Origin & Rating */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span className="truncate max-w-[140px] text-neutral-400 font-medium">{product.origin}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenQuickView(product)}
            className="font-bold text-sm text-neutral-100 group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Unit selection */}
          <div className="mt-1.5 flex items-center gap-1.5">
            {product.availableUnits && product.availableUnits.length > 1 ? (
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] bg-neutral-950 text-neutral-300 rounded-lg px-2 py-1 border border-neutral-800 focus:outline-none focus:border-red-600 cursor-pointer"
              >
                {product.availableUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-[11px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                {product.unit}
              </span>
            )}
            <span className="text-[10px] text-emerald-400 font-medium ml-auto flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> In Stock
            </span>
          </div>
        </div>

        {/* Pricing and Action Button */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white font-['Outfit']">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400 block -mt-0.5">
              ${(product.price * 1.05).toFixed(2)} est. with tax
            </span>
          </div>

          {/* Add to Cart / Quantity Stepper */}
          <div>
            {quantityInCart === 0 ? (
              <button
                id={`add-to-cart-${product.id}`}
                onClick={() => onAddToCart(product, selectedUnit)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/60 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-red-700/60 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  className="w-6 h-6 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white flex items-center justify-center transition-colors active:scale-90"
                  title="Reduce quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center font-bold text-xs text-white">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  className="w-6 h-6 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center transition-colors active:scale-90 shadow-xs"
                  title="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
