import { commandes } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'

export default function Commandes() {
  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Espace client</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Mes commandes</h1>
      </AnimateIn>

      <div className="space-y-4">
        {commandes.map((cmd, i) => (
          <AnimateIn key={cmd.id} delay={i * 0.1}>
            <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">

              {/* Header */}
              <div className="px-4 md:px-6 py-4 bg-creme flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-vert text-[13px] md:text-[14px]">{cmd.id}</p>
                  <p className="text-[11px] md:text-[12px] text-gris mt-0.5">{cmd.date}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <span className={`text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                    cmd.paiement === 'payee'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-orange-50 text-orange-500'
                  }`}>
                    {cmd.paiement === 'payee' ? 'Payée' : 'En attente'}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                    cmd.statut === 'terminee'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-blue-50 text-blue-500'
                  }`}>
                    {cmd.statut === 'terminee' ? 'Terminée' : 'En cours'}
                  </span>
                  <span className="font-display text-lg md:text-xl text-vert ml-auto sm:ml-0">
                    {cmd.total.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Produits */}
              <div className="px-4 md:px-6 py-3 divide-y divide-creme">
                {cmd.produits.map((p) => (
                  <div key={p.nom} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-creme flex items-center justify-center text-[12px] md:text-sm shrink-0">
                        x{p.qte}
                      </span>
                      <p className="text-[13px] md:text-[14px] text-texte">{p.nom}</p>
                    </div>
                    <p className="text-[13px] md:text-[14px] font-medium text-vert">
                      {(p.prix * p.qte).toFixed(2)}€
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-4 md:px-6 py-4 border-t border-creme-dark flex gap-3">
                <button className="btn-primary text-[12px] md:text-[13px] px-4 md:px-5 py-2">
                  Re-commander
                </button>
                <button className="btn-outline-dark text-[12px] md:text-[13px] px-4 md:px-5 py-2">
                  Voir le détail
                </button>
              </div>

            </div>
          </AnimateIn>
        ))}
      </div>
    </div>
  )
}