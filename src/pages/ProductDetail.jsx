import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { products } from "@/data/products";
import { Star, ChevronRight, Check, Shield, Package, RotateCcw, Minus, Plus, ShoppingBag, Heart, ArrowRight, Zap, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import GlassesViewer3D from "@/components/GlassesViewer3D";
import ProductCard from "@/components/ProductCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getColorHex = (color) => {
  const c = color.toLowerCase();
  if (c.includes("black")) return "#0a0a0a";
  if (c.includes("gold")) return "#D4AF37";
  if (c.includes("silver")) return "#C0C0C0";
  if (c.includes("tortoise")) return "#6b4c1a";
  if (c.includes("green")) return "#2d5a27";
  if (c.includes("blue")) return "#2563eb";
  if (c.includes("rose")) return "#e8a4a4";
  if (c.includes("clear")) return "rgba(255,255,255,0.25)";
  if (c.includes("gunmetal")) return "#555555";
  if (c.includes("bone") || c.includes("white")) return "#e8e0d0";
  if (c.includes("midnight")) return "#191970";
  if (c.includes("saddle")) return "#8B4513";
  if (c.includes("amber")) return "#FFBF00";
  if (c.includes("mirror")) return "#aab8c2";
  if (c.includes("matte")) return "#1a1a1a";
  if (c.includes("brushed")) return "#c9a632";
  if (c.includes("sapphire")) return "#0f52ba";
  if (c.includes("emerald")) return "#046307";
  if (c.includes("hazel")) return "#8E7618";
  return "#808080";
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const pageRef = useRef(null);
  const viewerRef = useRef(null);
  const detailsRef = useRef(null);
  const featuresRef = useRef(null);
  const relatedRef = useRef(null);

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // ─── GSAP Scroll Animations ───
  useEffect(() => {
    if (!product) return;

    const ctx = gsap.context(() => {
      // Breadcrumb reveal
      const breadcrumb = pageRef.current?.querySelector(".breadcrumb");
      if (breadcrumb) {
        gsap.fromTo(breadcrumb,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
        );
      }

      // Viewer section: sticky parallax
      if (viewerRef.current) {
        gsap.to(viewerRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: viewerRef.current,
            start: "top 100px",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Details section: staggered slide-in
      if (detailsRef.current) {
        const detailEls = detailsRef.current.querySelectorAll(".detail-reveal");
        gsap.fromTo(detailEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8, stagger: 0.08,
            ease: "power3.out", delay: 0.3,
          }
        );
      }

      // Features section: staggered reveal on scroll
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll(".feature-card");
        gsap.fromTo(featureCards,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.6, stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Related products: staggered reveal
      if (relatedRef.current) {
        const relatedCards = relatedRef.current.querySelectorAll(".related-card");
        gsap.fromTo(relatedCards,
          { y: 40, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.7, stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: relatedRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

    }, pageRef);

    return () => ctx.revert();
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 rounded-full glass-panel mx-auto mb-8 flex items-center justify-center">
          <Eye className="w-10 h-10 text-primary/50" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Product Not Found</h1>
        <p className="text-foreground/40 mb-8 font-sans font-light text-lg">This piece doesn't exist in our collection.</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 font-sans">
          Browse Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    toast({ title: "Added to cart", description: `${quantity}× ${product.name} has been added to your cart.` });
  };

  const thumbnails = ["Front", "Side", "3/4", "Detail"];

  return (
    <div ref={pageRef} className="w-full overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed top-[20%] right-[-15%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)", filter: "blur(80px)" }} />

      <div className="container mx-auto px-6 py-8 relative z-10">

        {/* ═══════ BREADCRUMB ═══════ */}
        <div className="breadcrumb flex items-center gap-2 text-sm text-foreground/35 mb-10 font-sans font-medium">
          <Link href="/" className="hover:text-primary transition-colors duration-300">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary transition-colors duration-300">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/70">{product.name}</span>
        </div>

        {/* ═══════ MAIN GRID ═══════ */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">

          {/* ─── LEFT: Product Viewer ─── */}
          <div className="space-y-5" ref={viewerRef}>
            <div className="sticky top-28">
              {/* Main viewer */}
              <div className="glass-panel rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8 relative group gold-glow-hover transition-shadow duration-700">
                {/* Ambient gradient */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)" }} />
                <GlassesViewer3D size="product" />
                {/* Corner accent */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-lg pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-lg pointer-events-none" />
              </div>

              {/* Thumbnail strip */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {thumbnails.map((angle, i) => (
                  <button
                    key={angle}
                    onClick={() => setActiveThumb(i)}
                    className={`glass-panel rounded-xl aspect-square flex items-center justify-center cursor-pointer transition-all duration-400 relative overflow-hidden ${
                      activeThumb === i
                        ? "border-primary/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        : "hover:border-white/15"
                    }`}
                  >
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] font-sans transition-colors duration-300 ${
                      activeThumb === i ? "text-primary" : "text-foreground/30"
                    }`}>{angle}</span>
                    {activeThumb === i && (
                      <motion.div
                        layoutId="thumb-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Product Details ─── */}
          <div ref={detailsRef} className="flex flex-col justify-center">
            {/* Category badge */}
            <p className="detail-reveal text-[10px] font-bold tracking-[0.35em] text-primary uppercase mb-4 font-sans inline-flex items-center gap-2 self-start">
              <span className="w-6 h-[1px] bg-primary" />
              {product.category}
            </p>

            {/* Title */}
            <h1 className="detail-reveal text-4xl md:text-6xl font-bold tracking-tighter mb-5 leading-[0.95]">
              {product.name}<span className="text-primary">.</span>
            </h1>

            {/* Price + Rating row */}
            <div className="detail-reveal flex items-center gap-5 mb-8">
              <p className="text-3xl font-mono font-bold text-foreground">${product.price}</p>
              <div className="w-px h-7 bg-white/10" />
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-foreground/15'}`} />
                ))}
                <span className="text-sm font-bold text-primary ml-1.5 font-sans">{product.rating}</span>
                <span className="text-foreground/35 text-sm ml-1 font-sans">({product.reviewCount})</span>
              </div>
            </div>

            {/* Description */}
            <p className="detail-reveal text-lg text-foreground/55 leading-relaxed mb-10 font-sans font-light max-w-lg">
              {product.description}
            </p>

            {/* ─── Color Selector ─── */}
            <div className="detail-reveal space-y-8 mb-10">
              <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex justify-between items-center font-sans">
                  <span className="text-foreground/60">Color</span>
                  <span className="text-primary/70">{selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.colors.map(color => {
                    const isSelected = selectedColor === color;
                    const hex = getColorHex(color);
                    return (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center relative ${
                          isSelected
                            ? "border-primary shadow-[0_0_15px_rgba(212,175,55,0.25)] scale-110"
                            : "border-white/10 hover:border-white/25"
                        }`}
                        style={{ backgroundColor: hex }}
                        title={color}
                      >
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                              <Check className={`w-5 h-5 ${
                                color.toLowerCase().includes('white') || color.toLowerCase().includes('bone') || color.toLowerCase().includes('clear')
                                  ? 'text-black' : 'text-white'
                              }`} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* Ring indicator */}
                        {isSelected && (
                          <div className="absolute -inset-1 rounded-full border border-primary/40 pointer-events-none" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ─── Size Selector ─── */}
              {product.sizes.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex justify-between items-center font-sans">
                    <span className="text-foreground/60">Size</span>
                    <a href="#" className="text-primary/60 hover:text-primary text-[10px] tracking-[0.2em] transition-colors">Size Guide →</a>
                  </h3>
                  <div className="flex gap-3">
                    {product.sizes.map(size => {
                      const isSelected = selectedSize === size;
                      return (
                        <motion.button
                          key={size}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedSize(size)}
                          className={`flex-1 py-4 rounded-xl border font-bold text-sm transition-all duration-300 font-sans relative overflow-hidden ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                              : "glass-panel hover:border-primary/25 text-foreground/70"
                          }`}
                        >
                          {size}
                          {isSelected && (
                            <motion.div
                              layoutId="size-indicator"
                              className="absolute inset-0 bg-primary rounded-xl -z-10"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ─── Add to Cart Bar ─── */}
            <div className="detail-reveal flex gap-3 mb-10">
              {/* Quantity */}
              <div className="flex items-center glass-panel rounded-xl overflow-hidden h-14 flex-shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-foreground/50 hover:text-primary hover:bg-white/[0.03] transition-all duration-300"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold font-mono text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-foreground/50 hover:text-primary hover:bg-white/[0.03] transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-sm rounded-xl h-14 hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-3 font-sans shine-sweep relative overflow-hidden hover:shadow-xl hover:shadow-primary/30"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  isWishlisted
                    ? "bg-primary/10 border border-primary/30 text-primary"
                    : "glass-panel text-foreground/40 hover:text-primary hover:border-primary/20"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-primary" : ""}`} />
              </motion.button>
            </div>

            {/* ─── Trust Badges ─── */}
            <div className="detail-reveal grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.06]">
              {[
                { icon: Shield, label: "Lifetime Warranty", sub: "2-year full coverage" },
                { icon: Package, label: "Free Shipping", sub: "On orders over $100" },
                { icon: RotateCcw, label: "30-Day Returns", sub: "No questions asked" },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center gap-2 group cursor-default">
                  <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-shadow duration-500">
                    <badge.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground/70 font-sans tracking-wide">{badge.label}</span>
                  <span className="text-[10px] text-foreground/30 font-sans hidden md:block">{badge.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ PRODUCT FEATURES ═══════ */}
        <section ref={featuresRef} className="mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-bold tracking-tighter text-foreground/[0.012] pointer-events-none whitespace-nowrap select-none">DETAILS</div>

          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.35em] text-primary uppercase mb-3 font-sans">Craftsmanship</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Why This Piece<span className="text-primary">.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Zap,
                title: "Featherlight Build",
                description: "Engineered from aerospace-grade titanium and bio-acetate. You'll forget you're wearing them."
              },
              {
                icon: Shield,
                title: "Uncompromising Protection",
                description: "Multi-layered UV400 coating, anti-scratch, and hydrophobic finish. Built to endure."
              },
              {
                icon: Eye,
                title: "Precision Optics",
                description: "Carl Zeiss-grade lenses with distortion-free clarity. Every detail in perfect focus."
              },
            ].map((feature) => (
              <div key={feature.title} className="feature-card glass-panel rounded-2xl p-8 text-center group hover:border-primary/15 transition-all duration-500 gold-glow-hover cursor-default">
                <div className="w-14 h-14 rounded-full glass-panel mx-auto mb-6 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-shadow duration-500">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-sm text-foreground/40 font-sans font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ RELATED PRODUCTS ═══════ */}
        {relatedProducts.length > 0 && (
          <section ref={relatedRef} className="mb-16 relative">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-bold tracking-[0.35em] text-primary uppercase mb-3 font-sans">You May Also Like</p>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Complete the Look<span className="text-primary">.</span></h2>
              </div>
              <Link href="/products" className="text-primary hover:text-primary/80 font-bold tracking-wider uppercase text-xs border-b border-primary pb-1 inline-flex items-center gap-2 font-sans">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="related-card">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
