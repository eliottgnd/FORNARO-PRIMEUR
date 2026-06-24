"use client";

import { useState } from "react";
import Image from "next/image";
import { marches } from "@/lib/data";
import { AnimateIn } from "@/components/layout/AnimateIn";
import { Send, MapPin, Clock, Phone, Mail } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [envoye, setEnvoye] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setEnvoye(true);
    setTimeout(() => setEnvoye(false), 3000);
  };

  return (
    <div className=" min-h-screen bg-blanc">
      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-vert px-6 md:px-20 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-matcha/10 blur-3xl" />
        <AnimateIn>
          <p className="section-eyebrow text-matcha-light mb-3">On est là</p>
          <h1 className="font-display text-4xl md:text-5xl text-creme mb-4">
            Contactez-nous
          </h1>
          <p className="text-creme/50 text-[14px] md:text-[15px] max-w-md">
            Une question, une suggestion ou une commande spéciale ? On vous
            répond dans les plus brefs délais.
          </p>
        </AnimateIn>
      </div>

      <div className="px-6 md:px-20 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {/* ── FORMULAIRE ───────────────────────────────────────── */}
        <AnimateIn direction="left">
          <h2 className="font-display text-2xl md:text-3xl text-vert mb-6 md:mb-8">
            Envoyez-nous un message
          </h2>

          <div className="space-y-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Jean"
                  value={form.prenom}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="jean@email.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                placeholder="+33 00 00 00 00 00"
                value={form.telephone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Sujet */}
            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Sujet
              </label>
              <select
                name="sujet"
                value={form.sujet}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Choisir un sujet</option>
                <option value="commande">Question sur une commande</option>
                <option value="livraison">Livraison</option>
                <option value="produit">Question sur un produit</option>
                <option value="partenariat">Partenariat producteur</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Votre message..."
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
              />
            </div>

            {/* Bouton */}
            <button
              onClick={handleSubmit}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 md:py-4 font-semibold text-[14px] transition-all ${
                envoye
                  ? "bg-matcha text-white scale-[0.98]"
                  : "bg-vert text-white hover:bg-vert-mid"
              }`}
            >
              <Send size={16} />
              {envoye ? "Message envoyé !" : "Envoyer le message"}
            </button>
          </div>
        </AnimateIn>

        {/* ── INFOS CONTACT ────────────────────────────────────── */}
        <AnimateIn direction="right">
          <h2 className="font-display text-2xl md:text-3xl text-vert mb-6 md:mb-8">
            Nos coordonnées
          </h2>

          <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
            {[
              {
                icon: Mail,
                label: "Email",
                valeur: "jf.fornaro.pro@gmail.com",
              },
              { icon: Phone, label: "Téléphone", valeur: "+33 06 35 12 33 74" },
              {
                icon: Clock,
                label: "Horaires",
                valeur: "Mar-Ven : 7h00 – 20h00",
              },
            ].map((info) => (
              <div
                key={info.label}
                className="flex items-center gap-3 md:gap-4 bg-white rounded-2xl p-4 md:p-5 border border-creme-dark"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-creme flex items-center justify-center text-matcha shrink-0">
                  <info.icon size={17} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gris">
                    {info.label}
                  </p>
                  <p className="text-[13px] md:text-[14px] text-texte font-medium mt-0.5">
                    {info.valeur}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Marchés */}
          <h3 className="font-display text-lg md:text-xl text-vert mb-4 md:mb-5">
            Nos marchés
          </h3>
          <div className="space-y-3 md:space-y-4">
            {marches.map((m) => (
              <div
                key={m.id}
                className="bg-creme rounded-2xl border border-creme-dark overflow-hidden"
              >
                {m.image && (
                  <div className="relative h-36 md:h-44 w-full overflow-hidden">
                    <Image
                      src={m.image}
                      alt={m.nom}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "50% 75%" }}
                    />
                  </div>
                )}
                <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white flex items-center justify-center text-matcha border border-creme-dark shrink-0">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <p className="text-[13px] md:text-[14px] font-semibold text-vert">
                      {m.nom}
                    </p>
                    <p className="text-[12px] md:text-[13px] text-gris mt-0.5 leading-relaxed">
                      {m.adresse}
                      <br />
                      {m.ville}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
