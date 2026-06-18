const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 shadow-sm shadow-brand-600/20',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
}

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] ?? variants.primary,
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default Button
