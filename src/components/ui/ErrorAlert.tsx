import { useState } from "react";

export default function ErrorAlert() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="
      fixed top-6 right-6 z-50
      flex items-center gap-3
      px-4 py-3 w-[360px]
      rounded-lg
      bg-white
      border border-red-200
      shadow-lg
      animate-in
    ">
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-red-600 text-sm">⚠️</span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">Login Failed</p>
        <p className="text-sm text-gray-600">Invalid credentials</p>
      </div>

      {/* Close */}
      <button
        onClick={() => setShow(false)}
        className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-red-100">
        <div
          className="h-full bg-red-500 progress-bar"
          onAnimationEnd={() => setShow(false)}
        />
      </div>
    </div>
  );
}
