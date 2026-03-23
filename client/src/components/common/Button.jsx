const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  isLoading,
  disabled,
  className = '',
  ...props
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    },
    secondary: {
      background: '#1e293b',
      color: '#cbd5e1',
      border: '1.5px solid #334155',
      boxShadow: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.25)',
    },
    ghost: {
      background: 'transparent',
      color: '#94a3b8',
      border: 'none',
      boxShadow: 'none',
    },
    success: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.25)',
    },
  };

  const sizes = {
    sm: { height: '34px', padding: '0 14px', fontSize: '13px', borderRadius: '8px' },
    md: { height: '42px', padding: '0 20px', fontSize: '14px', borderRadius: '10px' },
    lg: { height: '48px', padding: '0 24px', fontSize: '15px', borderRadius: '12px' },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        ...v,
        ...s,
        width: fullWidth ? '100%' : 'auto',
        fontWeight: '600',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.55 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.filter = 'brightness(1.1)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.filter = 'brightness(1)';
      }}
      onMouseDown={(e) => {
        if (!disabled && !isLoading) {
          e.target.style.transform = 'translateY(0) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        e.target.style.transform = 'translateY(-1px) scale(1)';
      }}
      className={className}
      {...props}
    >
      {isLoading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;