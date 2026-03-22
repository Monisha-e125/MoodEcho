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
      className={`
        fixed top-0 left-0 right-0 z-[100] p-4
        ${isHigh ? 'bg-red-900/95' : 'bg-amber-900/95'}
        border-b ${isHigh ? 'border-red-700' : 'border-amber-700'}
        backdrop-blur-sm animate-slide-up
      `}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-4">
        <Heart className={`w-6 h-6 mt-0.5 ${isHigh ? 'text-red-300' : 'text-amber-300'} shrink-0`} />

        <div className="flex-1">
          <p className="text-white font-medium mb-1">{crisisData.message}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {crisisData.helplines?.slice(0, 3).map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number}`}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg text-sm text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {h.name}: {h.number}
              </a>
            ))}
          </div>
          <Link
            to="/crisis-help"
            className="inline-block mt-2 text-sm text-white/80 underline hover:text-white"
          >
            View all helplines →
          </Link>
        </div>

        <button
          onClick={() => dispatch(hideCrisis())}
          className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CrisisBanner;