"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories, marches } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimateIn } from "@/components/layout/AnimateIn";
import { AuthModal } from "@/components/ui/AuthModal";
import { calculateDiscount } from "@/lib/price-utils";
import { getProductImage } from "@/lib/product-image-utils";
import {
  IconPanier,
  IconColis,
  IconAube,
  IconCamion,
  CategoryIcon,
} from "@/components/ui/Illustrations";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroTagRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [zones, setZones] = useState<string[]>([]);
  const [conseil, setConseil] = useState({ emoji: '🍓', titre: 'Le conseil du primeur', texte: 'Les fraises sont particulièrement sucrées cette semaine.' });
  const [promoProducts, setPromoProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/delivery-settings")
      .then((r) => r.json())
      .then((data) => setZones(data.zonesActives ?? []))
      .catch(() => {});
    fetch("/api/conseil")
      .then((r) => r.json())
      .then((data) => setConseil(data))
      .catch(() => {});
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) =>
        setPromoProducts(
          (Array.isArray(data) ? data : []).filter(
            (p: any) => Array.isArray(p.promotions) && p.promotions.length > 0,
          ),
        ),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      !heroTagRef.current ||
      !heroTitleRef.current ||
      !heroSubRef.current ||
      !heroCtasRef.current ||
      !heroCardRef.current ||
      !heroRightRef.current
    ) {
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      heroTagRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
    )
      .fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.4",
      )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5",
      )
      .fromTo(
        heroCtasRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4",
      );

    gsap.fromTo(
      heroRightRef.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 1.1, ease: "power3.out", delay: 0.3 },
    );
    gsap.fromTo(
      heroCardRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 0.9,
      },
    );
    gsap.to(".hero-fruits", {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="hero-section min-h-screen grid grid-cols-1 md:grid-cols-2">
        {/* Gauche */}
        <div className="bg-vert flex flex-col justify-center px-8 md:px-20 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-matcha/20 blur-3xl" />

          <div
            ref={heroTagRef}
            className="flex items-center gap-2 bg-matcha/20 border border-matcha/30 rounded-full px-4 py-2 w-fit mb-6 md:mb-8 opacity-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-matcha-light animate-pulse-dot" />
            <span className="text-[11px] md:text-[12px] text-matcha-light font-semibold uppercase tracking-widest">
              Livraison les matinées du mardi au vendredi
            </span>
          </div>

          {zones.length > 0 && (
            <div className="mb-6 md:mb-8">
              <p className="text-[9px] md:text-[10px] text-creme/40 uppercase tracking-widest mb-2">
                Villes desservies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {zones.map((ville) => (
                  <span
                    key={ville}
                    className="text-[9px] md:text-[10px] text-creme/70 bg-white/5 border border-white/10 rounded px-2 py-0.5 font-normal"
                  >
                    {ville}
                  </span>
                ))}
              </div>
            </div>
          )}

          <h1
            ref={heroTitleRef}
            className="font-display text-4xl md:text-6xl text-creme leading-[1.1] mb-4 md:mb-6 opacity-0"
          >
            Le meilleur du
            <br />
            marché, livré
            <br />
            <em className="text-matcha-light">chez vous.</em>
          </h1>

          <p
            ref={heroSubRef}
            className="text-creme/60 text-[14px] md:text-[15px] leading-relaxed max-w-sm mb-8 md:mb-12 opacity-0"
          >
            Fruits et légumes frais sélectionnés chaque jour et livrés à
            domicile ou lieu de votre choix (voir zones desservies) par votre
            primeur.
          </p>

          <div
            ref={heroCtasRef}
            className="flex flex-col sm:flex-row gap-3 opacity-0"
          >
            <Link href="/produits">
              <button className="btn-primary w-full sm:w-auto">
                Commander maintenant
              </button>
            </Link>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="btn-outline-light w-full sm:w-auto"
            >
              Creer mon compte
            </button>
          </div>
        </div>

        {/* Droite */}
        <div
          ref={heroRightRef}
          className="flex flex-col bg-creme opacity-0 min-h-[400px] md:min-h-0"
        >
          <div className="flex-1 relative flex items-end p-6 md:p-8 overflow-hidden">
            <video
              src="/images/hero-bg.webm"
              poster="/images/hero-bg.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Fruits et légumes frais"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />

            <div
              ref={heroCardRef}
              className="relative z-10 bg-white rounded-2xl p-3 md:p-4 flex gap-3 shadow-xl max-w-xs opacity-0"
            >
              <span className="text-2xl md:text-3xl">{conseil.emoji}</span>
              <div>
                <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-matcha">
                  {conseil.titre}
                </p>
                <p className="text-[12px] md:text-[13px] text-texte leading-snug mt-1">
                  {conseil.texte}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-creme-dark px-6 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[12px] md:text-[13px] text-gris">
              <span className="w-2 h-2 rounded-full bg-matcha shrink-0" />
              <span>Fruits et legumes frais du jour</span>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* ── COMMENT CA FONCTIONNE ──────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader
            eyebrow="Simple et rapide"
            title="Comment ca fonctionne ?"
          />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          {[
            {
              num: "1",
              Icon: IconPanier,
              titre: "Je choisis mes produits",
              desc: "Parcourez notre sélection.",
            },
            {
              num: "2",
              Icon: IconColis,
              titre: "Je passe commande",
              desc: "Validez votre panier. Choisissez votre créneau de livraison.",
            },
            {
              num: "3",
              Icon: IconAube,
              titre: "Notre équipe prépare",
              desc: "Chaque matin, nous sélectionnons et préparons votre commande sur le marché.",
            },
            {
              num: "4",
              Icon: IconCamion,
              titre: "Livré chez vous",
              desc: "Vos produits sont livrés frais à votre porte, directement depuis les halles de Biarritz.",
              cta: true,
            },
          ].map((s, i) => (
            <AnimateIn key={s.num} delay={i * 0.1} direction="up">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-creme-dark relative h-full">
                <span className="absolute top-5 right-6 font-display text-5xl md:text-6xl text-creme-dark leading-none">
                  {s.num}
                </span>
                <div className="mb-4 md:mb-5 w-12 h-12 rounded-2xl bg-creme flex items-center justify-center text-vert">
                  <s.Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-[16px] md:text-[18px] text-vert mb-2">
                  {s.titre}
                </h3>
                <p className="text-[12px] md:text-[13px] text-gris leading-relaxed">
                  {s.desc}
                </p>
                {s.cta && (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="btn-primary mt-4 md:mt-6 text-[13px] w-full sm:w-auto"
                  >
                    Creer mon compte
                  </button>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      <section className="bg-creme px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader
            eyebrow="Explorer"
            title="Nos produits par categories"
          />
        </AnimateIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.map((cat, i) => (
            <AnimateIn key={cat.id} delay={i * 0.1} direction="up">
              <Link href={`/produits?categorie=${cat.id}`}>
                <div
                  className={`relative rounded-3xl overflow-hidden aspect-[3/2] bg-gradient-to-br ${cat.bg} cursor-pointer hover:scale-[1.02] transition-transform`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-vert/40">
                    <CategoryIcon
                      id={cat.id}
                      className="w-20 h-20 md:w-28 md:h-28"
                      strokeWidth={1.3}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-vert/80 to-transparent p-3 md:p-5">
                    <p className="font-display text-base md:text-xl text-white">
                      {cat.label}
                    </p>
                    <p className="text-[11px] md:text-[12px] text-white/70 mt-0.5 hidden md:block">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
        <AnimateIn delay={0.2}>
          <div className="flex justify-center mt-8 md:mt-10">
            <Link href="/produits">
              <button className="btn-outline-dark">Acceder aux produits</button>
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* ── A PROPOS ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        <AnimateIn
          direction="left"
          className="bg-creme-dark px-8 md:px-20 py-12 md:py-16 flex flex-col justify-center"
        >
          <p className="section-eyebrow mb-4">Notre histoire</p>
          <p className="font-display text-[24px] md:text-[32px] text-vert leading-snug mb-6">
            Chez Fornaro Primeur, nous sélectionnons chaque jour des fruits et
            légumes <em className="text-matcha">frais, de saison.</em>
          </p>
          <p className="text-[13px] md:text-[14px] text-gris leading-relaxed">
            Avec une attention particulière portée a la qualité et au goût, afin
            de vous proposer des produits authentiques qui respectent le travail
            des producteurs et le bien manger.
          </p>
        </AnimateIn>
        <AnimateIn
          direction="right"
          className="relative overflow-hidden min-h-[240px] md:min-h-0"
        >
          <Image
            src="/images/accueil-1.jpg"
            alt="Fornaro Primeur"
            fill
            className="object-cover"
          />
        </AnimateIn>
      </div>

      {/* ── MARCHES ────────────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader
            eyebrow="Nous retrouver"
            title="Venez nous rencontrer au marché"
          />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {marches.map((m, i) => (
            <AnimateIn key={m.id} delay={i * 0.15} direction="up">
              <div className="rounded-3xl overflow-hidden border border-creme-dark">
                <div className="h-36 md:h-72 relative overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.nom}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "50% 75%" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl">
                      {m.emoji}
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-display text-lg md:text-xl text-vert">
                    {m.nom}
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-gris mt-2 leading-relaxed">
                    {m.adresse}
                    <br />
                    {m.ville}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── PROMOTIONS ─────────────────────────────────────────── */}
      <section className="bg-vert px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader
            eyebrow="Offres du moment"
            title="Promotions"
            action={
              <Link
                href="/produits?promo=1"
                className="text-[13px] text-creme/50 hover:text-creme"
              >
                Voir tout
              </Link>
            }
          />
        </AnimateIn>

        {promoProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-4">
            {promoProducts.slice(0, 4).map((p, i) => {
              const {
                originalPrice,
                discountedPrice,
                hasPromotion,
                discountPercent,
                promotionType,
                promotion,
              } = calculateDiscount(p);
              const label =
                promotionType === "bundle"
                  ? `${promotion.bundleQuantity} pour ${promotion.bundlePrice}€`
                  : promotionType === "fixed"
                    ? `-${promotion.discountAmount}€`
                    : `-${discountPercent}%`;
              return (
                <AnimateIn key={p.id} delay={i * 0.1} direction="up">
                  <Link href={`/produits/${p.id}`}>
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer h-full">
                      <div className="aspect-square relative overflow-hidden bg-white/5">
                        <Image
                          src={getProductImage(p)}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                        <span className="absolute top-2 right-2 bg-matcha text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {label}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="font-display text-base md:text-lg text-creme">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {hasPromotion && promotionType !== "bundle" && (
                            <span className="text-[12px] text-creme/40 line-through">
                              {originalPrice.toFixed(2)}€
                            </span>
                          )}
                          <span className="font-display text-lg text-matcha-light">
                            {discountedPrice.toFixed(2)}€
                            <span className="text-[11px] font-body text-creme/50">
                              {" "}
                              /{p.unit}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4">
            {[
              {
                emoji: "🍓",
                titre: "Produits en promotion !",
                desc: "Ne passez pas a côté de nos offres fraîches de la semaine.",
                tag: "Découvrir",
              },
              {
                emoji: "🥗",
                titre: "Panier de saison",
                desc: "Composez votre panier avec nos produits de saison.",
                tag: "Offre limitee",
              },
            ].map((promo, i) => (
              <AnimateIn key={promo.titre} delay={i * 0.15} direction="up">
                <Link href="/produits">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex items-center gap-4 md:gap-6 hover:scale-[1.01] transition-transform cursor-pointer">
                    <span className="text-4xl md:text-5xl">{promo.emoji}</span>
                    <div>
                      <p className="font-display text-lg md:text-xl text-creme">
                        {promo.titre}
                      </p>
                      <p className="text-[12px] md:text-[13px] text-creme/60 mt-2 leading-relaxed">
                        {promo.desc}
                      </p>
                      <span className="inline-block mt-3 bg-matcha text-white text-[12px] font-bold px-3 py-1 rounded-full">
                        {promo.tag}
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
