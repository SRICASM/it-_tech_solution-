import React from 'react';
import Home from './pages/Home';

// Since we are in a SPA environment without complex routing needs for this single page output, 
// we render Home directly. If routing were needed, HashRouter would be used here.

const App: React.FC = () => {
  return (
    <main className="antialiased text-white">
      <Home />
    </main>
  );
};

export default App;
