import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary">
      {/* Dynamic gradient background layer */}
      <div className="dynamic-gradient-bg" aria-hidden="true" />

      {/* Floating ambient orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <Navbar />
      <main className="flex-grow pt-24 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
