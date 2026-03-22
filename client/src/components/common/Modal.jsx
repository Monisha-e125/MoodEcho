import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative ${maxWidth} w-full bg-dark-800 border border-dark-700
          rounded-2xl shadow-2xl animate-slide-up
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-dark-700">
            <h3 className="text-lg font-semibold text-dark-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;