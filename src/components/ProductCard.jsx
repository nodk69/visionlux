import { Link } from "wouter";
import Tilt from "react-parallax-tilt";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, ArrowRight, Zap, Shield, Eye, Droplets } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect, useCallback } from "react";

const getFeatures = (category) => {
  switch (category) {
    case "Sunglasses":
      return [
        { icon: Zap, label: "UV400 Protection" },
        { icon: Shield, label: "Polarized Lenses" },
        { icon: Star, label: "24k Gold Accents" },
      ];
    case "Prescription Glasses":
      return [
        { icon: Eye, label: "Blue Light Block" },
        { icon: Zap, label: "Anti-Reflective" },
        { icon: Shield, label: "Featherlight Frame" },
      ];
    case "Contact Lenses":
      return [
        { icon: Droplets, label: "Moisture Lock" },
        { icon: Eye, label: "All-Day Comfort" },
        { icon: Shield, label: "UV Blocking" },
      ];
    default:
      return [
        { icon: Star, label: "Premium Grade" },
        { icon: Shield, label: "Precision Crafted" },
        { icon: Zap, label: "Lifetime Quality" },
      ];
  }
};

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
  if (c.includes("gunmetal")) return "#555";
  if (c.includes("bone") || c.includes("white")) return "#e8e0d0";
  if (c.includes("amber")) return "#FFBF00";
  if (c.includes("mirror")) return "#aab8c2";
  if (c.includes("matte")) return "#1a1a1a";
  if (c.includes("brushed")) return "#c9a632";
  if (c.includes("sapphire")) return "#0f52ba";
  if (c.includes("emerald")) return "#046307";
  if (c.includes("hazel")) return "#8E7618";
  if (c.includes("midnight")) return "#191970";
  if (c.includes("saddle")) return "#8B4513";
  return "#808080";
};

/* ────────────────────────────────────────────────
   Inline Quick-View Overlay (auto-closes on leave)
   ──────────────────────────────────────────────── */
function QuickViewOverlay({ product, onClose }) {
  const features = getFeatures(product.category);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [rotation, setRotation] = useState(0);

  // Auto-rotate
  useEffect(() => {
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;
      setRotation((r) => r + dt * 0.04);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors[0], product.sizes[0]);
    toast({ title: "Added to cart", description: `${product.name} added.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: "auto" }}
    >
      {/* The popup card — slightly larger than the original card */}
      <div
        className="absolute -inset-4 rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "rgba(12,12,18,0.92)",
          backdropFilter: "blur(30px) saturate(1.4)",
          WebkitBackdropFilter: "blur(30px) saturate(1.4)",
          border: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 0 60px rgba(212,175,55,0.08), 0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* ─── Rotating product image ─── */}
        <div
          className="flex-shrink-0 h-[45%] flex items-center justify-center relative overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.05) 0%, transparent 70%)" }}
        >
          {/* Rotating glow ring */}
          <div
            className="absolute w-[160px] h-[160px] rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(from ${rotation}deg, transparent, rgba(212,175,55,0.08), transparent, rgba(212,175,55,0.04), transparent)`,
              filter: "blur(15px)",
            }}
          />

          {/* Product image with 3D rotation */}
          <div
            className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden"
            style={{
              transform: `perspective(800px) rotateY(${Math.sin(rotation * 0.017) * 22}deg) rotateX(${Math.cos(rotation * 0.013) * 4}deg)`,
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.08)" }}
              draggable={false}
            />
            {/* Dynamic shine */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: `linear-gradient(${rotation * 0.5}deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)` }}
            />
          </div>

          {/* 360° badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-foreground/20">
            <div className="w-3.5 h-3.5 border border-foreground/15 rounded-full flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-primary rounded-full" style={{ transform: `rotate(${rotation}deg) translateY(-3px)` }} />
            </div>
            <span className="text-[8px] font-bold tracking-[0.2em] uppercase font-sans">360°</span>
          </div>

          {product.featured && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.2em] font-sans">
              Featured
            </div>
          )}
        </div>

        {/* ─── Product info ─── */}
        <div className="flex-1 p-4 pt-3 flex flex-col gap-2.5 overflow-hidden">
          {/* Category + Rating */}
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-bold tracking-[0.3em] text-primary uppercase font-sans">{product.category}</p>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-foreground/15"}`} />
              ))}
              <span className="text-[9px] text-foreground/30 ml-1 font-sans">{product.rating}</span>
            </div>
          </div>

          {/* Name + Price */}
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-xl font-bold tracking-tight leading-tight">{product.name}</h3>
            <p className="text-lg font-mono font-bold text-primary flex-shrink-0">${product.price}</p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-0.5 border border-primary/15 rounded-full px-1.5 py-0.5 bg-primary/5 text-primary text-[7px] font-bold tracking-[0.12em] uppercase font-sans">
                  <Icon className="w-2 h-2" />
                  {f.label}
                </div>
              );
            })}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.15em] text-foreground/25 uppercase font-sans">Colors:</span>
            <div className="flex gap-1">
              {product.colors.map((color) => (
                <div key={color} className="w-4 h-4 rounded-full border border-white/15" style={{ backgroundColor: getColorHex(color) }} title={color} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-primary text-primary-foreground font-bold py-2.5 rounded-xl text-[10px] tracking-[0.15em] uppercase font-sans flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
            >
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </button>
            <Link
              href={`/products/${product.id}`}
              className="flex-1 font-bold py-2.5 rounded-xl text-[10px] tracking-[0.15em] uppercase font-sans flex items-center justify-center gap-1.5 text-foreground/60 hover:text-primary transition-all duration-300 border border-white/[0.06] hover:border-primary/20"
            >
              Details <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
   Product Card
   ──────────────────────────────────────────────── */
export default function ProductCard({ product, index = 0 }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const enterTimer = useRef(null);
  const leaveTimer = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimer.current);
    setIsHovered(true);
    enterTimer.current = setTimeout(() => setShowQuickView(true), 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(enterTimer.current);
    setIsHovered(false);
    // Small delay so cursor can move over popup without flicker
    leaveTimer.current = setTimeout(() => setShowQuickView(false), 100);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative"
      data-testid={`card-product-${product.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Tilt
        tiltMaxAngleX={showQuickView ? 0 : 6}
        tiltMaxAngleY={showQuickView ? 0 : 6}
        scale={showQuickView ? 1 : 1.02}
        transitionSpeed={2500}
        className="h-full"
        glareEnable={!showQuickView}
        glareMaxOpacity={0.06}
        glareColor="#D4AF37"
        glarePosition="all"
        glareBorderRadius="16px"
      >
        <Link href={`/products/${product.id}`} className="block h-full" onClick={(e) => { if (showQuickView) e.preventDefault(); }}>
          <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-500 hover:border-primary/15 relative group-hover:shadow-[0_0_35px_rgba(212,175,55,0.08)]">

            {/* Featured badge */}
            {product.featured && (
              <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.2em] font-sans shadow-lg shadow-primary/30">
                Featured
              </div>
            )}

            {/* Image */}
            <div className="aspect-[4/5] bg-white/[0.01] relative overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.03) 0%, transparent 60%)", opacity: isHovered ? 1 : 0.2 }}
              />
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-700 group-hover:scale-[0.9] group-hover:-translate-y-2 drop-shadow-2xl relative z-10"
                loading="lazy"
              />
              {/* Hover hint */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/15 backdrop-blur-[1px] transition-all duration-400 z-20 ${isHovered && !showQuickView ? "opacity-100" : "opacity-0"}`}>
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 flex items-center gap-1.5 shadow-xl">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold tracking-[0.12em] uppercase font-sans text-foreground/90">Quick View</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col flex-grow justify-between gap-3 border-t border-white/[0.04]">
              <div>
                <p className="text-[8px] text-foreground/30 font-bold uppercase tracking-[0.25em] mb-1 font-sans">{product.category}</p>
                <h3 className="text-base font-bold tracking-tight text-foreground mb-1 transition-colors duration-300 group-hover:text-primary leading-snug">{product.name}</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono font-bold text-primary text-lg">${product.price}</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-foreground/10"}`} />
                    ))}
                    <span className="text-[9px] text-foreground/25 ml-1 font-sans">{product.reviewCount}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color) => (
                    <span key={color} className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: getColorHex(color) }} title={color} />
                  ))}
                  {product.colors.length > 3 && <span className="text-[9px] text-foreground/20 font-sans">+{product.colors.length - 3}</span>}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Tilt>

      {/* Quick-view overlay (auto-closes on mouse leave) */}
      <AnimatePresence>
        {showQuickView && (
          <QuickViewOverlay product={product} onClose={() => setShowQuickView(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
