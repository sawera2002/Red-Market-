import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Package, 
  Truck, 
  ShoppingBag, 
  X, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { OrderDetails } from '../types';

interface OrderTrackerModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [etaMinutes, setEtaMinutes] = useState<number>(order.etaMinutes || 28);

  // Auto-tick ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 5 ? prev - 1 : prev));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      title: 'Order Confirmed',
      desc: 'Received & routed to local farm depot',
      time: 'Just now',
      icon: CheckCircle2
    },
    {
      title: 'Personal Shopper Picking',
      desc: 'Elena R. is hand-selecting your produce in chilled aisles',
      time: '12 mins ago',
      icon: Package
    },
    {
      title: 'Sealed & Quality Inspected',
      desc: 'Packed into thermal chilled coolers',
      time: 'ETA 15 mins',
      icon: ShieldCheck
    },
    {
      title: 'Courier En Route',
      desc: 'Marcus D. (Toyota Prius • Plate #7RED49)',
      time: 'Arriving soon',
      icon: Truck
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-950">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Live Delivery Tracker</h2>
                <span className="font-mono text-xs text-red-400 bg-red-950 border border-red-800/60 px-2 py-0.5 rounded">
                  {order.orderId}
                </span>
              </div>
              <p className="text-xs text-neutral-400">Real-time GPS dispatch & cold-chain status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live ETA Card with Red Gradient Glow */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-neutral-900 to-neutral-950 border border-red-800/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Guaranteed Cold-Chain Delivery
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Estimated Arrival in <span className="text-red-400">{etaMinutes} mins</span>
              </h3>
              <p className="text-xs text-neutral-300">
                To: <strong className="text-white">{order.address}</strong>
              </p>
            </div>

            {/* Courier quick info card */}
            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                MD
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Marcus D.</span>
                <span className="text-[10px] text-neutral-400 block">⭐️ 4.98 • White Prius</span>
              </div>
              <button
                onClick={() => alert("Calling courier Marcus D. at (555) 019-2834")}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white transition-colors"
                title="Call Courier"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Progression */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Fulfillment Status
              </h4>
              <button
                onClick={() => setCurrentStep((prev) => (prev < 4 ? prev + 1 : 1))}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
              >
                Simulate Next Step (Step {currentStep}/4)
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                const IconComponent = step.icon;

                return (
                  <div
                    key={step.title}
                    className={`p-3.5 rounded-xl border flex items-center gap-4 transition-all ${
                      isCurrent
                        ? 'bg-red-950/40 border-red-600/80 text-white shadow-md shadow-red-950/40'
                        : isCompleted
                        ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                        : 'bg-neutral-950/30 border-neutral-900 text-neutral-600 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isCurrent
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-950'
                          : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{step.title}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ordered Items Receipt */}
          <div className="border-t border-neutral-800 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Receipt & Bag Contents ({order.items.length} items)
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-950/80 border border-neutral-800/80"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    <div>
                      <span className="font-semibold text-white block">{item.product.name}</span>
                      <span className="text-[10px] text-neutral-400">
                        {item.selectedUnit} × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Savings</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Delivery</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Driver Tip</span>
                <span>${order.tipAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-sm text-white">
                <span>Total Paid</span>
                <span className="text-red-400 font-extrabold text-base">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-neutral-950 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950 transition-all"
          >
            Done • Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
