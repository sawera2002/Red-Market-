import React from 'react';
import { ChefHat, Clock, Users, Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { MealBundle, Product } from '../types';
import { MEAL_BUNDLES } from '../data/mockProducts';

interface MealBundlesProps {
  products: Product[];
  onAddBundleToCart: (bundle: MealBundle) => void;
}

export const MealBundles: React.FC<MealBundlesProps> = ({
  products,
  onAddBundleToCart,
}) => {
  const getBundleProducts = (productIds: string[]) => {
    return productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  };

  const calculateBundlePrice = (productIds: string[], discountPercent: number) => {
    const bundleItems = getBundleProducts(productIds);
    const originalTotal = bundleItems.reduce((acc, item) => acc + item.price, 0);
    const discountedTotal = originalTotal * (1 - discountPercent / 100);
    return { originalTotal, discountedTotal };
  };

  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-red-500 font-bold text-xs uppercase tracking-wider mb-1">
            <ChefHat className="w-4 h-4" />
            <span>Chef Curated Grocery Kits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cook Tonight: All-in-One Bundles
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Everything measured and paired to perfection. Save up to 18% when ordering bundled ingredients.
          </p>
        </div>
      </div>

      {/* Grid of bundles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MEAL_BUNDLES.map((bundle) => {
          const bundleProducts = getBundleProducts(bundle.productIds);
          const { originalTotal, discountedTotal } = calculateBundlePrice(
            bundle.productIds,
            bundle.discount
          );

          return (
            <div
              key={bundle.id}
              className="group flex flex-col justify-between bg-neutral-900/90 rounded-2xl border border-neutral-800 hover:border-red-600/60 shadow-xl hover:shadow-red-950/40 transition-all duration-300 overflow-hidden"
            >
              {/* Image & Header */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Savings Pill */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs shadow-md shadow-red-950">
                  SAVE {bundle.discount}%
                </div>

                {/* Quick Meta */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center gap-3 text-[11px] text-neutral-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-400" />
                    {bundle.prepTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-red-400" />
                    {bundle.serves}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-red-400 transition-colors">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {bundle.description}
                  </p>

                  {/* Included Ingredients list */}
                  <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Includes {bundleProducts.length} Items:
                    </span>
                    <ul className="space-y-1">
                      {bundleProducts.map((item) => (
                        <li key={item.id} className="flex items-center gap-1.5 text-xs text-neutral-300">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          <span className="text-[10px] text-neutral-500 ml-auto flex-shrink-0">
                            {item.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing & 1-Click Action */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white font-['Outfit']">
                        ${discountedTotal.toFixed(2)}
                      </span>
                      <span className="text-xs text-neutral-500 line-through">
                        ${originalTotal.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Save ${(originalTotal - discountedTotal).toFixed(2)} bundle deal
                    </span>
                  </div>

                  <button
                    onClick={() => onAddBundleToCart(bundle)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-950/60 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Get Bundle</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
