import Link from 'next/link';
import { UtensilsCrossed, MapPin, Phone, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold block leading-none">Taj</span>
                <span className="text-[10px] uppercase tracking-widest text-background/60">Restaurant</span>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Serving authentic Indian and South Indian cuisine since 1998. Taste the tradition in every bite.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-accent transition-colors">Menu & Delivery</Link></li>
              <li><Link href="/login" className="hover:text-accent transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-accent transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>123 MG Road, Hyderabad, Telangana 500001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Open Daily<br />11:00 AM – 11:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-sm text-background/70">
              Free delivery on orders above ₹500!
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 text-center text-sm text-background/50">
          © {new Date().getFullYear()} Taj Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
