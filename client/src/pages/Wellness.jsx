import { useState, useEffect, useRef } from 'react';
import { Wind, Heart, Eye, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import wellnessService from '../services/wellnessService';
import Button from '../components/common/Button';

const cardStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '20px',
  padding: '28px',
};

const Wellness = () => {
  const [exercises, setExercises] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    wellnessService.getExercises()
      .then((res) => setExercises(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isRunning && activeExercise) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            const steps = activeExercise.steps;
            if (steps && step < steps.length - 1) {
              setStep((s) => s + 1);
              return steps[step + 1]?.seconds || 4;
            } else {
              setStep(0);
              return steps?.[0]?.seconds || 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, step, activeExercise]);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setStep(0);
    setTimer(exercise.steps?.[0]?.seconds || exercise.duration || 60);
    setIsRunning(false);
  };

  const finishExercise = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    wellnessService.logActivity({
      type: activeExercise.id?.includes('breathing') ? 'breathing'
        : activeExercise.id?.includes('gratitude') ? 'gratitude' : 'grounding',
      duration: activeExercise.duration || 180,
    }).catch(() => {});
    toast.success('Exercise completed! 🧘');
    setActiveExercise(null);
  };

  const resetExercise = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setStep(0);
    setTimer(activeExercise?.steps?.[0]?.seconds || 4);
  };

  const categories = [
    { key: 'breathing', icon: Wind, label: 'Breathing', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.1)' },
    { key: 'gratitude', icon: Heart, label: 'Gratitude', color: '#f472b6', bgColor: 'rgba(244,114,182,0.1)' },
    { key: 'grounding', icon: Eye, label: 'Grounding', color: '#34d399', bgColor: 'rgba(52,211,153,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>Wellness</h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '15px' }}>Guided exercises for your mental wellbeing</p>
      </div>

      {/* Active Exercise */}
      {activeExercise && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '24px',
            padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' }}>
            {activeExercise.name}
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
            {activeExercise.description}
          </p>

          {/* Timer Circle */}
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '4px solid #6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: isRunning ? '0 0 30px rgba(99,102,241,0.4)' : 'none',
              transition: 'box-shadow 0.3s',
            }}
          >
            <span style={{ fontSize: '44px', fontWeight: '800', color: '#f1f5f9' }}>{timer}</span>
          </div>

          {/* Current Step */}
          {activeExercise.steps && (
            <p style={{
              fontSize: '22px',
              fontWeight: '600',
              color: isRunning ? '#a5b4fc' : '#64748b',
              marginBottom: '28px',
              minHeight: '33px',
            }}>
              {activeExercise.steps[step]?.action || 'Ready'}
            </p>
          )}

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
            </Button>
            <Button variant="success" onClick={finishExercise}>
              <CheckCircle size={16} /> Done
            </Button>
            <Button variant="ghost" onClick={resetExercise}>
              <RotateCcw size={16} />
            </Button>
          </div>

          <button
            onClick={() => setActiveExercise(null)}
            style={{ fontSize: '13px', color: '#64748b', marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Cancel exercise
          </button>
        </div>
      )}

      {/* Exercise Categories */}
      {!activeExercise && exercises && categories.map(({ key, icon: Icon, label, color, bgColor }) => (
        exercises[key] && (
          <div key={key} style={cardStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color }} />
              </div>
              {label} Exercises
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {exercises[key].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => startExercise(ex)}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '14px',
                    padding: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color + '60';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h3 style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '15px' }}>{ex.name}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px', lineHeight: '1.5' }}>{ex.description}</p>
                  <p style={{ color: '#64748b', fontSize: '12px', marginTop: '10px' }}>
                    ⏱ {Math.round(ex.duration / 60)} min
                  </p>
                </button>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Wellness;