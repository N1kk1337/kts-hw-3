import { useEffect, useState } from "react";

import Button from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import Loader from "@components/Loader";
import { LoaderSize } from "@components/Loader/Loader";
import MultiDropdown from "@components/MultiDropdown";
import { Option } from "@components/MultiDropdown/MultiDropdown";
import CoinCategoryListStore from "@stores/CoinCategoryListStore";
import CoinListStore from "@stores/CoinListStore";
import { Meta } from "@utils/meta";
import { observer, useLocalStore } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

import styles from "./CoinListPage.module.scss";

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: string;
  price_change_percentage_24h: string;
  market_cap: {};
  fully_diluted_valuation: {};
  circulating_supply: string;
  total_supply: string;
  max_supply: string;
  description: {
    [key: string]: string;
  };
}

function CoinListPage() {
  const [inputValue, setInputValue] = useState("");
  const [chosenCategories, setChosenCategories] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const handleInputChange = (value: string): void => {
    setInputValue(value);
  };

  const coinListStore = useLocalStore(() => new CoinListStore());
  const coinCategoryListStore = useLocalStore(
    () => new CoinCategoryListStore(),
  );

  const handleSearch = () => {
    coinListStore.getCoinListData(inputValue);
  };

  const handleCoinClick = (id: string) => {
    navigate(
      `/coins/${id}&currency=${inputValue.trim() === "" ? "usd" : inputValue}`,
    );
  };

  const getMoreCoins = async () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    coinCategoryListStore.getCoinCategoryListData();
    coinListStore.getCoinListData(inputValue);
  }, []);

  useEffect(() => {
    //coinListStore.getCoinListData(inputValue);
    setCurrentPage(1);
  }, [chosenCategories]);

  // пока у нас нет обработчика ошибок пусть будет так
  return coinListStore.meta !== Meta.success &&
    coinCategoryListStore.meta !== Meta.success ? (
    <Loader size={LoaderSize.l}></Loader>
  ) : (
    <div className={styles["coin-list-page"]}>
      <div className={styles["coin-list__search"]}>
        <Input
          placeholder="Search Cryptocurrency"
          value={inputValue}
          onChange={handleInputChange}
        ></Input>
        <Button onClick={handleSearch} className={styles["search-btn"]}>
          &#x1F50D;
        </Button>
      </div>
      <div className={styles["coin-list__categories"]}>
        <h2>Coins</h2>{" "}
        <MultiDropdown
          options={coinCategoryListStore.list!}
          value={chosenCategories}
          onChange={setChosenCategories}
          pluralizeOptions={(values: Option[]) =>
            values.length === 0 ? "Choose coins" : `Chosen: ${values.length}`
          }
        />
      </div>
      <div className={styles["coin-list__tabs"]}></div>
      <div className={styles["coin-list__list"]}>
        {coinListStore.list && (
          <InfiniteScroll
            dataLength={coinListStore.list.length}
            next={getMoreCoins}
            hasMore={true}
            loader={<Loader></Loader>}
            height="700px"
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {coinListStore.list &&
              coinListStore.list.map((coin) => {
                return (
                  <Card
                    onClick={() => handleCoinClick(coin.id)}
                    key={coin.id}
                    image={coin.image}
                    title={coin.name}
                    subtitle={coin.symbol.toUpperCase()}
                    price={coin.current_price}
                    priceChange={coin.price_change_percentage_24h}
                  ></Card>
                );
              })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default observer(CoinListPage);
