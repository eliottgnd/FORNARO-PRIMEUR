import { IconBocal, IconCarotte, IconPomme } from '@/components/ui/Illustrations'

const loaderItems = [
  { Icon: IconPomme, label: 'Fruits', className: 'maintenance-orbit-item maintenance-orbit-item--one' },
  { Icon: IconCarotte, label: 'Légumes', className: 'maintenance-orbit-item maintenance-orbit-item--two' },
  { Icon: IconBocal, label: 'Épicerie', className: 'maintenance-orbit-item maintenance-orbit-item--three' },
]

export function MaintenanceScreen() {
  return (
    <main className="maintenance-screen" aria-labelledby="maintenance-title">
      <div className="maintenance-glow maintenance-glow--left" />
      <div className="maintenance-glow maintenance-glow--right" />

      <section className="maintenance-card">
        <div className="maintenance-loader" aria-hidden="true">
          <div className="maintenance-orbit">
            {loaderItems.map(({ Icon, label, className }) => (
              <div key={label} className={className}>
                <Icon className="h-11 w-11" strokeWidth={1.45} />
              </div>
            ))}
            <div className="maintenance-logo-mark">
              F<em>o</em>
            </div>
          </div>
        </div>

        <p className="section-eyebrow">Site momentanément en pause</p>
        <h1 id="maintenance-title" className="maintenance-title">
          Fornaro Primeur revient très vite.
        </h1>
        <p className="maintenance-copy">
          Nous mettons la boutique au frais quelques instants pour préparer une meilleure expérience.
          Les commandes, le compte client et l’administration sont temporairement indisponibles.
        </p>
        <div className="maintenance-status" role="status" aria-live="polite">
          <span />
          Réouverture en préparation
        </div>
      </section>
    </main>
  )
}
