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
        // Fallback
        setHelplines([
          { country: 'India', name: 'iCall', number: '9152987821' },
          { country: 'India', name: 'Vandrevala Foundation', number: '1860-2662-345' },
          { country: 'India', name: 'AASRA', number: '9820466726' },
          { country: 'USA', name: 'Suicide & Crisis Lifeline', number: '988' },
          { country: 'USA', name: 'Crisis Text Line', number: 'Text HOME to 741741' },
          { country: 'UK', name: 'Samaritans', number: '116 123' },
          { country: 'Global', name: 'Befrienders', number: 'www.befrienders.org' }
        ]);
      });
  }, []);

  // Group by country
  const grouped = helplines.reduce((acc, h) => {
    if (!acc[h.country]) acc[h.country] = [];
    acc[h.country].push(h);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark-950 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-dark-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">You Are Not Alone</h1>
          <p className="text-dark-300 mt-2 max-w-md mx-auto">
            If you&apos;re in crisis or need immediate support, please reach out to one of these helplines.
            Trained professionals are available 24/7.
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mb-8 text-center">
          <p className="text-red-300 font-semibold text-lg">🚨 If you are in immediate danger, call your local emergency number</p>
          <p className="text-dark-400 text-sm mt-1">India: 112 | USA: 911 | UK: 999</p>
        </div>

        {/* Helplines by Country */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([country, lines]) => (
            <div key={country} className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">
                {getFlag(country)} {country}
              </h2>
              <div className="space-y-3">
                {lines.map((h, i) => (
                  <a
                    key={i}
                    href={h.number.startsWith('www') ? `https://${h.number}` : `tel:${h.number}`}
                    target={h.number.startsWith('www') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-dark-800 hover:bg-dark-700 rounded-xl p-4 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center">
                      {h.number.startsWith('www')
                        ? <ExternalLink className="w-5 h-5 text-primary-400" />
                        : <Phone className="w-5 h-5 text-primary-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{h.name}</p>
                      <p className="text-primary-400 text-sm">{h.number}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-dark-600 text-xs">
            ⚠️ MoodEcho is not a medical service. These helplines are provided for informational purposes.
            If you need immediate help, please contact emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

const getFlag = (country) => {
  const flags = { India: '🇮🇳', USA: '🇺🇸', UK: '🇬🇧', Global: '🌍' };
  return flags[country] || '🌏';
};

export default CrisisHelp;