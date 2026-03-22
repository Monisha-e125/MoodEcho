import { useState, useEffect, useRef } from 'react';
import { Wind, Heart, Eye, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import wellnessService from '../services/wellnessService';
import Button from '../components/common/Button';

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
            // Move to next step
            const steps = activeExercise.steps;
            if (steps && step < steps.length - 1) {
              setStep((s) => s + 1);
              return steps[step + 1]?.seconds || 4;
            } else {
              // Restart cycle or finish
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
      duration: activeExercise.duration || 180
    }).catch(() => {});

    toast.success('Exercise completed! 🧘');
    setActiveExercise(null);
  };

  const categories = [
    { key: 'breathing', icon: Wind, label: 'Breathing', color: 'text-blue-400' },
    { key: 'gratitude', icon: Heart, label: 'Gratitude', color: 'text-pink-400' },
    { key: 'grounding', icon: Eye, label: 'Grounding', color: 'text-green-400' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wellness</h1>
        <p className="text-dark-400 mt-1">Guided exercises for your mental wellbeing</p>
      </div>

      {/* Active Exercise */}
      {activeExercise && (
        <div className="bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">{activeExercise.name}</h2>
          <p className="text-dark-300 mb-6">{activeExercise.description}</p>

          {/* Timer */}
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary-500 flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-white">{timer}</span>
          </div>

          {/* Current Step */}
          {activeExercise.steps && (
            <p className="text-lg text-primary-300 font-medium mb-6">
              {activeExercise.steps[step]?.action || activeExercise.steps[step]?.prompt}
            </p>
          )}

          <div className="flex justify-center gap-3">
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button variant="success" onClick={finishExercise}>
              <CheckCircle className="w-4 h-4" /> Done
            </Button>
          </div>
        </div>
      )}

      {/* Exercise Categories */}
      {!activeExercise && exercises && categories.map(({ key, icon: Icon, label, color }) => (
        exercises[key] && (
          <div key={key} className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Icon className={`w-5 h-5 ${color}`} />
              {label} Exercises
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {exercises[key].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => startExercise(ex)}
                  className="bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/30 rounded-xl p-4 text-left transition-all"
                >
                  <h3 className="text-white font-medium">{ex.name}</h3>
                  <p className="text-dark-400 text-sm mt-1">{ex.description}</p>
                  <p className="text-dark-500 text-xs mt-2">
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