import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Feature from './pages/Feature';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feature" element={<Feature />} />
    </Routes>
  );
};

export default App;