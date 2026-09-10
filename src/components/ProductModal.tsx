import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Leaf, 
  MapPin, 
  Clock, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Heart, 
  Flame, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, unit: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(product.unit);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedUnit, quantity);
    onClose();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Close & Wishlist Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-700/60 transition-colors"
            title="Share item"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleWishlist(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              isWishlisted
                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-900'
                : 'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.discountPercent && (
                  <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs shadow-md shadow-red-950">
                    -{product.discountPercent}% OFF
                  </span>
                )}
                {product.isOrganic && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold">
                    <Leaf className="w-3 h-3" /> 100% Certified Organic
                  </span>
                )}
              </div>
            </div>

            {/* Right: Summary Info */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Harvested in {product.origin}</span>
                </div>

                <h2 className="text-2xl font-extrabold text-white leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-neutral-500">({product.reviewCount} customer reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-['Outfit']">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 font-medium ml-1">
                    / {selectedUnit}
                  </span>
                </div>

                {/* Unit selector */}
                {product.availableUnits && product.availableUnits.length > 1 && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                      Select Package Size:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.availableUnits.map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setSelectedUnit(u)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                            selectedUnit === u
                              ? 'bg-red-950 border-red-600 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shelf life & freshness guarantee */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span><strong>Shelf Life:</strong> {product.shelfLife}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Freshness or free replacement guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Product Overview
            </h4>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Nutrition Facts */}
          {product.nutrition && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Nutritional Facts (Per Serving)
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="block text-base font-extrabold text-white">
                    {product.nutrition.calories}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase">Calories</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="block text-base font-extrabold text-white">
                    {product.nutrition.protein}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase">Protein</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="block text-base font-extrabold text-white">
                    {product.nutrition.carbs}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase">Carbs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="block text-base font-extrabold text-white">
                    {product.nutrition.fat}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase">Fats</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with quantity stepper and add to cart */}
        <div className="p-4 sm:p-6 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-400 uppercase hidden sm:inline">Qty:</span>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 max-w-xs py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Add to Cart</span>
            <span className="bg-red-900/60 px-2 py-0.5 rounded text-xs">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
