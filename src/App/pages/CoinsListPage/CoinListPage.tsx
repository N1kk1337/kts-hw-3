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
import rootStore from "@stores/RootStore/instance";
import { CurrencyCode } from "@utils/currency";
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
  const [searchInputValue, setSearchInputValue] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(CurrencyCode.USD);

  const [chosenCategories, setChosenCategories] = useState<Option[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (value: string): void => {
    setSearchInputValue(value);
  };

  const coinListStore = useLocalStore(() => new CoinListStore());
  const coinCategoryListStore = useLocalStore(
    () => new CoinCategoryListStore(),
  );

  const handleSearch = () => {
    if (searchInputValue.toUpperCase() in CurrencyCode) {
      setCurrency(
        CurrencyCode[
          searchInputValue.toUpperCase() as keyof typeof CurrencyCode
        ],
      );
    }
    coinListStore.getCoinListData(searchInputValue);
  };

  const handleCoinClick = (id: string) => {
    rootStore;
    navigate(
      `/coins/${id}?currency=${
        searchInputValue.trim() === "" ? "usd" : searchInputValue
      }`,
    );
  };

  useEffect(() => {
    coinCategoryListStore.getCoinCategoryListData();
    coinListStore.getCoinListData(searchInputValue);
  }, []);

  if (
    coinListStore.meta === Meta.loading ||
    coinCategoryListStore.meta === Meta.loading
  ) {
    return <Loader size={LoaderSize.l} />;
  }

  if (
    coinListStore.meta === Meta.error ||
    coinCategoryListStore.meta === Meta.error
  ) {
    return <p>API overloaded, please wait a minute and refresh the page</p>;
  }

  return (
    <div className={styles["coin-list-page"]}>
      <div className={styles["coin-list__search"]}>
        <Input
          placeholder="Search Cryptocurrency"
          value={searchInputValue}
          onChange={handleInputChange}
        />
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
      <div className={styles["coin-list__tabs"]} />
      <div>
        {coinListStore.list && (
          <InfiniteScroll
            className={styles["coin-list__list"]}
            dataLength={coinListStore.list.length}
            next={() => coinListStore.getNextPage(searchInputValue)}
            hasMore={true}
            loader={<Loader />}
            height="700px"
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {coinListStore.list &&
              Array.from(coinListStore.list).map((coin) => {
                return (
                  <Card
                    onClick={() => handleCoinClick(coin.id)}
                    key={coin.id}
                    image={coin.image}
                    title={coin.name}
                    subtitle={coin.symbol.toUpperCase()}
                    price={`${currency} ${coin.current_price}`}
                    priceChange={coin.price_change_percentage_24h}
                  />
                );
              })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default observer(CoinListPage);
