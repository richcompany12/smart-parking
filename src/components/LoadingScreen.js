import React from 'react';

function LoadingScreen() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 z-50">
      <img src="/loading-screen.png" alt="Loading" className="max-w-full max-h-full object-contain" />
    </div>
  );
}

export default LoadingScreen;