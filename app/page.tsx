'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/lib/types';
import { Leaf, Flame, Clock, Truck, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .order('price', { ascending: false })
        .limit(6);
      setFeaturedItems(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="bg-mandala">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/9316203/pexels-photo-9316203.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center pt-20 pb-32">
          <div className="animate-fade-in-up">
            <Badge className="mb-4 bg-accent/90 text-accent-foreground hover:bg-accent">
              <Award className="h-3 w-3 mr-1" />
              Authentic Indian Cuisine Since 1998
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Taste the Soul of <span className="text-gradient-saffron">India</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              From aromatic biryanis to crispy dosas, every dish at Taj Restaurant
              is crafted with tradition, passion, and the finest spices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base h-12 px-8">
                <Link href="/menu">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base h-12 px-8 bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                <Link href="/menu">
                  View Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Award, value: '25+', label: 'Years of Excellence' },
                { icon: Truck, value: '30 min', label: 'Average Delivery' },
                { icon: Leaf, value: '50+', label: 'Vegetarian Options' },
                { icon: Flame, value: '100+', label: 'Dishes on Menu' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <stat.icon className="h-6 w-6 text-primary mb-1" />
                  <span className="font-serif text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Chef's Special</Badge>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">
              Featured Dishes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most loved dishes, crafted by master chefs and adored by thousands of customers.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden card-hover border-border/50">
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <UtensilsPlaceholder />
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
                  </div>
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-xl font-semibold text-foreground">{item.name}</h3>
                      <span className="font-serif text-lg font-bold text-primary whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pb-5">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/menu">View Menu</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link href="/menu">
                View Full Menu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent">
        <div className="mx-auto max-w-5xl text-center">
          <Truck className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Fast & Fresh Delivery
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Hot, fresh food delivered to your doorstep in 30 minutes or less.
            Free delivery on orders above ₹500.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>30 min avg delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Free over ₹500</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>100% satisfaction</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UtensilsPlaceholder() {
  return (
    <div className="text-muted-foreground/40">
      <UtensilsIcon />
    </div>
  );
}

function UtensilsIcon() {
  return (
    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v7c0 1.1.9 2 2 2h0a2 2 0 002-2V3M5 3v18M14 3v18M14 3v7c0 1.1.9 2 2 2h0a2 2 0 002-2V3" />
    </svg>
  );
}
