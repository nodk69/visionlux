import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const leftLinks = [
    { label: "Shop", href: "/products", badge: "NEW" },
    { label: "Collections", href: "/products?collections" }
  ];

  const rightLinks = [
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 bg-background/70 backdrop-blur-xl border-b border-white/[0.06]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center">
            
            {/* Left Nav */}
            <nav className="hidden md:flex items-center gap-8 justify-start">
              {leftLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-bold tracking-widest uppercase transition-colors text-foreground hover:text-primary flex items-center gap-2"
                >
                  {link.label}
                  {link.badge && (
                    <span className="bg-primary text-primary-foreground text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  {location === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <div className="flex justify-start md:justify-center">
              <Link href="/" className="text-3xl font-bold tracking-tighter text-foreground" onClick={closeMobileMenu}>
                VISIONLUX<span className="text-primary">.</span>
              </Link>
            </div>

            {/* Right Nav & Actions */}
            <div className="flex items-center justify-end gap-6">
              <nav className="hidden md:flex items-center gap-8">
                {rightLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="relative text-sm font-bold tracking-widest uppercase transition-colors text-foreground hover:text-primary"
                  >
                    {link.label}
                    {location === link.href && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-4">
                <button className="text-foreground hover:text-primary transition-colors hidden md:block">
                  <User className="w-5 h-5" />
                </button>
                <button className="text-foreground hover:text-primary transition-colors relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
                <button 
                  className="md:hidden text-foreground hover:text-primary transition-colors" 
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col pt-8 px-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <Link href="/" className="text-3xl font-bold tracking-tighter text-foreground" onClick={closeMobileMenu}>
                VISIONLUX<span className="text-primary">.</span>
              </Link>
              <button 
                className="text-foreground p-2 hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex flex-col items-center gap-8 flex-1 justify-center">
              {[...leftLinks, ...rightLinks].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`text-4xl font-bold tracking-tighter uppercase transition-colors flex items-center gap-3 ${location === link.href ? "text-primary" : "text-foreground hover:text-primary"}`}
                  >
                    {link.label}
                    {link.badge && (
                      <span className="bg-primary text-primary-foreground text-xs font-black tracking-widest px-3 py-1 rounded-full uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div 
              className="pb-12 pt-8 flex justify-center gap-8 text-foreground/50 text-sm font-bold tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a href="#" className="hover:text-primary transition-colors">IG</a>
              <a href="#" className="hover:text-primary transition-colors">TT</a>
              <a href="#" className="hover:text-primary transition-colors">X</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
