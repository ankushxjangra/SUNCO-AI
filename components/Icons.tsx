import React from 'react';

// Fix: Updated SuncoLogo with a more premium gradient.
export const SuncoLogo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400">
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="60%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </radialGradient>
    </defs>
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" fill="url(#grad1)" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3.5V2" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22v-1.5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.636 6.364 18.5 5.5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 18.5l-.864.864" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.5 12H22" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12h1.5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.636 17.636 18.5 18.5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 5.5l-.864-.864" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Fix: Updated SendIcon to be more dynamic and visually appealing based on its state.
export const SendIcon = ({ isLoading, isActive }: { isLoading: boolean, isActive: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
    className={`transform transition-all duration-300 ease-in-out ${
      isLoading 
      ? 'text-gray-500' 
      : isActive 
      ? 'text-purple-500 group-hover:scale-110 group-hover:text-purple-400' 
      : 'text-gray-600'
    }`}>
    <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path 
      d="m22 2-7 20-4-9-9-4 20-7Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={isActive && !isLoading ? 'currentColor' : 'none'}
      className={isActive && !isLoading ? 'opacity-20' : 'opacity-0 transition-opacity'}
    />
  </svg>
);


export const MicIcon = ({ isListening }: { isListening: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={`transform transition-all duration-200 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white group-hover:scale-110'}`}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 19v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AttachmentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 hover:text-white transform transition-all duration-200 group-hover:scale-110">
    <path d="M21.44 11.05a6.76 6.76 0 1 0-11.48 4.24l-6.13 6.13a2.25 2.25 0 0 0 3.18 3.18l6.13-6.13a4.51 4.51 0 1 0-6.36-6.36l-1.42 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
