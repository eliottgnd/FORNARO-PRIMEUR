import { clsx } from 'clsx'

interface BadgeProps {
  label: string
  variant?: 'vert' | 'or' | 'creme'
  className?: string
}

export function Badge({ label, variant = 'vert', className }: BadgeProps) {
  return (
    <span className={clsx(
      'text-[10px] font-semibold px-2 py-1 rounded-full tracking-wide',
      variant === 'vert'  && 'bg-vert text-white',
      variant === 'or'    && 'bg-or text-vert',
      variant === 'creme' && 'bg-creme text-gris',
      className
    )}>
      {label}
    </span>
  )
}