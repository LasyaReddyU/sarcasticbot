import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PracticeMode from './pages/Practice'; // Assuming PracticeMode is in pages folder
import LearnMode from './pages/Learn'; // Assuming LearnMode is in pages folder

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<PracticeMode />} />
        <Route path="/learn" element={<LearnMode />} />
      </Routes>
    </Router>
  );
}

export default App;
