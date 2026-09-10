import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles, ShieldCheck, Truck, ArrowRight, Copy, Check } from 'lucide-react';

interface PromoBannerProps {
  onApplyPromo: (code: string) => void;
  onFilterDeals: () => void;
  onFilterOrganic: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onApplyPromo,
  onFilterDeals,
  onFilterOrganic
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('REDDEAL');
    setCopied(true);
    onApplyPromo('REDDEAL');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative overflow-hidden my-6 rounded-3xl bg-neutral-900 border border-red-950/80 shadow-2xl">
      {/* Red ambient gradient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side Content */}
        <div className="max-w-xl text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-600/40 text-red-400 text-xs font-bold tracking-wide">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            <span>FLASH HARVEST DEALS</span>
            <span className="w-1 h-1 rounded-full bg-red-400" />
            <span>SAVE UP TO 35%</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Crisp, Farm-Fresh Groceries{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              Delivered in 30 Mins.
            </span>
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Hand-selected morning harvest, wild seafood, artisan bakery goods, and organic pantry staples packed in temperature-controlled chill boxes right to your doorstep.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onFilterDeals}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-950/80 hover:shadow-red-800/40 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>Shop Today’s Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onFilterOrganic}
              className="px-5 py-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-red-900 font-semibold text-sm transition-all"
            >
              Explore 100% Organic
            </button>
          </div>
        </div>

        {/* Right Side Flash Card & Countdown */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <div className="relative p-6 sm:p-7 rounded-2xl bg-neutral-950/90 border border-red-800/40 shadow-2xl space-y-5 max-w-sm mx-auto">
            {/* Countdown Badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-500" />
                Special Offer Ends In:
              </span>
              <span className="px-2 py-0.5 text-[11px] font-extrabold bg-red-600/20 text-red-400 border border-red-600/30 rounded-md">
                LIVE
              </span>
            </div>

            {/* Timer Digits */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
                <span className="block font-mono text-2xl font-bold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Hours</span>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
                <span className="block font-mono text-2xl font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Mins</span>
              </div>
              <div className="bg-neutral-900 border border-red-950/60 p-2.5 rounded-xl bg-gradient-to-b from-neutral-900 to-red-950/30">
                <span className="block font-mono text-2xl font-bold text-red-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-red-400/80 uppercase tracking-wider">Secs</span>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/60 to-neutral-900 border border-red-800/50 flex items-center justify-between gap-3">
              <div>
                <span className="block text-[11px] text-neutral-400 font-medium">Flash Promo Code</span>
                <span className="font-mono text-base font-extrabold tracking-wider text-white">REDDEAL</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow transition-all flex items-center gap-1.5 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Apply 20%</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500" />
                <span>30-min express</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                <span>100% Fresh guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
