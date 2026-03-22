import { useState } from 'react';
import { Eye, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import wellnessService from '../../services/wellnessService';
import Button from '../common/Button';

const defaultSteps = [
  { sense: 'See', count: 5, prompt: 'Name 5 things you can see', emoji: '👀' },
  { sense: 'Touch', count: 4, prompt: 'Name 4 things you can feel', emoji: '✋' },
  { sense: 'Hear', count: 3, prompt: 'Name 3 things you can hear', emoji: '👂' },
  { sense: 'Smell', count: 2, prompt: 'Name 2 things you can smell', emoji: '👃' },
  { sense: 'Taste', count: 1, prompt: 'Name 1 thing you can taste', emoji: '👅' }
];

const GroundingExercise = ({ steps = defaultSteps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(steps.map((s) => Array(s.count).fill('')));
  const [finished, setFinished] = useState(false);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const updateAnswer = (itemIndex, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentStep] = [...updated[currentStep]];
      updated[currentStep][itemIndex] = value;
      return updated;
    });
  };

  const nextStep = () => {
    if (isLastStep) {
      setFinished(true);
      wellnessService.logActivity({
        type: 'grounding',
        duration: 300
      }).catch(() => {});
      toast.success('Grounding exercise complete! 🌿');
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  if (finished) {
    return (
      <div className="bg-gradient-to-br from-green-600/10 to-teal-600/10 border border-green-500/20 rounded-2xl p-8 text-center">
        <span className="text-5xl block mb-4">🌿</span>
        <h2 className="text-xl font-bold text-white mb-2">You&apos;re Grounded</h2>
        <p className="text-dark-300 mb-6">
          Great job! Take a deep breath. You are present, safe, and aware.
        </p>
        <Button variant="success" onClick={() => onComplete?.()}>
          <CheckCircle className="w-4 h-4" /> Done
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-600/10 to-teal-600/10 border border-green-500/20 rounded-2xl p-6">
      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i <= currentStep ? 'bg-green-500' : 'bg-dark-700'
            }`}
          />
        ))}
      </div>

      {/* Step Header */}
      <div className="text-center mb-6">
        <span className="text-4xl block mb-2">{step.emoji}</span>
        <h2 className="text-xl font-bold text-white">
          {step.sense} — {step.count}
        </h2>
        <p className="text-dark-300 mt-1">{step.prompt}</p>
      </div>

      {/* Answer Inputs */}
      <div className="space-y-2 mb-6">
        {Array.from({ length: step.count }).map((_, i) => (
          <input
            key={i}
            type="text"
            value={answers[currentStep][i]}
            onChange={(e) => updateAnswer(i, e.target.value)}
            placeholder={`${step.sense} #${i + 1}...`}
            className="w-full bg-dark-800/50 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-green-500 transition-colors"
          />
        ))}
      </div>

      {/* Next Button */}
      <Button fullWidth onClick={nextStep}>
        {isLastStep ? (
          <><CheckCircle className="w-4 h-4" /> Finish</>
        ) : (
          <><ArrowRight className="w-4 h-4" /> Next Sense</>
        )}
      </Button>

      {/* Step indicator */}
      <p className="text-center text-xs text-dark-500 mt-3">
        Step {currentStep + 1} of {steps.length}
      </p>
    </div>
  );
};

export default GroundingExercise;