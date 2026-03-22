const Input = ({
  label, name, type = 'text', icon: Icon,
  error, className = '', ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-dark-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`
            w-full bg-dark-800 border border-dark-700 rounded-xl
            px-4 py-2.5 text-dark-100 placeholder-dark-500
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;