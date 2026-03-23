const Input = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-[13px] font-semibold tracking-wide"
          style={{ color: '#94a3b8' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-0 top-0 bottom-0 flex items-center justify-center pointer-events-none"
            style={{ width: '44px' }}
          >
            <Icon
              size={16}
              style={{ color: '#64748b' }}
            />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={
            type === 'password'
              ? 'current-password'
              : type === 'email'
                ? 'email'
                : name === 'name'
                  ? 'name'
                  : 'off'
          }
          style={{
            width: '100%',
            height: '46px',
            fontSize: '14px',
            fontWeight: '400',
            color: '#e2e8f0',
            backgroundColor: '#0f172a',
            border: error ? '1.5px solid #ef4444' : '1.5px solid #334155',
            borderRadius: '12px',
            paddingLeft: Icon ? '44px' : '16px',
            paddingRight: '16px',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#6366f1';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(239,68,68,0.15)'
              : '0 0 0 3px rgba(99,102,241,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#334155';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;