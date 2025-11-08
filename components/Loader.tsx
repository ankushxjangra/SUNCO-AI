import React from 'react';
import { SuncoLogo } from './Icons';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="animate-spin">
        <SuncoLogo />
      </div>
      <span className="text-gray-400 font-medium animate-pulse">SUNCO AI is thinking...</span>
    </div>
  );
};

export default Loader;
