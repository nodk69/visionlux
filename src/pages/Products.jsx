import { useState, useMemo, useEffect, useRef } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Search, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchFocused, setSearchFocused] = useState(false);

  const pageRef = useRef(null);
  const gridRef = useRef(null);

  const categories = ["All", "Sunglasses", "Prescription Glasses", "Contact Lenses", "Eye-care Accessories"];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => categoryFilter === "All" || p.category === categoryFilter)
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      });
  }, [categoryFilter, search, sortBy]);

  // ─── Staggered card reveal on filter change ───
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".product-card-wrapper");
    gsap.fromTo(cards,
      { y: 30, opacity: 0, scale: 0.97 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.5, stagger: 0.04,
        ease: "power3.out",
        overwrite: true,
      }
    );
  }, [filteredProducts]);

  const hasActiveFilters = categoryFilter !== "All" || search !== "";

  return (
    <div ref={pageRef} className="w-full min-h-screen">
      <div className="container mx-auto px-6">

        {/* ═══════ COMPACT HEADER + FILTERS ═══════ */}
        <div className="pt-4 pb-8">
          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none">
                Collection<span className="text-primary">.</span>
              </h1>
              <p className="text-foreground/35 mt-2 font-sans text-sm font-light">
                {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3">
              <div className={`relative transition-all duration-500 ${searchFocused ? "w-72" : "w-52"}`}>
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-300 ${searchFocused ? "text-primary" : "text-foreground/25"}`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full pl-10 pr-9 py-2 text-sm font-sans focus:outline-none focus:border-primary/40 focus:shadow-[0_0_15px_rgba(212,175,55,0.08)] transition-all duration-500 placeholder:text-foreground/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/25 hover:text-primary transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="relative flex-shrink-0">
                <select
                  className="appearance-none bg-white/[0.03] border border-white/[0.08] rounded-full px-4 pr-9 py-2 text-xs font-bold tracking-wider uppercase font-sans focus:outline-none focus:border-primary/40 transition-all duration-300 cursor-pointer text-foreground/50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-foreground/25" />
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 font-sans whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-white/[0.03] border border-white/[0.06] text-foreground/40 hover:border-primary/25 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Clear filters */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => { setSearch(""); setCategoryFilter("All"); setSortBy("featured"); }}
                  className="px-3 py-2 rounded-full text-xs font-bold tracking-wider uppercase text-primary/60 hover:text-primary transition-colors font-sans flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        {/* ═══════ PRODUCT GRID ═══════ */}
        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-16 h-16 rounded-full glass-panel mx-auto mb-6 flex items-center justify-center">
              <Search className="w-7 h-7 text-primary/40" />
            </div>
            <h2 className="text-2xl font-bold mb-3 tracking-tight">No pieces found</h2>
            <p className="text-foreground/35 mb-6 font-sans font-light">Try adjusting your filters.</p>
            <button
              onClick={() => { setSearch(""); setCategoryFilter("All"); }}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 font-sans"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7 pb-24">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="product-card-wrapper">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
