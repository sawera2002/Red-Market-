import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  tipAmount: number;
  total: number;
  deliveryAddress: string;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discountAmount,
  deliveryFee,
  tipAmount,
  total,
  deliveryAddress,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [address, setAddress] = useState(deliveryAddress);
  const [instructions, setInstructions] = useState('Leave at doorstep, please do not ring doorbell.');
  const [selectedSlot, setSelectedSlot] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [isProcessing, setIsProcessing] = useState(false);

  const deliverySlots = [
    {
      id: 'express',
      title: '⚡ Priority Cold-Chain Express',
      time: 'In 25-35 minutes',
      badge: 'Fastest'
    },
    {
      id: 'evening',
      title: '🌇 Evening Dinner Window',
      time: 'Today 5:30 PM - 7:30 PM',
      badge: 'Popular'
    },
    {
      id: 'tomorrow',
      title: '🌅 Early Morning Fresh Harvest',
      time: 'Tomorrow 8:00 AM - 10:00 AM',
      badge: 'Save 5%'
    }
  ];

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: OrderDetails = {
        orderId: `RM-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...cartItems],
        subtotal,
        discountAmount,
        deliveryFee,
        tipAmount,
        total,
        status: 'confirmed',
        address,
        instructions,
        timeSlot: deliverySlots.find(s => s.id === selectedSlot)?.time || 'In 25-35 minutes',
        paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Cash on Delivery',
        etaMinutes: 28,
      };
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-950">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Express Checkout</h2>
              <p className="text-xs text-neutral-400">Complete your fresh grocery delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Address */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
              <MapPin className="w-4 h-4 text-red-500" />
              1. Delivery Destination
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
              placeholder="Full street address, apartment, suite"
            />
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-neutral-300 focus:outline-none focus:border-red-600"
              placeholder="Special drop-off instructions (gate code, buzzer, etc.)"
            />
          </div>

          {/* Section 2: Delivery Slot */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
              <Clock className="w-4 h-4 text-red-500" />
              2. Delivery Window
            </label>
            <div className="space-y-2">
              {deliverySlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedSlot === slot.id
                      ? 'border-red-600 bg-red-950/30 text-white'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedSlot === slot.id
                          ? 'border-red-500 bg-red-600'
                          : 'border-neutral-600'
                      }`}
                    >
                      {selectedSlot === slot.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{slot.title}</p>
                      <p className="text-[11px] text-neutral-400">{slot.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                    {slot.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
              <CreditCard className="w-4 h-4 text-red-500" />
              3. Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-red-600 bg-red-950/40 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-red-500" />
                <span className="text-xs block">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-red-600 bg-red-950/40 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-red-500" />
                <span className="text-xs block">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-red-600 bg-red-950/40 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-red-500" />
                <span className="text-xs block">Cash / COD</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div>
                  <span className="block text-[10px] text-neutral-400 uppercase font-semibold mb-1">Card Details</span>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white">
                    <span className="font-mono">{cardNumber}</span>
                    <span className="text-neutral-400">{cardExpiry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit encrypted secure checkout</span>
                </div>
              </div>
            )}
          </div>

          {/* Mini Items Summary */}
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-400">
              <span>Items ({cartItems.length}):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>Delivery & Driver Tip:</span>
              <span>${(deliveryFee + tipAmount).toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-white text-sm">
              <span>Grand Total:</span>
              <span className="text-red-400 text-lg">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-red-950/80 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Fresh Order...</span>
              </div>
            ) : (
              <span>Place Grocery Order • ${total.toFixed(2)}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
