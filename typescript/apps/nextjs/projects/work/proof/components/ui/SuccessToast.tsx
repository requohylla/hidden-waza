import React, { useEffect } from 'react';

type Props = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export const SuccessToast: React.FC<Props> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: 280,
        maxWidth: 400,
      }}
      className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg text-base flex items-center justify-center animate-fade-in"
      role="alert"
    >
      <span className="font-semibold mr-2">✔</span>
      <span>{message}</span>
    </div>
  );
};