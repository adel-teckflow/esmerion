import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Hexagon,
  Menu,
  X,
  ArrowRight,
  Award,
  CheckCircle2,
  FlaskConical,
  Recycle,
  Truck,
  ShieldCheck,
  ChevronDown,
  Globe2,
  Container,
  PhoneCallIcon,
  MailIcon,
  MapPin,
  Download,
  FileText,
} from "lucide-react";
import ContactForm from "./forms/ContactForm";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

type SectionTitleProps = {
  subtitle: string;
  title: string;
  align?: "center" | "left";
};

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
};

/* ---------------------------------- */
/* UI Components */
/* ---------------------------------- */

const SectionTitle: React.FC<SectionTitleProps> = ({
  subtitle,
  title,
  align = "center",
}) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-[#e11d48] font-bold tracking-wider uppercase text-sm block mb-2"
    >
      {subtitle}
    </motion.span>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold text-slate-900"
    >
      {title}
    </motion.h2>

    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className={`h-1 bg-[#e11d48] mt-4 ${align === "center" ? "mx-auto" : ""}`}
    />
  </div>
);

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  mobile = false,
  onClick,
}) => (
  <a
    href={href}
    onClick={onClick}
    className={`font-medium transition-colors hover:text-[#e11d48] ${
      mobile
        ? "text-2xl py-4 border-b border-slate-100 w-full text-center"
        : "text-slate-600"
    }`}
  >
    {children}
  </a>
);

/* ---------------------------------- */
/* NOUVEAU: Composant Modal Générique */
/* ---------------------------------- */

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-[#881337] p-6 flex justify-between items-center text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Hexagon className="w-5 h-5 fill-current text-[#f43f5e]" />
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

              {/* Footer (Optional decorative bar) */}
              <div className="h-2 bg-linear-to-r from-[#e11d48] to-[#fda4af]" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ---------------------------------- */
/* NOUVEAU: Système de Tracé SVG par Section */
/* ---------------------------------- */

interface SectionTraceProps {
  type: "straight" | "zigzag" | "wave" | "dashed" | "plume" | "end";
  color: string;
  className?: string;
}

const SectionTrace: React.FC<SectionTraceProps> = ({
  type,
  color,
  className = "",
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // Définition des formes de tracés (ViewBox 0 0 100 100 étiré)
  let d = "";
  let strokeWidth = 3;
  let strokeDasharray = "none";
  let opacity = 0.4;

  switch (type) {
    case "straight":
      d = "M 50 0 L 50 100";
      break;
    case "zigzag": // Scientifique / Précis
      d =
        "M 50 0 L 50 5 L 45 15 L 55 25 L 45 35 L 55 45 L 45 55 L 55 65 L 45 75 L 55 85 L 50 95 L 50 100";
      strokeWidth = 3;
      break;
    case "wave": // Fluide / Polymère
      d = "M 50 0 Q 60 25 50 50 Q 40 75 50 100";
      strokeWidth = 4;
      break;
    case "dashed": // Logistique / Route
      d = "M 50 0 L 50 100";
      strokeDasharray = "5 10"; // Pointillés
      strokeWidth = 3;
      opacity = 0.6;
      break;
    case "plume": // Process / Calligraphie
      // On simule un trait de plume avec une courbe légère mais épaisse
      d = "M 50 0 C 48 30, 52 70, 50 100";
      strokeWidth = 8; // Trait très épais
      opacity = 0.3;
      break;
    case "end":
      d = "M 50 0 L 50 80";
      break;
  }

  return (
    <div
      ref={ref}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block ${className}`}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <motion.path
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke" // Garde l'épaisseur du trait constante même si le SVG est étiré
          style={{ pathLength, opacity }}
        />
        {/* Petit point décoratif au début du tracé pour connecter les sections */}
        {type !== "end" && (
          <motion.circle
            cx="50"
            cy="0"
            r="1.5"
            fill={color}
            style={{ opacity }}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
};

/* ---------------------------------- */
/* Main App */
/* ---------------------------------- */

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // NOUVEAU: État pour gérer les modales
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Données de simulation pour les spécifications techniques
  const productSpecs: Record<
    string,
    { title: string; data: Record<string, string> }
  > = {
    "specs-hdpe": {
      title: "HDPE Specifications",
      data: {
        Density: "0.95 g/cm³",
        "Melt Flow Index": "0.3 g/10min",
        "Tensile Strength": "28 MPa",
        "Flexural Modulus": "1100 MPa",
        "Melting Point": "130°C",
      },
    },
    "specs-pp": {
      title: "Polypropylene Specifications",
      data: {
        Density: "0.90 g/cm³",
        "Melt Flow Index": "12 g/10min",
        "Tensile Strength": "32 MPa",
        "Flexural Modulus": "1500 MPa",
        "Melting Point": "165°C",
      },
    },
    "specs-pet": {
      title: "PET Resin Specifications",
      data: {
        Density: "1.38 g/cm³",
        "Intrinsic Viscosity": "0.80 dl/g",
        Acetaldehyde: "< 1.0 ppm",
        Crystallinity: "> 40%",
        "Melting Point": "250°C",
      },
    },
  };

  const renderModalContent = () => {
    if (!activeModal) return null;

    // 1. Modale "Our Story"
    if (activeModal === "our-story") {
      return (
        <div className="space-y-4 text-slate-600">
          <p>
            Established in 2005 in Algiers, <strong>Esmerion</strong> began with
            a simple mission: to provide the local industry with high-quality,
            consistent raw materials.
          </p>
          <p>
            What started as a small trading unit has evolved into a
            state-of-the-art compounding facility. We now serve over 500 clients
            across North Africa and Europe, specializing in bespoke polymer
            blends that meet rigorous ISO standards.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
            <h4 className="font-bold text-[#881337] mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" /> key Milestones
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>2005: Company Founded</li>
              <li>2010: First Extrusion Line Installed</li>
              <li>2018: ISO 9001 Certification</li>
              <li>2023: Expanded to International Exports</li>
            </ul>
          </div>
        </div>
      );
    }

    // 2. Modale "Explore Granules"
    if (activeModal === "explore-granules") {
      return (
        <div className="space-y-4">
          <p className="text-slate-600 mb-4">
            We offer a wide range of virgin and recycled polymer granules suited
            for injection molding, extrusion, and blow molding.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              "LDPE",
              "LLDPE",
              "HDPE",
              "PP Homo",
              "PP Copo",
              "PS",
              "ABS",
              "PET",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="w-2 h-2 rounded-full bg-[#e11d48]"></div>
                <span className="font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setActiveModal(null);
              window.location.href = "#contact";
            }}
            className="w-full mt-4 py-3 bg-[#e11d48] text-white font-bold rounded-lg hover:bg-[#be123c] transition"
          >
            Request Full Catalog
          </button>
        </div>
      );
    }

    // 3. Modale "Logistics Map"
    if (activeModal === "logistics-map") {
      return (
        <div className="text-center space-y-6">
          <div className="bg-slate-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="flex flex-col items-center text-slate-400">
              <Globe2 className="w-12 h-12 mb-2 opacity-50" />
              <span>Global Route Map Preview</span>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            Our logistics network covers major ports in the Mediterranean,
            Northern Europe, and East Asia.
          </p>
          <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download PDF Map (2.4MB)
          </button>
        </div>
      );
    }

    // 4. Modales "Specs" (Dynamique)
    if (productSpecs[activeModal]) {
      const spec = productSpecs[activeModal];
      return (
        <div>
          <p className="text-slate-500 mb-4 text-sm">
            Technical Data Sheet (TDS) summary. For full certification
            documents, please contact our sales team.
          </p>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Typical Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(spec.data).map(([key, value]) => (
                  <tr key={key} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-600">
                      {key}
                    </td>
                    <td className="px-4 py-3 text-[#e11d48] font-mono">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Save PDF
            </button>
            <button className="flex-1 py-2 bg-[#e11d48] text-white font-semibold rounded-lg hover:bg-[#be123c] transition">
              Order Sample
            </button>
          </div>
        </div>
      );
    }

    return <p>Content not found.</p>;
  };

  const getModalTitle = () => {
    if (activeModal === "our-story") return "Our Journey";
    if (activeModal === "explore-granules") return "Product Categories";
    if (activeModal === "logistics-map") return "Logistics Network";
    if (productSpecs[activeModal || ""])
      return productSpecs[activeModal || ""].title;
    return "Details";
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 selection:bg-[#e11d48] selection:text-white overflow-x-hidden">
      {/* --- NOUVEAU: RENDU DE LA MODALE --- */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg py-4"
            : "bg-transparent py-8"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center gap-2 group z-50">
            {isScrolled ? (
              <img
                src="/esmerion-logo.png"
                alt="logo"
                className="object-contain max-h-12"
              />
            ) : (
              <img
                src="esmerion-white.png"
                className="object-contain max-h-12"
                alt="esmerion-logo"
              />
            )}
          </a>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex space-x-8 items-center ${
              isScrolled ? "text-slate-600" : "text-slate-200"
            }`}
          >
            <a
              href="#about"
              className="hover:text-[#e11d48] font-medium transition"
            >
              About
            </a>
            <a
              href="#products"
              className="hover:text-[#e11d48] font-medium transition"
            >
              Products
            </a>
            <a
              href="#logistics"
              className="hover:text-[#e11d48] font-medium transition"
            >
              Logistics
            </a>
            <a
              href="#contact"
              className={`px-6 py-2 rounded-full font-bold transition transform hover:scale-105 shadow-lg ${
                isScrolled
                  ? "bg-[#e11d48] text-white hover:bg-[#be123c]"
                  : "bg-white text-[#e11d48] hover:bg-slate-100"
              }`}
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden z-50 ${
              isScrolled ? "text-slate-800" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 w-full h-screen bg-white z-40 flex flex-col items-center justify-center space-y-8 pt-20"
          >
            <NavLink
              mobile
              onClick={() => setMobileMenuOpen(false)}
              href="#about"
            >
              About
            </NavLink>
            <NavLink
              mobile
              onClick={() => setMobileMenuOpen(false)}
              href="#products"
            >
              Products
            </NavLink>
            <NavLink
              mobile
              onClick={() => setMobileMenuOpen(false)}
              href="#logistics"
            >
              Logistics
            </NavLink>
            <NavLink
              mobile
              onClick={() => setMobileMenuOpen(false)}
              href="#contact"
            >
              Contact
            </NavLink>
          </motion.div>
        )}
      </nav>

      {/* ----------------- SECTION 1: HERO ----------------- */}
      <header className="relative w-full h-screen overflow-hidden bg-[#881337] text-white z-10">
        {/* Trace SVG: Ligne Droite Claire */}
        <SectionTrace type="straight" color="#fecdd3" />

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#f43f5e] rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#be123c] rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 h-full flex items-center relative z-20">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1 mb-6 border border-[#fb7185] rounded-full bg-[#9f1239]/50 backdrop-blur-sm">
                <span className="text-[#fecdd3] font-semibold tracking-wide uppercase text-sm">
                  Advanced Material Science
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Molding the Future with{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fda4af] to-white">
                  Esmerion
                </span>
                .
              </h1>
              <p className="text-xl text-[#ffe4e6] mb-8 leading-relaxed max-w-xl">
                Premier manufacturer of thermoplastic elastomers and customized
                polymer solutions powering the next generation of industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setActiveModal("explore-granules")}
                  className="px-8 py-4 bg-[#f43f5e] hover:bg-[#fb7185] text-white rounded-lg font-bold transition shadow-lg shadow-[#881337]/50 flex items-center justify-center gap-2 group"
                >
                  Explore Granules
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveModal("our-story")}
                  className="px-8 py-4 border border-white/30 hover:bg-white/10 text-white rounded-lg font-bold transition flex items-center justify-center"
                >
                  Our Story
                </button>
              </div>
            </motion.div>
          </div>
          <div className="px-10 py-6 items-center justify-center hidden lg:flex lg:w-1/2 flex-col">
            <img
              src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=800"
              alt="Industrial Plant"
              className="size-96 object-contain rounded-full border-4 border-[#fb7185]/30 p-2"
            />
            <div className="text-sm text-white flex flex-col gap-3 flex-wrap max-w-sm mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-md">
              <p className="inline-flex gap-2 items-center">
                <PhoneCallIcon className="w-4 h-4 text-[#fecdd3]" /> +213 21 00
                00 00
              </p>
              <p className="inline-flex gap-2 items-center">
                <MailIcon className="w-4 h-4 text-[#fecdd3]" />{" "}
                email@first-polymers.com
              </p>
              <p className="inline-flex gap-2 items-center">
                <MapPin className="w-4 h-4 text-[#fecdd3]" /> Hydra, Algiers,
                Algeria
              </p>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-10 h-10 text-[#fecdd3]" />
        </motion.div>
      </header>

      {/* ----------------- SECTION 2: ABOUT ----------------- */}
      <section id="about" className="py-24 relative z-10 bg-white">
        {/* Trace SVG: ZigZag Rouge (Scientific Look) */}
        <SectionTrace type="zigzag" color="#e11d48" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-video">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
                  alt="Laboratory"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#881337]/20"></div>
              </div>
              {/* Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-md p-6 rounded-xl border border-white shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#ffe4e6] p-3 rounded-full text-[#e11d48]">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-semibold">
                      Quality Certified
                    </p>
                    <p className="text-slate-900 font-bold text-lg">
                      ISO 9001:2015
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Engineered for{" "}
                <span className="text-[#e11d48]">Durability</span> & Performance
              </h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                At Esmerion, we bridge the gap between raw science and
                industrial application. Since our inception, we have been
                dedicated to producing high-grade polymer granules that serve
                the automotive, medical, and consumer goods sectors.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom compounding solutions tailored to client needs.",
                  "Sustainable recycling practices integrated into production.",
                  "Global logistics network ensuring timely delivery.",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#e11d48] mt-1 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 3: PRODUCTS ----------------- */}
      <section id="products" className="py-24 bg-slate-100 relative z-10">
        {/* Trace SVG: Vague Rouge Foncé (Flow) */}
        <SectionTrace type="wave" color="#9f1239" />

        <div className="container mx-auto px-6 relative z-10">
          <SectionTitle
            subtitle="Our Materials"
            title="Versatile Polymer Solutions"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: "specs-hdpe",
                title: "HDPE Granules",
                desc: "High-Density Polyethylene renowned for its high strength-to-density ratio. Ideal for piping and containers.",
                img: "/Hdpe-granules.jpeg",
              },
              {
                id: "specs-pp",
                title: "Polypropylene (PP)",
                desc: "Rugged and resistant to chemical solvents. The go-to choice for automotive parts and textiles.",
                img: "/Polypropylene.jpeg",
                highlight: true,
              },
              {
                id: "specs-pet",
                title: "PET Resins",
                desc: "Crystal clear and lightweight. Perfect for beverage packaging and fiber production.",
                img: "/Pet-resins.jpeg",
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 ${
                  product.highlight ? "border-t-4 border-[#e11d48]" : ""
                }`}
              >
                <div className="h-56 bg-slate-200 relative overflow-hidden">
                  <img
                    src={product.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.title}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-white text-2xl font-bold">
                    {product.title}
                  </h3>
                </div>
                <div className="p-8">
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {product.desc}
                  </p>
                  <button
                    onClick={() => setActiveModal(product.id)}
                    className="inline-flex items-center text-[#e11d48] font-bold tracking-wide hover:text-[#9f1239] transition-colors"
                  >
                    VIEW SPECS <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 4: LOGISTICS ----------------- */}
      <section
        id="logistics"
        className="py-24 bg-white relative z-10 overflow-hidden"
      >
        {/* Trace SVG: Pointillés (Route) */}
        <SectionTrace type="dashed" color="#e11d48" />

        <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-50 transform skew-x-12 translate-x-20 z-0 hidden lg:block"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <SectionTitle
                subtitle="Global Logistics"
                title="Shipping Worldwide"
                align="left"
              />
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Our supply chain is as strong as our polymers. With dedicated
                container fleets and strategic partnerships with major shipping
                lines, we ensure your raw materials arrive on time, anywhere in
                the world.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <Globe2 className="w-8 h-8 text-[#e11d48] mb-2" />
                  <h4 className="font-bold text-slate-900">50+ Countries</h4>
                  <p className="text-sm text-slate-500">
                    Active Export Network
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <Container className="w-8 h-8 text-[#e11d48] mb-2" />
                  <h4 className="font-bold text-slate-900">2000+ TEU</h4>
                  <p className="text-sm text-slate-500">Shipped Annually</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal("logistics-map")}
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e11d48] transition-colors flex items-center gap-2"
              >
                Download Logistics Map <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl relative bg-slate-200 min-h-75">
                {/* Image of Containers */}
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                  alt="Shipping Containers at Port"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#e11d48]/20 mix-blend-multiply"></div>

                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/80 to-transparent text-white">
                  <p className="font-bold text-xl">Port of Export</p>
                  <p className="text-slate-200 text-sm">
                    Real-time tracking available for all bulk orders.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 5: PROCESS / FEATURES ----------------- */}
      <section className="py-24 bg-[#881337] text-white relative z-10 overflow-hidden">
        {/* Trace SVG: Stylo Plume Blanc (Thick Calligraphy) */}
        <SectionTrace type="plume" color="#ffffff" className="opacity-30" />

        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#f43f5e] rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#be123c] rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Esmerion Standard</h2>
            <p className="text-[#fecdd3] max-w-2xl mx-auto">
              We don't just sell plastic; we provide material certainty. Our
              rigorous testing and compounding process ensures every pellet
              meets exact specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FlaskConical,
                title: "R&D Labs",
                desc: "State-of-the-art facilities for custom blends.",
              },
              {
                icon: Recycle,
                title: "Eco-Conscious",
                desc: "Dedicated lines for biodegradable polymers.",
              },
              {
                icon: Truck,
                title: "Rapid Logistics",
                desc: "Strategic warehousing for JIT delivery.",
              },
              {
                icon: ShieldCheck,
                title: "Safety First",
                desc: "Compliant with REACH, RoHS, and FDA.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                <div className="bg-[#e11d48] w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-[#4c0519]/40">
                  <feature.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#fecdd3] text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 6: CONTACT ----------------- */}
      <section id="contact" className="py-24 relative z-10 bg-slate-50">
        {/* Trace SVG: Ligne finale vers point */}
        <SectionTrace type="end" color="#e11d48" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Start Your Project
              </h2>
              <p className="text-slate-600">
                Request a sample kit or get a technical consultation today.
              </p>
            </div>

            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 relative z-10 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img
                src="/esmerion-white.png"
                alt="esmerion-logo"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#e11d48] transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-[#e11d48] transition">
                Twitter
              </a>
              <a href="#" className="hover:text-[#e11d48] transition">
                Facebook
              </a>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between text-sm">
            <p>&copy; 2024 Esmerion Co. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
