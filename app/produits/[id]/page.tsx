'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { produits } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { ArrowLeft, ShoppingBasket, Heart } from 'lucide-react'
import { useState } from 'react'

export default function FicheProduit() {
  const { id }    = useParams()
  const produit   = produits.find((p) => p.id === id)
  const [quantite, setQuantite] = useState(1)
  const [ajoute,   setAjoute]   = useState(false)

  const produitsLies = produits
    .filter((p) => p.categorie === produit?.categorie && p.id !== id)
    .slice(0, 4)

  if (!produit) {
    return (
      <div className="pt-[80px] min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-5xl mb-4">🥲</p>
          <p className="font-display text-2xl text-vert mb-2">Produit introuvable</p>
          <Link href="/produits">
            <button className="btn-primary mt-4">Retour aux produits</button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAjouter = () => {
    setAjoute(true)
    setTimeout(() => setAjoute(false), 2000)
  }

  return (
    <div className=" min-h-screen bg-blanc">

      {/* Retour */}
      <div className="px-6 md:px-20 pt-6 pb-2 md:py-6">
        <Link
          href="/produits"
          className="flex items-center gap-2 text-[13px] text-gris hover:text-vert transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Retour aux produits
        </Link>
      </div>

      {/* ── FICHE PRINCIPALE ─────────────────────────────────── */}
      <div className="px-6 md:px-20 pb-12 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

        {/* Visuel */}
        <AnimateIn direction="left">
          <div
            className="rounded-3xl aspect-square flex items-center justify-center text-[120px] md:text-[180px] relative overflow-hidden"
            style={{ backgroundColor: produit.bgColor }}
          >
            <span className="select-none">{produit.emoji}</span>
            {produit.badge && (
              <span className="absolute top-4 right-4 md:top-5 md:right-5">
                <Badge label={produit.badge} variant="vert" />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </div>
        </AnimateIn>

        {/* Infos */}
        <AnimateIn direction="right">
          <div className="py-0 md:py-4">

            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="section-eyebrow">{produit.categorie}</span>
              <span className="text-gris">·</span>
              <span className="text-[13px] text-gris">{produit.origine}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-vert mb-3 md:mb-4">{produit.nom}</h1>

            <p className="text-[14px] md:text-[15px] text-gris leading-relaxed mb-6 md:mb-8">
              {produit.description}
            </p>

            <div className="flex gap-2 flex-wrap mb-6 md:mb-8">
              {produit.sousTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-creme text-gris text-[11px] md:text-[12px] border border-creme-dark"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-baseline gap-2 mb-6 md:mb-8">
              <span className="font-display text-4xl md:text-5xl text-vert">
                {produit.prix.toFixed(2)}€
              </span>
              <span className="text-gris text-[14px] md:text-[15px]">/ {produit.unite}</span>
            </div>

            {/* Quantite + Ajouter */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 bg-creme rounded-2xl px-3 md:px-4 py-2.5 md:py-3 border border-creme-dark">
                <button
                  onClick={() => setQuantite(Math.max(1, quantite - 1))}
                  className="w-7 h-7 rounded-full bg-white border border-creme-dark text-vert font-semibold hover:bg-vert hover:text-white transition-colors grid place-items-center"
                >
                  -
                </button>
                <span className="font-display text-xl text-vert w-5 text-center">{quantite}</span>
                <button
                  onClick={() => setQuantite(quantite + 1)}
                  className="w-7 h-7 rounded-full bg-white border border-creme-dark text-vert font-semibold hover:bg-vert hover:text-white transition-colors grid place-items-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAjouter}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-[13px] md:text-[14px] transition-all ${
                  ajoute
                    ? 'bg-matcha text-white scale-[0.98]'
                    : 'bg-vert text-white hover:bg-vert-mid'
                }`}
              >
                <ShoppingBasket size={16} />
                {ajoute ? 'Ajoute !' : `Ajouter — ${(produit.prix * quantite).toFixed(2)}€`}
              </button>

              <button className="w-11 h-11 md:w-12 md:h-12 rounded-2xl border border-creme-dark grid place-items-center text-gris hover:text-vert hover:border-vert transition-colors shrink-0">
                <Heart size={17} />
              </button>
            </div>

            {/* Livraison */}
            <div className="bg-creme rounded-2xl px-4 md:px-5 py-3 md:py-4 flex items-center gap-3 border border-creme-dark">
              <span className="text-xl md:text-2xl">🚐</span>
              <div>
                <p className="text-[12px] md:text-[13px] font-medium text-vert">
                  Livraison le lendemain matin
                </p>
                <p className="text-[11px] md:text-[12px] text-gris mt-0.5">
                  Commandez avant 20h — Biarritz et Hendaye
                </p>
              </div>
            </div>

          </div>
        </AnimateIn>
      </div>

      {/* ── PRODUITS LIES ────────────────────────────────────── */}
      {produitsLies.length > 0 && (
        <section className="bg-creme px-6 md:px-20 py-12 md:py-16">
          <AnimateIn>
            <h2 className="font-display text-2xl md:text-3xl text-vert mb-6 md:mb-8">
              Vous aimerez aussi
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {produitsLies.map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.08} direction="up">
                <Link href={`/produits/${p.id}`}>
                  <div className="card cursor-pointer group">
                    <div
                      className="aspect-square flex items-center justify-center text-4xl md:text-5xl"
                      style={{ backgroundColor: p.bgColor }}
                    >
                      <span className="transition-transform group-hover:scale-110 duration-300">
                        {p.emoji}
                      </span>
                    </div>
                    <div className="p-3 md:p-4">
                      <p className="text-[13px] md:text-[14px] font-medium text-texte">{p.nom}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-display text-[14px] md:text-[15px] text-vert">
                          {p.prix.toFixed(2)}€
                          <span className="text-[10px] md:text-[11px] font-body text-gris"> /{p.unite}</span>
                        </span>
                      </div>
                      <button className="mt-2 md:mt-3 w-full py-2 rounded-xl bg-creme text-vert text-[12px] font-medium hover:bg-vert hover:text-white transition-colors">
                        + Ajouter
                      </button>
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}