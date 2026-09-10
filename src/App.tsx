import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Flame, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  PhoneCall, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Heart,
  Store,
  Layers,
  Award
} from 'lucide-react';
import { Product, CartItem, DietaryFilter, SortOption, MealBundle, OrderDetails } from './types';
import { MOCK_PRODUCTS, VALID_COUPONS } from './data/mockProducts';
import { Navbar } from './components/Navbar';
import { PromoBanner } from './components/PromoBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { MealBundles } from './components/MealBundles';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { WishlistModal } from './components/WishlistModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // State: Cart with persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('redmarket_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial cart for a great first-time impression
    return [
      { product: MOCK_PRODUCTS[0], quantity: 1, selectedUnit: '2 lb bag' },
      { product: MOCK_PRODUCTS[1], quantity: 2, selectedUnit: 'Pack of 3' },
    ];
  });

  // State: Wishlist with persistence
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('redmarket_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [MOCK_PRODUCTS[2], MOCK_PRODUCTS[4]];
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('redmarket_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('redmarket_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Filters and navigation
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Springfield');

  // Drawers and Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);

  // Cart configuration
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('REDDEAL');
  const [tipAmount, setTipAmount] = useState<number>(4);

  // Floating Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product, unit?: string, quantity: number = 1) => {
    const selectedUnit = unit || product.unit;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, selectedUnit }
            : item
        );
      }
      return [...prev, { product, quantity, selectedUnit }];
    });
    addToast(`Added to basket`, `${quantity}x ${product.name}`);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cartItems.find((i) => i.product.id === productId);
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast(`Removed from basket`, item.product.name, 'info');
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    addToast('Basket cleared', undefined, 'info');
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('Removed from favorites', product.name, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('Saved to favorites', product.name, 'success');
    }
  };

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    const normalized = code.toUpperCase();
    if (VALID_COUPONS[normalized]) {
      setAppliedCoupon(normalized);
      addToast(`Promo applied!`, `${VALID_COUPONS[normalized].description}`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Promo removed', undefined, 'info');
  };

  // 1-Click Meal Bundle add
  const handleAddBundleToCart = (bundle: MealBundle) => {
    const bundleProducts = bundle.productIds
      .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    setCartItems((prev) => {
      let updated = [...prev];
      bundleProducts.forEach((prod) => {
        const idx = updated.findIndex((i) => i.product.id === prod.id);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        } else {
          updated.push({ product: prod, quantity: 1, selectedUnit: prod.unit });
        }
      });
      return updated;
    });

    addToast(`Bundle Added!`, `Added all items for ${bundle.title}`);
    setIsCartOpen(true);
  };

  // Order Completed
  const handleOrderSuccess = (order: OrderDetails) => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    setActiveOrder(order);
    addToast('Order Placed Successfully!', `Order ${order.orderId} dispatched`);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesOrigin = product.origin.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesOrigin) return false;
      }

      // Dietary filter
      if (dietaryFilter === 'organic' && !product.isOrganic) return false;
      if (dietaryFilter === 'vegan' && !product.isVegan) return false;
      if (dietaryFilter === 'gluten-free' && !product.isGlutenFree) return false;
      if (dietaryFilter === 'sale' && !product.discountPercent) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return 0; // featured
    });
  }, [selectedCategory, searchQuery, dietaryFilter, sortBy]);

  // Subtotal for checkout calculations
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discountPercent = appliedCoupon && VALID_COUPONS[appliedCoupon] 
    ? VALID_COUPONS[appliedCoupon].discountPercent 
    : 0;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const isFreeDelivery = cartSubtotal >= 35;
  const deliveryFee = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : 3.99;
  const tax = cartSubtotal * 0.07;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee + tipAmount + tax);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlist.length}
        setIsWishlistOpen={setIsWishlistOpen}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        onSelectCategory={setSelectedCategory}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Flash Deals Hero Banner with Red Gradient */}
        <PromoBanner
          onApplyPromo={(code) => handleApplyCoupon(code)}
          onFilterDeals={() => {
            setDietaryFilter('sale');
            setSelectedCategory('all');
          }}
          onFilterOrganic={() => {
            setDietaryFilter('organic');
            setSelectedCategory('all');
          }}
        />

        {/* Categories, Dietary & Sorting Controls */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          dietaryFilter={dietaryFilter}
          setDietaryFilter={setDietaryFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalProductsCount={filteredProducts.length}
        />

        {/* Product Catalog Grid */}
        <section id="products-grid-section">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-neutral-900/60 rounded-3xl border border-neutral-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No grocery items found</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing the active filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setDietaryFilter('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-red-950"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const itemInCart = cartItems.find((item) => item.product.id === product.id);
                const isWishlisted = wishlist.some((p) => p.id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantityInCart={itemInCart ? itemInCart.quantity : 0}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenQuickView={setQuickViewProduct}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Meal Bundles & Kits Section */}
        <MealBundles
          products={MOCK_PRODUCTS}
          onAddBundleToCart={handleAddBundleToCart}
        />

        {/* Trust Badges Banner */}
        <section className="my-12 p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800/90 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-950">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">30-Min Cold Chain Delivery</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Insulated thermal containers and dry-ice packaging guarantee meat, dairy, and ice cream arrive frost-cold.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-950">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">100% Freshness Guarantee</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  If any avocado, peach, or leafy green isn’t picture-perfect, get an instant 1-click refund or replacement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-red-950">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Direct From Local Farms</h4>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  We partner directly with family orchards and sustainable fisheries to cut middleman transit by 72 hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800/80 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-950">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xl font-extrabold text-white font-['Outfit']">
                  Red<span className="text-red-500">Market</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Reinventing everyday groceries with local farm partnerships, strict organic curation, and lightning 30-minute delivery.
              </p>
              <div className="pt-2 text-xs text-red-400 font-medium">
                Customer Support: 24/7 Hotline • (800) RED-FARM
              </div>
            </div>

            {/* Aisles links */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-neutral-300 mb-3">
                Fresh Aisles
              </h5>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button onClick={() => setSelectedCategory('fruits')} className="hover:text-white transition-colors">
                    Organic Fruits & Berries
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('vegetables')} className="hover:text-white transition-colors">
                    Farm Fresh Veggies & Greens
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('meat')} className="hover:text-white transition-colors">
                    Grass-Fed Meat & Wild Seafood
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('dairy')} className="hover:text-white transition-colors">
                    Pasture Milk & Artisan Cheese
                  </button>
                </li>
              </ul>
            </div>

            {/* Perks */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-neutral-300 mb-3">
                Special Services
              </h5>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>30-Min Priority Cold Chain</li>
                <li>Chef-Curated Weekly Meal Kits</li>
                <li>RedMarket Harvest Subscription</li>
                <li>Zero-Waste Returnable Bags</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-neutral-300">
                Farm Harvest Alerts
              </h5>
              <p className="text-xs text-neutral-400">
                Get notified when seasonal delicacies like Rainier cherries and White Truffles arrive.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast('Subscribed!', 'You are now on the harvest drop list.');
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Enter email address"
                  required
                  className="bg-neutral-900 border border-neutral-800 text-xs rounded-xl px-3 py-2 text-white placeholder-neutral-500 flex-1 focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-950 hover:from-red-500 hover:to-rose-500 transition-all"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
            <span>© 2026 RedMarket Grocery Inc. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>California Harvest Standards</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        tipAmount={tipAmount}
        setTipAmount={setTipAmount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={
          quickViewProduct
            ? wishlist.some((p) => p.id === quickViewProduct.id)
            : false
        }
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        deliveryFee={deliveryFee}
        tipAmount={tipAmount}
        total={grandTotal}
        deliveryAddress={deliveryAddress}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      {/* Wishlist Drawer/Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => {
          setWishlist((prev) => prev.filter((p) => p.id !== id));
          addToast('Removed from favorites', undefined, 'info');
        }}
        onAddToCart={handleAddToCart}
        onClearWishlist={() => {
          setWishlist([]);
          addToast('Cleared all favorites', undefined, 'info');
        }}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
