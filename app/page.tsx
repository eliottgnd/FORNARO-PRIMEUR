'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { categories, marches } from '@/lib/data'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimateIn } from '@/components/layout/AnimateIn'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroTagRef   = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef   = useRef<HTMLParagraphElement>(null)
  const heroCtasRef  = useRef<HTMLDivElement>(null)
  const heroCardRef  = useRef<HTMLDivElement>(null)
  const heroRightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(heroTagRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(heroTitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.4')
      .fromTo(heroSubRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo(heroCtasRef.current,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')

    gsap.fromTo(heroRightRef.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.3 }
    )
    gsap.fromTo(heroCardRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)', delay: 0.9 }
    )
    gsap.to('.hero-fruits', {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [])

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="hero-section min-h-screen grid grid-cols-1 md:grid-cols-2">

        {/* Gauche */}
        <div className="bg-vert flex flex-col justify-center px-8 md:px-20 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-matcha/20 blur-3xl" />

          <div ref={heroTagRef} className="flex items-center gap-2 bg-matcha/20 border border-matcha/30 rounded-full px-4 py-2 w-fit mb-6 md:mb-8 opacity-0">
            <span className="w-1.5 h-1.5 rounded-full bg-matcha-light animate-pulse-dot" />
            <span className="text-[11px] md:text-[12px] text-matcha-light font-semibold uppercase tracking-widest">
              Livraison les matinées du mardi au vendredi
            </span>
          </div>

          <h1 ref={heroTitleRef} className="font-display text-4xl md:text-6xl text-creme leading-[1.1] mb-4 md:mb-6 opacity-0">
            Le meilleur du<br />marché, livré<br />
            <em className="text-matcha-light">chez vous.</em>
          </h1>

          <p ref={heroSubRef} className="text-creme/60 text-[14px] md:text-[15px] leading-relaxed max-w-sm mb-8 md:mb-12 opacity-0">
            Fruits, légumes frais sélectionnés chaque jour et livrés
            à domicile ou lieu de votre choix (voir zones desservies) par votre primeur.
          </p>

          <div ref={heroCtasRef} className="flex flex-col sm:flex-row gap-3 opacity-0">
            <Link href="/produits">
              <button className="btn-primary w-full sm:w-auto">Commander maintenant</button>
            </Link>
            <Link href="/compte">
              <button className="btn-outline-light w-full sm:w-auto">Creer mon compte</button>
            </Link>
          </div>
        </div>

        {/* Droite */}
        <div ref={heroRightRef} className="flex flex-col bg-creme opacity-0 min-h-[400px] md:min-h-0">
          <div className="flex-1 bg-gradient-to-br from-green-100 to-green-200 relative flex items-end p-6 md:p-8 overflow-hidden">
            <div className="hero-fruits absolute inset-0 flex items-center justify-center text-[80px] md:text-[140px] opacity-25 select-none">
              🍓🍊🥝
            </div>
            <div ref={heroCardRef} className="relative z-10 bg-white rounded-2xl p-3 md:p-4 flex gap-3 shadow-xl max-w-xs opacity-0">
              <span className="text-2xl md:text-3xl">🍓</span>
              <div>
                <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-matcha">
                  Le conseil du primeur
                </p>
                <p className="text-[12px] md:text-[13px] text-texte leading-snug mt-1">
                  Les fraises sont particulierement sucrees cette semaine.
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

      {/* ── COMMENT CA FONCTIONNE ──────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader eyebrow="Simple et rapide" title="Comment ca fonctionne ?" />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          {[
            { num: '1', icon: '🛍️', titre: 'Je choisis mes produits',  desc: 'Parcourez notre sélection.' },
            { num: '2', icon: '📦', titre: 'Je passe commande',         desc: 'Validez votre panier. Choisissez votre créneau de livraison.' },
            { num: '3', icon: '🌅', titre: 'Notre équipe prépare',      desc: 'Chaque matin, nous sélectionnons et préparons votre commande sur le marché.' },
            { num: '4', icon: '🚐', titre: 'Livré chez vous',           desc: 'Vos produits sont livrés frais à votre porte, directement depuis les halles de Biarritz.', cta: true },
          ].map((s, i) => (
            <AnimateIn key={s.num} delay={i * 0.1} direction="up">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-creme-dark relative h-full">
                <span className="absolute top-5 right-6 font-display text-5xl md:text-6xl text-creme-dark leading-none">
                  {s.num}
                </span>
                <div className="text-3xl mb-4 md:mb-5">{s.icon}</div>
                <h3 className="font-display text-[16px] md:text-[18px] text-vert mb-2">{s.titre}</h3>
                <p className="text-[12px] md:text-[13px] text-gris leading-relaxed">{s.desc}</p>
                {s.cta && (
                  <Link href="/compte">
                    <button className="btn-primary mt-4 md:mt-6 text-[13px] w-full sm:w-auto">Creer mon compte</button>
                  </Link>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      <section className="bg-creme px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader eyebrow="Explorer" title="Nos produits par categories" />
        </AnimateIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.map((cat, i) => (
            <AnimateIn key={cat.id} delay={i * 0.1} direction="up">
              <Link href={`/produits?categorie=${cat.id}`}>
                <div className={`relative rounded-3xl overflow-hidden aspect-[3/2] bg-gradient-to-br ${cat.bg} cursor-pointer hover:scale-[1.02] transition-transform`}>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-7xl opacity-40">
                    {cat.emoji}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-vert/80 to-transparent p-3 md:p-5">
                    <p className="font-display text-base md:text-xl text-white">{cat.label}</p>
                    <p className="text-[11px] md:text-[12px] text-white/70 mt-0.5 hidden md:block">{cat.description}</p>
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
        <AnimateIn direction="left" className="bg-creme-dark px-8 md:px-20 py-12 md:py-16 flex flex-col justify-center">
          <p className="section-eyebrow mb-4">Notre histoire</p>
          <p className="font-display text-[24px] md:text-[32px] text-vert leading-snug mb-6">
            Chez Fornaro Primeur, nous sélectionnons chaque jour des fruits et légumes{' '}
            <em className="text-matcha">frais, de saison.</em>
          </p>
          <p className="text-[13px] md:text-[14px] text-gris leading-relaxed">
            Avec une attention particulière portée a la qualité et au goût, afin de vous
            proposer des produits authentiques qui respectent le travail des producteurs
            et le bien manger.
          </p>
        </AnimateIn>
        <AnimateIn direction="right" className="bg-gradient-to-br from-vert-light to-vert flex items-center justify-center text-[80px] md:text-[120px] relative overflow-hidden min-h-[240px] md:min-h-0">
          <span className="opacity-50">🌿</span>
        </AnimateIn>
      </div>

      {/* ── MARCHES ────────────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader eyebrow="Nous retrouver" title="Venez nous rencontrer au marché" />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {marches.map((m, i) => (
            <AnimateIn key={m.id} delay={i * 0.15} direction="up">
              <div className="rounded-3xl overflow-hidden border border-creme-dark">
                <div className="h-36 md:h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-5xl md:text-6xl">
                  {m.emoji}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-display text-lg md:text-xl text-vert">{m.nom}</h3>
                  <p className="text-[12px] md:text-[13px] text-gris mt-2 leading-relaxed">
                    {m.adresse}<br />{m.ville}
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
              <Link href="/produits" className="text-[13px] text-creme/50 hover:text-creme">
                Voir tout
              </Link>
            }
          />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4">
          {[
            { emoji: '🍓', titre: 'Produits en promotion !', desc: 'Ne passez pas a côté de nos offres fraîches de la semaine.', tag: 'Découvrir' },
            { emoji: '🥗', titre: 'Panier de saison',        desc: 'Composez votre panier avec nos produits de saison.', tag: 'Offre limitee' },
          ].map((promo, i) => (
            <AnimateIn key={promo.titre} delay={i * 0.15} direction="up">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex items-center gap-4 md:gap-6">
                <span className="text-4xl md:text-5xl">{promo.emoji}</span>
                <div>
                  <p className="font-display text-lg md:text-xl text-creme">{promo.titre}</p>
                  <p className="text-[12px] md:text-[13px] text-creme/60 mt-2 leading-relaxed">{promo.desc}</p>
                  <span className="inline-block mt-3 bg-matcha text-white text-[12px] font-bold px-3 py-1 rounded-full">
                    {promo.tag}
                  </span>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>
    </>
  )
}