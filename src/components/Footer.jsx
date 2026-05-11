import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5">
      {/* TOP — Full-width brand manifesto */}
      <div className="border-b border-white/5 py-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-[clamp(3rem,8vw,7rem)] font-bold tracking-tighter text-foreground/10 leading-none mb-4">
              VISIONLUX.
            </h2>
            <p className="text-xl text-foreground/50 tracking-wide">
              See Better. Look Bolder.
            </p>
          </div>
          <div className="md:w-1/3 shrink-0">
            <p className="text-foreground/60 text-lg leading-relaxed font-light">
              We build eyewear for people who see the world differently. Each frame is a declaration — precision-engineered, hand-finished, and impossible to ignore.
            </p>
          </div>
        </div>
      </div>

      {/* MIDDLE — 4-column grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-bold mb-6 tracking-widest text-xs text-foreground uppercase">Shop</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/products" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">All Products</Link></li>
              <li><Link href="/products?category=Sunglasses" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Sunglasses</Link></li>
              <li><Link href="/products?category=Prescription" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Prescription Glasses</Link></li>
              <li><Link href="/products?category=Contact+Lenses" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Contact Lenses</Link></li>
              <li><Link href="/products?category=Accessories" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-6 tracking-widest text-xs text-foreground uppercase">Brand</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Our Story</Link></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Craftsmanship</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Sustainability</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Press</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 tracking-widest text-xs text-foreground uppercase">Support</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Size Guide</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Lens Guide</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Shipping & Returns</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Warranty</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 tracking-widest text-xs text-foreground uppercase">Follow</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Instagram</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">TikTok</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Twitter / X</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">Pinterest</a></li>
              <li><a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm font-medium">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* NEWSLETTER — Email capture */}
      <div className="border-t border-white/5 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Stay in the Loop.</h3>
            <p className="text-foreground/50 font-light">New drops, exclusive offers, and early access.</p>
          </div>
          <form className="flex w-full md:max-w-md" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-card border border-white/10 border-r-0 rounded-l-full px-6 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-r-full text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* BOTTOM — Copyright bar */}
      <div className="border-t border-white/5 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-foreground/50 text-sm">© {new Date().getFullYear()} VisionLux. All rights reserved.</p>
          <div className="hidden md:block w-px h-4 bg-primary/30 rotate-12"></div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm">Terms</a>
            <a href="#" className="text-foreground/50 hover:text-primary transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
