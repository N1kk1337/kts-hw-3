import { COIN_PAGE, MAIN_PAGE } from "@config/routes";
import { useQueryParamsStoreInit } from "@stores/RootStore/hooks/useQueryParamsStoreInit";
import { Route, Routes } from "react-router-dom";

import CoinPage from "./pages/CoinPage";
import CoinListPage from "./pages/CoinsListPage";

function App() {
  useQueryParamsStoreInit();
  return (
    <Routes>
      <Route path={MAIN_PAGE} element={<CoinListPage />} />
      <Route path={COIN_PAGE} element={<CoinPage />} />
    </Routes>
  );
}

export default App;
