'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { MenuItem, OrderItem } from '@/lib/types';
import { Leaf, Flame, Truck, Clock, ShoppingCart, Plus, Minus, X, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MenuPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true })
        .order('price', { ascending: true });
      if (!error && data) setItems(data);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, [items]);

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const cartItems: OrderItem[] = useMemo(() => {
    return Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = items.find((i) => i.id === id);
        return { name: item!.name, price: item!.price, quantity: qty };
      });
  }, [cart, items]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }
    if (!address.trim() || !phone.trim()) {
      toast.error('Please provide delivery address and phone number');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);
    const { data, error } = await supabase
      .from('orders')
      .insert({
        items: cartItems,
        total: cartTotal,
        delivery_address: address,
        delivery_phone: phone,
      })
      .select('id')
      .single();

    setPlacing(false);

    if (error) {
      toast.error('Failed to place order. Please try again.');
      return;
    }

    setOrderPlaced(data.id);
    setCart({});
    setAddress('');
    setPhone('');
    setCartOpen(false);
  };

  return (
    <div className="bg-mandala min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-7xl text-center">
          <Badge className="mb-3 bg-secondary text-secondary-foreground">Fresh & Authentic</Badge>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Our Menu & Delivery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Browse our full selection of dishes, add to cart, and get it delivered hot to your door.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              Free delivery over ₹500
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              30 min average
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              100% fresh ingredients
            </div>
          </div>
        </div>
      </section>

      {/* Order Success */}
      {orderPlaced && (
        <div className="mx-auto max-w-2xl px-4 mt-8">
          <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/30">
            <CardContent className="pt-6 flex items-start gap-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Order Placed Successfully!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your order #{orderPlaced.slice(0, 8)} has been received. We'll deliver it to you in approximately 30 minutes.
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setOrderPlaced(null)}>
                  Continue Browsing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Tabs */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border py-3 px-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex-1 overflow-x-auto">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="h-auto flex-wrap">
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm whitespace-nowrap">
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button className="relative shrink-0">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-serif text-2xl">Your Order</SheetTitle>
              </SheetHeader>

              {!user && (
                <div className="px-4 py-3 bg-muted/50 rounded-lg mx-4 mt-4 text-sm text-muted-foreground">
                  You need to be logged in to place an order.{' '}
                  <Link href="/login" className="text-primary font-medium underline">Login</Link> or{' '}
                  <Link href="/register" className="text-primary font-medium underline">Register</Link>.
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
                    <p>Your cart is empty</p>
                    <p className="text-xs mt-1">Add some delicious dishes!</p>
                  </div>
                ) : (
                  cartItems.map((ci) => {
                    const menuItem = items.find((i) => i.name === ci.name);
                    const itemId = menuItem?.id || '';
                    return (
                      <div key={ci.name} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{ci.name}</p>
                          <p className="text-xs text-muted-foreground">₹{ci.price} × {ci.quantity} = ₹{ci.price * ci.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => removeFromCart(itemId)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{ci.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => addToCart(itemId)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{cartTotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">{cartTotal >= 500 ? 'FREE' : '₹40'}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold">Total</span>
                    <span className="font-serif text-lg font-bold text-primary">
                      ₹{cartTotal + (cartTotal >= 500 ? 0 : 40)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="addr" className="text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Delivery Address
                      </Label>
                      <Textarea
                        id="addr"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full delivery address"
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 ..."
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={placing || !user}>
                    {placing ? 'Placing Order...' : `Place Order — ₹${cartTotal + (cartTotal >= 500 ? 0 : 40)}`}
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <Card key={item.id} className="overflow-hidden card-hover border-border/50 flex flex-col">
                    <div className="relative h-44 overflow-hidden bg-muted">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <span className="font-serif text-3xl text-primary/40">{item.category[0]}</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        {item.is_veg ? (
                          <Badge className="bg-green-600 text-white hover:bg-green-600">
                            <Leaf className="h-3 w-3 mr-1" /> Veg
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white hover:bg-red-600">
                            <Flame className="h-3 w-3 mr-1" /> Non-Veg
                          </Badge>
                        )}
                      </div>
                      {item.is_featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground">{item.name}</h3>
                        <span className="font-serif text-lg font-bold text-primary whitespace-nowrap">
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2 flex-1">
                        {item.description}
                      </p>
                      <div className="mt-4">
                        {qty === 0 ? (
                          <Button variant="outline" className="w-full" onClick={() => addToCart(item.id)}>
                            <Plus className="h-4 w-4 mr-1" /> Add to Cart
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between rounded-lg border border-border p-1">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium text-sm">{qty} in cart</span>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => addToCart(item.id)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
