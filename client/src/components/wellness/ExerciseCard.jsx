import { Clock, ArrowRight } from 'lucide-react';

const ExerciseCard = ({ exercise, onStart }) => {
  return (
    <button
      onClick={() => onStart(exercise)}
      className="bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/30 rounded-xl p-4 text-left transition-all w-full group"
    >
      <h3 className="text-white font-medium group-hover:text-primary-300 transition-colors">
        {exercise.name}
      </h3>
      <p className="text-dark-400 text-sm mt-1">{exercise.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="flex items-center gap-1 text-dark-500 text-xs">
          <Clock className="w-3 h-3" />
          {Math.round(exercise.duration / 60)} min
        </span>
        <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-primary-400 transition-colors" />
      </div>
    </button>
  );
};

export default ExerciseCard;