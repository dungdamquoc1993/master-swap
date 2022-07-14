import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SwapRoute from './components/Swap';
import Swap from './components/Swap/Swap';
import AddLiquidity from './components/Swap/AddLiquidity';
import RemoveLiquidity from './components/Swap/RemoveLiquidity';
import Farm from './components/Farm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="swap" element={<SwapRoute />} >
            <Route path='/swap/' element={<Swap />} />
            <Route path='/swap/add_liquidity' element={<AddLiquidity />} />
            <Route path='/swap/remove_liquidity' element={<RemoveLiquidity />} />
          </Route>
          <Route path="farm" element={<Farm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
