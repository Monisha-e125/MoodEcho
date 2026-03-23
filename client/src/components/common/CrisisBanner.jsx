import { useSelector, useDispatch } from 'react-redux';
import { hideCrisis } from '../../store/slices/uiSlice';
import { Phone, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CrisisBanner = () => {
  const { showCrisisBanner, crisisData } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  if (!showCrisisBanner || !crisisData) return null;

  const isHigh = crisisData.severity === 'high';

  return (
    <div
      className="animate-slide-up"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: '16px 20px',
        backgroundColor: isHigh ? 'rgba(127, 29, 29, 0.95)' : 'rgba(120, 53, 15, 0.95)',
        borderBottom: isHigh ? '1px solid #991b1b' : '1px solid #92400e',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <Heart
          size={20}
          style={{
            color: isHigh ? '#fca5a5' : '#fcd34d',
            flexShrink: 0,
            marginTop: '2px',
          }}
        />

        <div style={{ flex: 1 }}>
          <p style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>
            {crisisData.message}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
            {crisisData.helplines?.slice(0, 3).map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '13px',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
              >
                <Phone size={13} />
                {h.name}: {h.number}
              </a>
            ))}
          </div>
          <Link
            to="/crisis-help"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'underline',
            }}
          >
            View all helplines →
          </Link>
        </div>

        <button
          onClick={() => dispatch(hideCrisis())}
          style={{
            padding: '4px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CrisisBanner;