interface SectionHeaderProps {
  eyebrow: string
  title: string
  action?: React.ReactNode
  center?: boolean
}

export function SectionHeader({ eyebrow, title, action, center }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between mb-12 ${center ? 'flex-col items-center text-center' : ''}`}>
      <div>
        <p className="section-eyebrow mb-2">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}