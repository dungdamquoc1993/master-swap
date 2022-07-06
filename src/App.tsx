import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Swap from './components/Swap';
import Farm from './components/Farm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="swap" element={<Swap />} />
          <Route path="farm" element={<Farm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
