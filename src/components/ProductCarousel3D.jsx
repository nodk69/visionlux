import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Zap, Shield, Eye, Droplets } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getFeatures = (category) => {
  switch (category) {
    case "Sunglasses": return [
      { icon: Zap, label: "UV400" },
      { icon: Shield, label: "Polarized" },
      { icon: Star, label: "24k Gold" },
    ];
    case "Prescription Glasses": return [
      { icon: Eye, label: "Blue Light Block" },
      { icon: Zap, label: "Anti-Reflective" },
      { icon: Shield, label: "Featherlight" },
    ];
    case "Contact Lenses": return [
      { icon: Droplets, label: "Moisture Lock" },
      { icon: Eye, label: "All-Day Comfort" },
      { icon: Shield, label: "UV Blocking" },
    ];
    default: return [
      { icon: Star, label: "Premium" },
      { icon: Shield, label: "Crafted" },
      { icon: Zap, label: "Quality" },
    ];
  }
};

const getColorHex = (color) => {
  const c = color.toLowerCase();
  if (c.includes("black")) return "#0a0a0a";
  if (c.includes("gold")) return "#D4AF37";
  if (c.includes("silver")) return "#C0C0C0";
  if (c.includes("tortoise")) return "#6b4c1a";
  if (c.includes("clear")) return "rgba(255,255,255,0.25)";
  if (c.includes("gunmetal")) return "#555";
  if (c.includes("bone") || c.includes("white")) return "#e8e0d0";
  if (c.includes("green")) return "#2d5a27";
  if (c.includes("blue")) return "#2563eb";
  if (c.includes("rose")) return "#e8a4a4";
  if (c.includes("amber")) return "#FFBF00";
  if (c.includes("mirror")) return "#aab8c2";
  if (c.includes("matte")) return "#1a1a1a";
  if (c.includes("brushed")) return "#c9a632";
  if (c.includes("midnight")) return "#191970";
  if (c.includes("saddle")) return "#8B4513";
  return "#808080";
};

/* ────────────────────────────────────────────
   Carousel Item Quick-View Popup
   (auto-closes when mouse leaves)
   ──────────────────────────────────────────── */
function CarouselQuickView({ product }) {
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
      setRotation((r) => r + dt * 0.045);
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
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 6 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-1/2 left-1/2 z-50 pointer-events-auto"
      style={{
        width: 320,
        transform: "translate(-50%, -55%)",
        marginLeft: 0,
        marginTop: -20,
      }}
    >
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "rgba(10,10,16,0.93)",
          backdropFilter: "blur(25px) saturate(1.3)",
          WebkitBackdropFilter: "blur(25px) saturate(1.3)",
          border: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 0 50px rgba(212,175,55,0.08), 0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        {/* ─── Rotating product image ─── */}
        <div
          className="h-[180px] flex items-center justify-center relative overflow-hidden flex-shrink-0"
          style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(212,175,55,0.05) 0%, transparent 65%)" }}
        >
          {/* Conic glow */}
          <div
            className="absolute w-[130px] h-[130px] rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(from ${rotation}deg, transparent, rgba(212,175,55,0.07), transparent, rgba(212,175,55,0.03), transparent)`,
              filter: "blur(12px)",
            }}
          />
          {/* Rotating image */}
          <div
            className="relative w-[120px] h-[120px] rounded-xl overflow-hidden"
            style={{
              transform: `perspective(700px) rotateY(${Math.sin(rotation * 0.017) * 20}deg) rotateX(${Math.cos(rotation * 0.013) * 4}deg)`,
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
              style={{ boxShadow: "0 10px 35px rgba(0,0,0,0.5)" }}
              draggable={false}
            />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: `linear-gradient(${rotation * 0.5}deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)` }}
            />
          </div>

          {/* 360 badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-foreground/15">
            <div className="w-3 h-3 border border-foreground/12 rounded-full flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-primary rounded-full" style={{ transform: `rotate(${rotation}deg) translateY(-3px)` }} />
            </div>
            <span className="text-[7px] font-bold tracking-[0.15em] uppercase font-sans">360°</span>
          </div>
        </div>

        {/* ─── Info ─── */}
        <div className="p-4 pt-3 space-y-2.5">
          {/* Category + Rating */}
          <div className="flex items-center justify-between">
            <p className="text-[7px] font-bold tracking-[0.25em] text-primary uppercase font-sans">{product.category}</p>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2 h-2 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-foreground/12"}`} />
              ))}
            </div>
          </div>

          {/* Name + Price */}
          <div className="flex items-end justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight leading-tight">{product.name}</h3>
            <p className="text-base font-mono font-bold text-primary flex-shrink-0">${product.price}</p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-0.5 border border-primary/12 rounded-full px-1.5 py-0.5 bg-primary/5 text-primary text-[7px] font-bold tracking-[0.1em] uppercase font-sans">
                  <Icon className="w-2 h-2" />
                  {f.label}
                </div>
              );
            })}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-2">
            <span className="text-[7px] font-bold tracking-[0.12em] text-foreground/20 uppercase font-sans">Colors:</span>
            <div className="flex gap-1">
              {product.colors.map((color) => (
                <div key={color} className="w-3.5 h-3.5 rounded-full border border-white/12" style={{ backgroundColor: getColorHex(color) }} title={color} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-lg text-[9px] tracking-[0.12em] uppercase font-sans flex items-center justify-center gap-1 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <ShoppingBag className="w-2.5 h-2.5" />
              Add to Cart
            </button>
            <Link
              href={`/products/${product.id}`}
              className="flex-1 font-bold py-2 rounded-lg text-[9px] tracking-[0.12em] uppercase font-sans flex items-center justify-center gap-1 text-foreground/50 hover:text-primary transition-all border border-white/[0.06] hover:border-primary/20"
            >
              Details <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   Product Carousel 3D
   ──────────────────────────────────────────── */
export default function ProductCarousel3D({ products }) {
  const [manualRotation, setManualRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [quickViewId, setQuickViewId] = useState(null);
  const [didDrag, setDidDrag] = useState(false);

  const sectionRef = useRef(null);
  const ringRef = useRef(null);
  const scrollRotation = useRef({ value: 0 });
  const hoverTimers = useRef({});
  const leaveTimers = useRef({});

  const count = products.length;
  const angleStep = 360 / count;
  const radius = Math.max(380, count * 38);

  // ─── GSAP: Pin + scrub rotation ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      const headingEls = sectionRef.current?.querySelectorAll(".carousel-heading");
      if (headingEls) {
        gsap.fromTo(headingEls,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 10%",
        end: "+=150%",
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          scrollRotation.current.value = self.progress * 360;
          updateRingRotation();
        },
      });

      const glowEl = sectionRef.current?.querySelector(".carousel-glow");
      if (glowEl) {
        gsap.to(glowEl, { scale: 1.15, opacity: 0.8, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const updateRingRotation = useCallback(() => {
    if (ringRef.current) {
      const total = scrollRotation.current.value + manualRotation;
      ringRef.current.style.transform = `translate(-50%, -50%) rotateX(-12deg) rotateY(${total}deg)`;
    }
  }, [manualRotation]);

  useEffect(() => { updateRingRotation(); }, [manualRotation, updateRingRotation]);

  // Drag handlers
  const handlePointerDown = useCallback((e) => {
    setDragging(true); setDidDrag(false);
    setDragStartX(e.clientX); setDragStartRotation(manualRotation);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [manualRotation]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 5) setDidDrag(true);
    setManualRotation(dragStartRotation + dx * 0.3);
  }, [dragging, dragStartX, dragStartRotation]);

  const handlePointerUp = useCallback(() => { setDragging(false); }, []);

  // Hover handlers — show quick-view after 500ms, auto-close on leave
  const handleItemEnter = useCallback((id) => {
    clearTimeout(leaveTimers.current[id]);
    setHoveredId(id);
    hoverTimers.current[id] = setTimeout(() => setQuickViewId(id), 500);
  }, []);

  const handleItemLeave = useCallback((id) => {
    clearTimeout(hoverTimers.current[id]);
    setHoveredId(null);
    leaveTimers.current[id] = setTimeout(() => setQuickViewId((prev) => prev === id ? null : prev), 120);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(hoverTimers.current).forEach(clearTimeout);
      Object.values(leaveTimers.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative">
      {/* Section fades */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <p className="carousel-heading text-[10px] font-bold tracking-[0.35em] text-primary uppercase mb-3 font-sans">360° Showcase</p>
            <h2 className="carousel-heading text-4xl md:text-6xl font-bold tracking-tighter">
              The Edit<span className="text-primary">.</span>
            </h2>
          </div>
          <Link href="/products" className="carousel-heading text-primary hover:text-primary/80 font-medium tracking-wide uppercase text-sm border-b border-primary pb-1 inline-flex items-center gap-2 self-start md:self-auto font-sans">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="carousel-heading text-foreground/25 text-sm mt-4 font-sans">← Scroll or drag to explore →</p>
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full h-[520px] md:h-[580px] touch-none select-none overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Ambient glow */}
        <div className="carousel-glow absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, rgba(139,105,20,0.03) 40%, transparent 70%)", filter: "blur(40px)" }}
        />

        {/* Rotating ring */}
        <div
          ref={ringRef}
          className="absolute top-[40%] left-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateX(-12deg) rotateY(${scrollRotation.current.value + manualRotation}deg)`,
            transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          {products.map((product, i) => {
            const itemAngle = i * angleStep;
            const isHovered = hoveredId === product.id;
            const isQuickView = quickViewId === product.id;

            return (
              <div
                key={product.id}
                className="absolute"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "-100px",
                  top: "-130px",
                }}
                onMouseEnter={() => handleItemEnter(product.id)}
                onMouseLeave={() => handleItemLeave(product.id)}
              >
                <Link
                  href={`/products/${product.id}`}
                  onClick={(e) => { if (didDrag || isQuickView) e.preventDefault(); }}
                  className="block relative w-[200px] group"
                >
                  {/* Glow ring */}
                  <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[160px] h-[20px] rounded-[100%] transition-all duration-500"
                    style={{
                      background: isHovered
                        ? "radial-gradient(ellipse, rgba(212,175,55,0.4) 0%, transparent 70%)"
                        : "radial-gradient(ellipse, rgba(212,175,55,0.1) 0%, transparent 70%)",
                      filter: "blur(8px)",
                      transform: `translateX(-50%) scale(${isHovered ? 1.4 : 1})`,
                    }}
                  />

                  {/* Product image */}
                  <motion.div
                    className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden"
                    animate={{ y: isHovered ? -18 : 0, scale: isHovered ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute inset-0 rounded-2xl z-20 pointer-events-none transition-all duration-500"
                      style={{
                        border: isHovered ? "1px solid rgba(212,175,55,0.3)" : "1px solid rgba(255,255,255,0.06)",
                        boxShadow: isHovered ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(212,175,55,0.15)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}
                    />
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-2xl"
                      style={{
                        boxShadow: isHovered ? "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.15)" : "0 10px 30px rgba(0,0,0,0.4)",
                        filter: isHovered ? "brightness(1.1) contrast(1.05)" : "brightness(0.82)",
                        transition: "filter 0.4s, box-shadow 0.4s",
                      }}
                      draggable={false}
                    />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                      style={{
                        background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.03) 55%, transparent 70%)",
                        opacity: isHovered ? 1 : 0,
                      }}
                    />
                  </motion.div>

                  {/* Name + Price (visible when no quick-view) */}
                  <motion.div
                    className="text-center mt-5 pointer-events-none"
                    animate={{ opacity: isQuickView ? 0 : isHovered ? 1 : 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-bold tracking-tight text-foreground truncate font-sans">{product.name}</p>
                    <p className="text-xs font-mono text-primary mt-1">${product.price}</p>
                  </motion.div>
                </Link>

                {/* Quick-view popup (auto-closes on mouse leave) */}
                <AnimatePresence>
                  {isQuickView && (
                    <CarouselQuickView product={product} />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Edge fades */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background/50 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background/60 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
