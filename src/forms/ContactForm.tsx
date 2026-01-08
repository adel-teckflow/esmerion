import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // @ts-ignore
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center p-10 bg-green-50 rounded-xl border border-green-200">
        <h3 className="text-2xl font-bold text-green-800">Thank you!</h3>
        <p className="text-green-600">
          Your message has been sent successfully. We will contact you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-[#e11d48] font-bold"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      name="contact-esmerion" // Nom du formulaire (apparaîtra sur Netlify)
      method="POST"
      data-netlify="true" // Dit à Netlify d'intercepter l'envoi
      onSubmit={handleSubmit}
    >
      {/* Champ caché indispensable pour React/Vite */}
      <input type="hidden" name="form-name" value="contact-esmerion" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="first_name" // INDISPENSABLE : sans 'name', la donnée est perdue
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#e11d48] focus:ring-2 focus:ring-[#fecdd3] outline-none transition"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last_name" // INDISPENSABLE
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#e11d48] focus:ring-2 focus:ring-[#fecdd3] outline-none transition"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email" // INDISPENSABLE
          required
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#e11d48] focus:ring-2 focus:ring-[#fecdd3] outline-none transition"
          placeholder="john@company.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Polymer Interest
        </label>
        <select
          name="polymer_interest" // INDISPENSABLE
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#e11d48] focus:ring-2 focus:ring-[#fecdd3] outline-none transition"
        >
          <option value="HDPE">HDPE</option>
          <option value="LDPE">LDPE</option>
          <option value="PP">PP</option>
          <option value="PET">PET</option>
          <option value="PVC">PVC</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Message
        </label>
        <textarea
          name="message" // INDISPENSABLE
          rows={4}
          required
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#e11d48] focus:ring-2 focus:ring-[#fecdd3] outline-none transition"
          placeholder="Tell us about your requirements..."
        ></textarea>
      </div>

      <motion.button
        type="submit" // Assure-toi que c'est un bouton de type submit
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-[#e11d48] text-white font-bold rounded-lg shadow-lg shadow-[#f43f5e]/30 transition"
      >
        Send Inquiry
      </motion.button>
    </form>
  );
}
