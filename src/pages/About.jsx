import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">The Architecture of Sight.</h1>
        <p className="text-xl text-foreground/70 leading-relaxed font-light">VisionLux was founded on a singular premise: eyewear should not be an afterthought. It is the focal point of your face, the architecture of your expression, and the lens through which you interact with the world.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-12 mb-32">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="aspect-square rounded-3xl overflow-hidden">
          <img src="https://placehold.co/800x800/1a1a2e/D4AF37?text=Craftsmanship" alt="Craft" className="w-full h-full object-cover" />
        </motion.div>
        <div className="flex flex-col justify-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tighter">Engineered Perfection.</h2>
          <p className="text-foreground/70 text-lg leading-relaxed">Every VisionLux frame undergoes a rigorous 48-step hand-finishing process. We source aerospace-grade titanium and bespoke Japanese acetate, combining traditional artisanal techniques with modern precision engineering.</p>
          <p className="text-foreground/70 text-lg leading-relaxed">Our signature 24k gold inlay isn't just aesthetic—it's a hallmark of structural integrity, balancing the frame perfectly on the bridge of the nose.</p>
        </div>
      </div>
      <div className="bg-primary text-[#111827] rounded-3xl p-12 md:p-24 text-center mb-32">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">No Compromises.</h2>
        <div className="grid md:grid-cols-3 gap-12 mt-16">
          <div><h3 className="text-xl font-bold mb-4">Materials</h3><p className="font-medium opacity-80">Only the finest bio-acetates and medical-grade metals touch your skin.</p></div>
          <div><h3 className="text-xl font-bold mb-4">Lenses</h3><p className="font-medium opacity-80">Optical clarity that rivals camera glass, with complete UV and blue light protection.</p></div>
          <div><h3 className="text-xl font-bold mb-4">Design</h3><p className="font-medium opacity-80">Silhouettes that respect the classics while relentlessly pushing forward.</p></div>
        </div>
      </div>
    </div>
  );
}
