import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { products } from "@/data/products";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ArrowRight, Shield, Zap, Eye, ChevronDown } from "lucide-react";
import GlassesViewer3D from "@/components/GlassesViewer3D";
import ProductCarousel3D from "@/components/ProductCarousel3D";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  { name: "Alex M.", text: "VisionLux frames are a statement piece. I get compliments everywhere I go.", rating: 5 },
  { name: "Jordan L.", text: "The quality is unreal — lightweight yet incredibly sturdy. Never going back.", rating: 5 },
  { name: "Priya K.", text: "Finally a brand that gets Gen Z aesthetics. These frames feel like the future.", rating: 5 },
];

export default function Home() {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const statsRef = useRef(null);
  const shapesRef = useRef(null);
  const storyRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ─── HERO: Initial text reveal ───
      const heroTexts = heroTextRef.current?.querySelectorAll(".reveal-text");
      if (heroTexts) {
        gsap.fromTo(heroTexts,
          { y: 80, opacity: 0, rotateX: 15 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1.2, stagger: 0.1,
            ease: "power4.out", delay: 0.3
          }
        );
      }

      // ─── HERO: Parallax fade-out on scroll ───
      if (heroRef.current) {
        // Hero text fades and scales down as you scroll away
        gsap.to(heroTextRef.current, {
          y: -100,
          opacity: 0,
          scale: 0.92,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: 1.2,
          },
        });

        // Background orbs in hero area parallax
        const heroOrbs = heroRef.current.querySelectorAll(".hero-orb");
        heroOrbs.forEach((orb, i) => {
          gsap.to(orb, {
            y: (i + 1) * -120,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });
      }

      // ─── STATS: Counter-like staggered reveal ───
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(statItems,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
        // Gold underline that sweeps across
        const underlines = statsRef.current.querySelectorAll(".stat-underline");
        gsap.fromTo(underlines,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 0.6, stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // ─── MARQUEE: Speed variation on scroll velocity ───
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current.querySelector(".marquee-inner"), {
          x: "-50%",
          ease: "none",
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // ─── ICONIC SHAPES: Staggered reveal with parallax images ───
      if (shapesRef.current) {
        const cards = shapesRef.current.querySelectorAll(".shape-card");
        gsap.fromTo(cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9, stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: shapesRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
        // Image parallax inside cards
        const cardImages = shapesRef.current.querySelectorAll(".shape-card-img");
        cardImages.forEach((img) => {
          gsap.to(img, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".shape-card"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      }

      // ─── BRAND STORY: Split parallax ───
      if (storyRef.current) {
        const storyImage = storyRef.current.querySelector(".story-image");
        const storyText = storyRef.current.querySelector(".story-text");
        const storyGlass = storyRef.current.querySelector(".story-glass-card");

        if (storyImage) {
          gsap.fromTo(storyImage,
            { y: 80, opacity: 0, scale: 0.9 },
            {
              y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: {
                trigger: storyRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          );
          // Continuous parallax
          gsap.to(storyImage, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
        if (storyText) {
          gsap.fromTo(storyText,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2,
              scrollTrigger: {
                trigger: storyRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            }
          );
          // Text moves opposite direction for split parallax
          gsap.to(storyText, {
            y: 30,
            ease: "none",
            scrollTrigger: {
              trigger: storyRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
        if (storyGlass) {
          gsap.fromTo(storyGlass,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: {
                trigger: storyImage,
                start: "center 60%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // ─── TESTIMONIALS: 3D perspective tilt stagger ───
      if (testimonialsRef.current) {
        const cards = testimonialsRef.current.querySelectorAll(".testimonial-card");
        gsap.fromTo(cards,
          { y: 50, opacity: 0, rotateX: 8 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 0.8, stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // ─── FINAL CTA: Scale-up reveal ───
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current.querySelector(".cta-content"),
          { scale: 0.85, opacity: 0 },
          {
            scale: 1, opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

    }); // end gsap.context

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full overflow-x-hidden">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-6rem)] flex flex-col md:flex-row items-center justify-between container mx-auto px-6 pt-8 pb-16 overflow-hidden"
      >
        {/* Parallax orbs */}
        <div className="hero-orb absolute top-[15%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 60%)", filter: "blur(60px)" }} />
        <div className="hero-orb absolute bottom-[5%] left-[10%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,105,20,0.05) 0%, transparent 60%)", filter: "blur(50px)" }} />
        <div className="hero-orb absolute top-[40%] left-[50%] w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,208,96,0.04) 0%, transparent 60%)", filter: "blur(40px)" }} />

        {/* Hero text */}
        <div ref={heroTextRef} className="z-10 flex flex-col gap-5 md:w-1/2 md:pr-12" style={{ perspective: "1000px" }}>
          <div className="overflow-hidden">
            <p className="reveal-text text-xs font-bold tracking-[0.3em] text-primary uppercase mb-4 font-sans">The Future of Eyewear</p>
          </div>
          <div className="overflow-hidden">
            <h1 className="reveal-text text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.88]">See Better.</h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="reveal-text text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.88] text-gradient-gold">Look Bolder.</h1>
          </div>
          <div className="overflow-hidden mt-2">
            <p className="reveal-text text-lg text-foreground/50 max-w-sm font-light leading-relaxed font-sans">Premium eyewear engineered for a generation that refuses to compromise. Precision-crafted. Uncompromisingly bold.</p>
          </div>
          <div className="overflow-hidden mt-4 flex gap-4 flex-wrap">
            <div className="reveal-text">
              <Link href="/products" className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 font-sans shine-sweep relative overflow-hidden">
                Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="reveal-text">
              <Link href="/about" className="inline-flex items-center gap-2 border border-foreground/20 text-foreground px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:border-primary hover:text-primary transition-all duration-300 font-sans">Our Story</Link>
            </div>
          </div>
          <div className="reveal-text mt-6 flex gap-6 flex-wrap">
            {[
              { icon: Shield, label: "UV400 Protection" },
              { icon: Zap, label: "Featherlight" },
              { icon: Eye, label: "Blue Light Block" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <f.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground/40 font-sans">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="reveal-text mt-8 hidden md:flex items-center gap-2 text-foreground/20">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase font-sans">Scroll to explore</span>
          </div>
        </div>

        {/* Hero 3D Viewer */}
        <div className="md:w-1/2 h-[360px] md:h-[520px] mt-12 md:mt-0 flex items-center justify-center">
          <GlassesViewer3D size="hero" />
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section ref={statsRef} className="border-t border-white/5 py-14 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "24K", label: "Gold Accents" },
              { value: "4.9★", label: "Average Rating" },
              { value: "2yr", label: "Warranty" },
            ].map((stat) => (
              <div key={stat.label} className="stat-item flex flex-col items-center">
                <p className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{stat.value}</p>
                <p className="text-sm text-foreground/40 mt-1 uppercase tracking-widest font-medium font-sans">{stat.label}</p>
                <div className="stat-underline w-8 h-[2px] bg-primary/40 mt-3 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div ref={marqueeRef} className="py-5 border-y border-white/5 overflow-hidden bg-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10" />
        <div className="marquee-inner whitespace-nowrap inline-flex animate-marquee">
          {Array(6).fill("SEE BETTER  •  LOOK BOLDER  •  VISIONLUX  •  24K GOLD FRAMES  •  ENGINEERED PRECISION  •  ").map((text, i) => (
            <span key={i} className="text-xs font-bold tracking-[0.3em] uppercase text-primary/20 px-2 font-sans">{text}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════════ 3D CAROUSEL ═══════════════════ */}
      <ProductCarousel3D products={products} />

      {/* ═══════════════════ ICONIC SHAPES ═══════════════════ */}
      <section ref={shapesRef} className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold tracking-tighter text-foreground/[0.015] pointer-events-none whitespace-nowrap select-none">COLLECTION</div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16">
            <p className="text-[10px] font-bold tracking-[0.35em] text-primary uppercase mb-3 font-sans">Collections</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Iconic Shapes<span className="text-primary">.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            <Link href="/products?category=Sunglasses" className="shape-card md:col-span-3 group relative aspect-[3/4] md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden block bg-card gold-glow-hover transition-shadow duration-500">
              <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=1600&fit=crop&q=80" alt="The Aviator" loading="lazy" className="shape-card-img w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700 -mt-[10%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-3 font-sans">Signature Style</p>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">The Aviator</h3>
                <span className="inline-flex items-center gap-2 text-white/60 text-sm font-medium tracking-widest uppercase group-hover:text-primary transition-colors font-sans">Shop Now <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              <Link href="/products?category=Sunglasses" className="shape-card group relative flex-1 rounded-2xl overflow-hidden block min-h-[280px] bg-card gold-glow-hover transition-shadow duration-500">
                <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop&q=80" alt="The Wayfarer" loading="lazy" className="shape-card-img w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700 -mt-[10%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 font-sans">Bold Confidence</p>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-2">The Wayfarer</h3>
                  <span className="text-white/50 text-xs uppercase tracking-widest group-hover:text-primary transition-colors font-sans">Shop →</span>
                </div>
              </Link>
              <Link href="/products?category=Sunglasses" className="shape-card group relative flex-1 rounded-2xl overflow-hidden block min-h-[280px] bg-card gold-glow-hover transition-shadow duration-500">
                <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&h=600&fit=crop&q=80" alt="The Oversized" loading="lazy" className="shape-card-img w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700 -mt-[10%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-2 font-sans">Pure Drama</p>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-white mb-2">The Oversized</h3>
                  <span className="text-white/50 text-xs uppercase tracking-widest group-hover:text-primary transition-colors font-sans">Shop →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BRAND STORY ═══════════════════ */}
      <section ref={storyRef} className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="story-image relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 gold-glow">
              <img src="https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=800&h=1000&fit=crop&q=80" alt="Editorial" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="story-glass-card absolute bottom-8 left-8 right-8 p-6 glass-panel rounded-2xl">
                <p className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase mb-2 font-sans">Est. 2020</p>
                <p className="text-foreground font-medium font-sans">Born in a SoHo loft. Built for the world.</p>
              </div>
            </div>
            <div className="story-text space-y-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-4 font-sans">Our Story</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">Vision is a Statement.<br />Not a Compromise.</h2>
              </div>
              <p className="text-lg text-foreground/50 font-light leading-relaxed font-sans">We rebel against the generic. Every VisionLux frame is hand-finished, structurally reinforced, and designed to command attention.</p>
              <p className="text-lg text-foreground/50 font-light leading-relaxed font-sans">Our designers obsess over every millimeter — because the people who wear us deserve nothing less than extraordinary.</p>
              <Link href="/about" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 font-sans shine-sweep relative overflow-hidden">Read Our Story <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section ref={testimonialsRef} className="py-24 md:py-32 border-t border-white/5 relative" style={{ perspective: "1200px" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-4 font-sans">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">They Said It Best<span className="text-primary">.</span></h2>
          </div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
            {testimonials.map((t) => (
              <div key={t.name}
                className="testimonial-card glass-panel rounded-2xl p-8 min-w-[85vw] md:min-w-0 snap-center shrink-0 gold-glow-hover transition-shadow duration-500"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (<Star key={j} className="w-4 h-4 fill-primary text-primary" />))}
                </div>
                <p className="text-foreground/70 text-lg font-light leading-relaxed mb-8 font-serif italic">"{t.text}"</p>
                <p className="text-sm font-bold tracking-wide text-primary font-sans">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section ref={ctaRef} className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 50%)", filter: "blur(80px)" }} />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="cta-content">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Ready to Stand Out?</h2>
            <p className="text-xl text-foreground/40 font-light mb-12 max-w-lg mx-auto font-sans">Join 50,000+ people who choose VisionLux every day.</p>
            <Link href="/products" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-12 py-5 rounded-full font-bold text-base tracking-widest uppercase hover:bg-primary/90 transition-all duration-300 shadow-2xl shadow-primary/30 font-sans shine-sweep relative overflow-hidden">Shop Now <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
