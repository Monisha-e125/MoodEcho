import { useState, useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

const BreathingExercise = ({ exercise, onComplete, onCancel }) => {
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(exercise.steps?.[0]?.seconds || 4);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const totalCycles = 4;
  const steps = exercise.steps || [];

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Next step
          const nextStep = (step + 1) % steps.length;
          setStep(nextStep);

          if (nextStep === 0) {
            setCycles((c) => {
              const newCycles = c + 1;
              if (newCycles >= totalCycles) {
                setIsRunning(false);
                clearInterval(intervalRef.current);
                return newCycles;
              }
              return newCycles;
            });
          }

          return steps[nextStep]?.seconds || 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, step, steps]);

  const currentStep = steps[step];
  const progress = cycles / totalCycles;
  const isFinished = cycles >= totalCycles;

  const reset = () => {
    setIsRunning(false);
    setStep(0);
    setTimer(steps[0]?.seconds || 4);
    setCycles(0);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="bg-gradient-to-br from-primary-600/20 to-blue-600/20 border border-primary-500/20 rounded-2xl p-8 text-center">
      <h2 className="text-xl font-bold text-white mb-1">{exercise.name}</h2>
      <p className="text-dark-300 text-sm mb-6">{exercise.description}</p>

      {/* Timer Circle */}
      <div className="relative w-36 h-36 mx-auto mb-6">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#334155" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke="#6366f1" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress)}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{timer}</span>
          <span className="text-xs text-dark-400">
            Cycle {Math.min(cycles + 1, totalCycles)}/{totalCycles}
          </span>
        </div>
      </div>

      {/* Current Action */}
      <p className={`text-2xl font-medium mb-6 transition-all duration-300 ${
        isRunning ? 'text-primary-300 animate-pulse' : 'text-dark-400'
      }`}>
        {isFinished ? '✨ Complete!' : currentStep?.action || 'Ready'}
      </p>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isFinished ? (
          <>
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning
                ? <><Pause className="w-4 h-4" /> Pause</>
                : <><Play className="w-4 h-4" /> {cycles > 0 ? 'Resume' : 'Start'}</>
              }
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          </>
        ) : (
          <>
            <Button variant="success" onClick={() => onComplete?.(exercise)}>
              <CheckCircle className="w-4 h-4" /> Done
            </Button>
            <Button variant="secondary" onClick={reset}>
              <RotateCcw className="w-4 h-4" /> Again
            </Button>
          </>
        )}
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="text-sm text-dark-500 hover:text-dark-400 mt-4 transition-colors"
        >
          Cancel exercise
        </button>
      )}
    </div>
  );
};

export default BreathingExercise;