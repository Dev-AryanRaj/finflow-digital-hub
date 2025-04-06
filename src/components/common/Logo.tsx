
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-bank-primary w-8 h-8 rounded-md flex items-center justify-center">
        <div className="text-white font-bold text-lg">F</div>
      </div>
      <div className="font-semibold text-xl text-gray-800 dark:text-white">
        FinFlow
      </div>
    </div>
  );
};

export default Logo;
