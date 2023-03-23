import React from "react";

import {
  COIN_PAGE,
  FAV_PAGE,
  GAINERS_PAGE,
  LOSERS_PAGE,
  MAIN_PAGE,
} from "config/routes";
import { Route, Routes } from "react-router-dom";
import { useQueryParamsStoreInit } from "stores/RootStore/hooks/useQueryParamsStoreInit";

import CoinPage from "./pages/CoinPage";
import CoinListPage from "./pages/CoinsListPage";

function App() {
  useQueryParamsStoreInit();

  return (
    <Routes>
      <Route path={MAIN_PAGE} element={<CoinListPage />} />
      <Route path={COIN_PAGE} element={<CoinPage />} />
      <Route path={GAINERS_PAGE} element={<CoinListPage />} />
      <Route path={LOSERS_PAGE} element={<CoinListPage />} />
      <Route path={FAV_PAGE} element={<CoinListPage />} />
    </Routes>
  );
}

export default App;
