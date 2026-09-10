import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Clock, 
  Heart, 
  X, 
  ChevronDown, 
  Flame, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  wishlistCount: number;
  setIsWishlistOpen: (open: boolean) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  cartItems,
  setIsCartOpen,
  wishlistCount,
  setIsWishlistOpen,
  deliveryAddress,
  setDeliveryAddress,
  onSelectCategory,
}) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAddress.trim()) {
      setDeliveryAddress(tempAddress.trim());
      setIsAddressModalOpen(false);
    }
  };

  const presetAddresses = [
    '742 Evergreen Terrace, Springfield',
    'Penthouse 4B, 880 Broadway, NY',
    '124 Conch Street, Pacific Grove',
  ];

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
        {/* Top Mini Banner */}
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>
            <strong>RED SALE:</strong> 20% OFF all organic greens & wild seafood with code{' '}
            <span className="font-mono font-bold underline cursor-pointer bg-red-900/60 px-1.5 py-0.5 rounded ml-1">
              REDDEAL
            </span>
          </span>
          <span className="hidden sm:inline text-red-200">• Free 30-min express delivery over $35</span>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <div 
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 cursor-pointer group select-none"
              id="brand-logo-button"
            >
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-0.5 shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-extrabold tracking-tight text-white font-['Outfit']">
                    Red<span className="bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">Market</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-red-950 text-red-400 border border-red-800/60">
                    Express
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 tracking-wide font-medium">Farm Fresh & Chef Curated</p>
              </div>
            </div>

            {/* Delivery Location Selector */}
            <button
              id="delivery-location-trigger"
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-900/60 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-500 group-hover:bg-red-900/40 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="max-w-[180px] lg:max-w-[220px]">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                  <span>Deliver to:</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <Clock className="w-3 h-3" /> 25 min
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-200 truncate">{deliveryAddress}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-red-400 transition-colors" />
            </button>

            {/* Search Input Bar */}
            <div className="flex-1 max-w-xl relative mx-2">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="grocery-search-input"
                  type="text"
                  placeholder="Search fresh fruits, salmon, organic milk, sourdough..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900/90 text-neutral-100 placeholder-neutral-500 text-sm rounded-xl pl-10 pr-10 py-2.5 border border-neutral-800 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist & Cart Actions */}
            <div className="flex items-center gap-2.5">
              {/* Wishlist trigger */}
              <button
                id="wishlist-drawer-button"
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-red-900/60 text-neutral-300 hover:text-red-400 transition-colors flex items-center justify-center"
                title="View Favorites"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-red-950">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                id="open-cart-button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-red-950/60 hover:shadow-red-900/80 active:scale-[0.98] transition-all"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-red-600 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                <span className="text-red-100 font-bold ml-1 border-l border-red-400/40 pl-2">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Address modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Choose Delivery Address</h3>
                  <p className="text-xs text-neutral-400">Guaranteed 30-min express fulfillment</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Enter Street Address / Apt / Suite
                </label>
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Springfield"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  autoFocus
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-2">Saved Addresses:</span>
                <div className="space-y-2">
                  {presetAddresses.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTempAddress(preset)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        tempAddress === preset
                          ? 'border-red-600 bg-red-950/30 text-white'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <span>{preset}</span>
                      {tempAddress === preset && <CheckCircle2 className="w-4 h-4 text-red-500" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
