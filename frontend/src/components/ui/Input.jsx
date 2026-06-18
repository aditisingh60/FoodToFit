const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  endAdornment,
  autoComplete,
  required,
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={[
            'block w-full rounded-xl border bg-white py-3 text-sm text-slate-900 shadow-sm transition',
            'placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            Icon ? 'pl-11' : 'px-4',
            endAdornment ? 'pr-11' : 'pr-4',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200 hover:border-slate-300',
          ].join(' ')}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default Input
