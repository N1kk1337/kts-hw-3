import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoinListPage from './CoinsListPage/CoinListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoinListPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
