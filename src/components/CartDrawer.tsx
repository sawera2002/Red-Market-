import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CartItem } from '../types';
import { VALID_COUPONS } from '../data/mockProducts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  tipAmount: number;
  setTipAmount: (tip: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  tipAmount,
  setTipAmount,
  onProceedToCheckout,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 35.0;
  
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const discountPercent = appliedCoupon && VALID_COUPONS[appliedCoupon] 
    ? VALID_COUPONS[appliedCoupon].discountPercent 
    : 0;
  const discountAmount = (subtotal * discountPercent) / 100;

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 3.99;
  const tax = subtotal * 0.07; // 7% estimated tax
  const total = Math.max(0, subtotal - discountAmount + deliveryFee + tipAmount + tax);

  const progressToFree = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    if (onApplyCoupon(code)) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid promo code. Try REDDEAL or FRESH10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col justify-between animate-slide-in">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-950">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">Your Grocery Cart</h2>
                <span className="text-xs text-neutral-400">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in basket
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-neutral-500 hover:text-red-400 transition-colors px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="px-5 py-3 bg-neutral-900/90 border-b border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                  <Truck className="w-4 h-4 text-red-500" />
                  {isFreeDelivery ? (
                    <span className="text-emerald-400 font-bold">You unlocked FREE Express Delivery!</span>
                  ) : (
                    <span>
                      Add <strong className="text-red-400">${remainingForFree.toFixed(2)}</strong> for FREE Express
                    </span>
                  )}
                </span>
                <span className="text-neutral-400 font-mono text-[11px] font-bold">
                  ${subtotal.toFixed(2)} / ${FREE_DELIVERY_THRESHOLD}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isFreeDelivery
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-red-600 to-rose-500'
                  }`}
                  style={{ width: `${progressToFree}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-neutral-400 max-w-xs">
                    Explore fresh fruits, crisp vegetables, artisan bread, and pantry favorites.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-xs shadow-lg shadow-red-950"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-neutral-950 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-neutral-400 block">
                      {item.selectedUnit} • ${item.product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-extrabold text-white mt-0.5 block">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-700 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-900/95 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-red-400" />
                      <span className="font-bold text-white">{appliedCoupon}</span>
                      <span className="text-red-300">({discountPercent}% OFF applied)</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-neutral-400 hover:text-white p-1 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. REDDEAL)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-red-600 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-red-600 text-white text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {couponError}
                      </p>
                    )}
                    {/* Quick suggestion tags */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] text-neutral-400">Try:</span>
                      <button
                        onClick={() => handleApplyCoupon('REDDEAL')}
                        className="text-[10px] font-mono font-bold bg-neutral-950 border border-red-900/60 text-red-400 hover:bg-red-950/60 px-2 py-0.5 rounded"
                      >
                        REDDEAL (-20%)
                      </button>
                      <button
                        onClick={() => handleApplyCoupon('FRESH10')}
                        className="text-[10px] font-mono font-bold bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-neutral-700 px-2 py-0.5 rounded"
                      >
                        FRESH10 (-10%)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Courier Tip */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Courier Tip (100% goes to driver):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 2, 4, 6].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipAmount(tip)}
                      className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        tipAmount === tip
                          ? 'bg-red-950 border-red-600 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tip === 0 ? 'No Tip' : `$${tip}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Promo Savings ({appliedCoupon})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span className={isFreeDelivery ? 'text-emerald-400 font-bold' : 'text-white'}>
                    {isFreeDelivery ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Driver Tip</span>
                    <span className="text-white">${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Estimated Total</span>
                  <span className="text-2xl font-black text-white font-['Outfit']">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="proceed-checkout-button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-red-950/80 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="bg-red-900/60 px-2 py-0.5 rounded text-xs">
                  ${total.toFixed(2)}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
