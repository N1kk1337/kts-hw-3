import { COIN_PAGE, MAIN_PAGE } from "@config/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CoinPage from "./pages/CoinPage";
import CoinListPage from "./pages/CoinsListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={MAIN_PAGE} element={<CoinListPage />} />
        <Route path={COIN_PAGE} element={<CoinPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
