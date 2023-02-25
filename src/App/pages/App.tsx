import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoinListPage from './CoinsListPage/CoinListPage';
import CoinPage from './CoinPage/CoinPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoinListPage />} />
        <Route path="/coins/:coinId" element={<CoinPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
