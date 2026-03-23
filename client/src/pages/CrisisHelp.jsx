import { useState, useEffect } from 'react';
import { Phone, Heart, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import supportService from '../services/supportService';

const CrisisHelp = () => {
  const [helplines, setHelplines] = useState([]);

  useEffect(() => {
    supportService.getHelplines()
      .then((res) => setHelplines(res.data.data))
      .catch(() => {
        setHelplines([
          { country: 'India', name: 'iCall', number: '9152987821' },
          { country: 'India', name: 'Vandrevala Foundation', number: '1860-2662-345' },
          { country: 'India', name: 'AASRA', number: '9820466726' },
          { country: 'USA', name: 'Suicide & Crisis Lifeline', number: '988' },
          { country: 'USA', name: 'Crisis Text Line', number: 'Text HOME to 741741' },
          { country: 'UK', name: 'Samaritans', number: '116 123' },
          { country: 'Global', name: 'Befrienders', number: 'www.befrienders.org' },
        ]);
      });
  }, []);

  const grouped = helplines.reduce((acc, h) => {
    if (!acc[h.country]) acc[h.country] = [];
    acc[h.country].push(h);
    return acc;
  }, {});

  const flags = { India: '🇮🇳', USA: '🇺🇸', UK: '🇬🇧', Global: '🌍' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', padding: '24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '40px', fontSize: '14px' }}
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '20px',
              backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}
          >
            <Heart size={32} style={{ color: '#f87171' }} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#f1f5f9' }}>You Are Not Alone</h1>
          <p style={{ color: '#94a3b8', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0', lineHeight: '1.6', fontSize: '15px' }}>
            If you&apos;re in crisis or need immediate support, please reach out to one of these helplines.
          </p>
        </div>

        {/* Emergency */}
        <div
          style={{
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <p style={{ color: '#fca5a5', fontWeight: '700', fontSize: '17px' }}>
            🚨 If you are in immediate danger, call your local emergency number
          </p>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
            India: 112 | USA: 911 | UK: 999
          </p>
        </div>

        {/* Helplines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Object.entries(grouped).map(([country, lines]) => (
            <div
              key={country}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '20px',
                padding: '28px',
              }}
            >
              <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '18px', marginBottom: '20px' }}>
                {flags[country] || '🌏'} {country}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {lines.map((h, i) => (
                  <a
                    key={i}
                    href={h.number.startsWith('www') ? `https://${h.number}` : `tel:${h.number}`}
                    target={h.number.startsWith('www') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      backgroundColor: '#1e293b',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      textDecoration: 'none',
                      border: '1px solid #334155',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#334155'; }}
                  >
                    <div
                      style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        backgroundColor: 'rgba(99,102,241,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >
                      {h.number.startsWith('www')
                        ? <ExternalLink size={20} style={{ color: '#818cf8' }} />
                        : <Phone size={20} style={{ color: '#818cf8' }} />
                      }
                    </div>
                    <div>
                      <p style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '15px' }}>{h.name}</p>
                      <p style={{ color: '#818cf8', fontSize: '14px', marginTop: '2px' }}>{h.number}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#475569', marginTop: '32px' }}>
          ⚠️ MoodEcho is not a medical service. These helplines are provided for informational purposes.
        </p>
      </div>
    </div>
  );
};

export default CrisisHelp;