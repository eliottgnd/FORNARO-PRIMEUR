'use client'

import Link from 'next/link'
import { marches } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { SectionHeader } from '@/components/ui/SectionHeader'

const equipe = [
  { prenom: 'Jean-François', nom: 'Fornaro', role: 'Fondateur & Primeur',    emoji: '👨‍🌾' },
  { prenom: 'Audrey',        nom: '',         role: '',                        emoji: '👩‍🍳' },
  { prenom: 'Sébastien',     nom: '',         role: '',                        emoji: '🚐'  },
  { prenom: 'Léa',           nom: '',         role: '',                        emoji: '💬'  },
  { prenom: 'Frédéric',      nom: '',         role: '',                        emoji: '🔍'  },
]

const valeurs = [
  { icon: '🌱', titre: 'Fraîcheur',  desc: 'Chaque produit est sélectionné avec rigueur chez nos producteurs.' },
  { icon: '🤝', titre: 'Confiance',  desc: 'Nous travaillons depuis de nombreuses années avec des producteurs passionnés.' },
  { icon: '🌍', titre: 'Engagement', desc: 'Produits de saison, circuits courts et emballages réduits au maximum.' },
  { icon: '❤️', titre: 'Passion',    desc: 'Le goût et la qualité sont au cœur de chaque décision que nous prenons.' },
]

export default function APropos() {
  return (
    <div className="min-h-screen bg-blanc">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px] md:min-h-[560px]">

        <div className="bg-vert px-8 md:px-20 py-16 md:py-20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-matcha/15 blur-3xl" />
          <AnimateIn>
            <p className="section-eyebrow text-matcha-light mb-4">Notre histoire</p>
            <h1 className="font-display text-4xl md:text-5xl text-creme leading-tight mb-6">
              Chez Fornaro<br />
              <em className="text-matcha-light">Primeur,</em>
            </h1>
            <p className="text-creme/60 text-[14px] md:text-[15px] leading-relaxed max-w-sm">
              Nous sélectionnons chaque jour des fruits et légumes frais, de saison,
              avec une attention particulière portée à la qualité et au goût, afin de
              vous proposer des produits authentiques qui respectent le travail des
              producteurs et le plaisir de bien manger.
            </p>
          </AnimateIn>
        </div>

        <AnimateIn direction="right" className="bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden min-h-[280px] md:min-h-0">
          <div className="absolute inset-0 flex items-center justify-center text-[140px] md:text-[200px] opacity-20 select-none">
            🌿
          </div>
          <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-white/40 border-2 border-dashed border-white/60 flex flex-col items-center justify-center gap-3">
            <span className="text-3xl md:text-4xl opacity-50">📷</span>
            <p className="text-[11px] md:text-[12px] text-vert/50 font-medium text-center px-4">
              Photo du marché<br />ou de l'équipe
            </p>
          </div>
        </AnimateIn>
      </div>

      {/* ── NOS VALEURS ──────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24 bg-blanc">
        <AnimateIn>
          <SectionHeader eyebrow="Ce qui nous guide" title="Nos valeurs" />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {valeurs.map((v, i) => (
            <AnimateIn key={v.titre} delay={i * 0.1} direction="up">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-creme-dark h-full">
                <div className="text-3xl md:text-4xl mb-4 md:mb-5">{v.icon}</div>
                <h3 className="font-display text-lg md:text-xl text-vert mb-2 md:mb-3">{v.titre}</h3>
                <p className="text-[12px] md:text-[13px] text-gris leading-relaxed">{v.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ─────────────────────────────────────── */}
      <section className="bg-creme px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
        </AnimateIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {equipe.map((membre, i) => (
            <AnimateIn key={membre.prenom} delay={i * 0.1} direction="up">
              <div className="bg-white rounded-3xl overflow-hidden border border-creme-dark">
                <div className="aspect-square bg-gradient-to-br from-creme to-creme-dark flex flex-col items-center justify-center gap-3 relative">
                  <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-white/60 border-2 border-dashed border-creme-dark flex flex-col items-center justify-center gap-1 md:gap-2">
                      <span className="text-xl md:text-3xl opacity-40">📷</span>
                      <p className="text-[9px] md:text-[10px] text-gris/50 text-center">Photo</p>
                    </div>
                  </div>
                  <span className="text-4xl md:text-6xl relative z-10 opacity-20 select-none">
                    {membre.emoji}
                  </span>
                </div>
                <div className="p-3 md:p-5">
                  <p className="font-display text-sm md:text-lg text-vert">
                    {membre.prenom} <span className="font-semibold">{membre.nom}</span>
                  </p>
                  {membre.role && (
                    <p className="text-[11px] md:text-[12px] text-matcha font-medium mt-1">{membre.role}</p>
                  )}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ───────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24 bg-blanc">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <AnimateIn direction="left">
            <p className="section-eyebrow mb-4">Depuis toujours</p>
            <h2 className="section-title mb-6">Une passion transmise de génération en génération</h2>
            <p className="text-[13px] md:text-[14px] text-gris leading-relaxed mb-4">
              Tout à commencé dans les années 80 avec Marcel FORNARO, fondateur, qui s'est implaté
              sur différents marchés dont les Halles de Biarritz et le marché d'Hendaye, créant une entreprises familiale, rejoint par sa femme et ses enfants.
            </p>
            <p className="text-[13px] md:text-[14px] text-gris leading-relaxed mb-4">
              Repris il y a une quinzaine d'années par le benjamin de la famille Jean-François.
            </p>
            <p className="text-[13px] md:text-[14px] text-gris leading-relaxed">
              Aujourd'hui, il a su conserver ces valeurs en continuant de se développer et à travailler avec des
              producteurs de confiance. Sans compter sur les centaines de clients fidèles, sans qui, rien ne serait possible.
            </p>
          </AnimateIn>
          <AnimateIn direction="right">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-creme to-creme-dark border-2 border-dashed border-creme-dark flex flex-col items-center justify-center gap-3">
              <span className="text-4xl md:text-5xl opacity-30">📷</span>
              <p className="text-[12px] md:text-[13px] text-gris/40 text-center">
                Photo de l'équipe<br />ou du marché
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ────────────────────────────────────── */}
      <section className="bg-vert px-6 md:px-20 py-14 md:py-20">
        <AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { num: '40+',  label: "Années d'expérience"   },
              { num: '150+', label: 'Produits sélectionnés' },
              { num: '2',    label: 'Marchés partenaires'   },
              { num: '500+', label: 'Clients satisfaits'    },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl md:text-5xl text-matcha-light mb-2">{s.num}</div>
                <div className="text-[12px] md:text-[13px] text-creme/50">{s.label}</div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </section>

      {/* ── NOS MARCHÉS ──────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <AnimateIn>
          <SectionHeader eyebrow="Nous retrouver" title="Venez nous rencontrer au marché" />
        </AnimateIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {marches.map((m, i) => (
            <AnimateIn key={m.id} delay={i * 0.15} direction="up">
              <div className="rounded-3xl overflow-hidden border border-creme-dark">
                <div className="h-40 md:h-56 bg-gradient-to-br from-green-100 to-green-200 flex flex-col items-center justify-center gap-3 relative">
                  <span className="text-5xl md:text-6xl opacity-40">{m.emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-dashed border-white/40 rounded-2xl px-6 md:px-8 py-3 md:py-4 flex flex-col items-center gap-1 md:gap-2">
                      <span className="text-xl md:text-2xl opacity-40">📷</span>
                      <p className="text-[10px] md:text-[11px] text-vert/40">Photo du marché</p>
                    </div>
                  </div>
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

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section className="bg-creme px-6 md:px-20 py-16 md:py-20 text-center">
        <AnimateIn>
          <p className="section-eyebrow mb-4">Prêt à commander ?</p>
          <h2 className="font-display text-3xl md:text-4xl text-vert mb-6">
            Découvrez nos produits frais
          </h2>
          <Link href="/produits">
            <button className="btn-primary text-[14px] md:text-[15px] px-8 md:px-10 py-3 md:py-4">
              Commander maintenant
            </button>
          </Link>
        </AnimateIn>
      </section>

    </div>
  )
}