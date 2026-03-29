import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline-light' | 'outline-dark'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        variant === 'primary'       && 'btn-primary',
        variant === 'outline-light' && 'btn-outline-light',
        variant === 'outline-dark'  && 'btn-outline-dark',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}