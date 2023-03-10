import { useCallback, useEffect, useState } from "react";

import Button from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import Loader from "@components/Loader";
import { LoaderSize } from "@components/Loader/Loader";
import CoinCategoryListStore from "@stores/CoinCategoryListStore";
import CoinListStore from "@stores/CoinListStore";
import rootStore from "@stores/RootStore/instance";
import { CurrencyCode } from "@utils/currency";
import { Meta } from "@utils/meta";
import { observer, useLocalStore } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./CoinListPage.module.scss";
import MultiDropdown from "./components/MultiDropdown/MultiDropdown";

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
  const coinListStore = useLocalStore(() => new CoinListStore());
  const coinCategoryListStore = useLocalStore(
    () => new CoinCategoryListStore(),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams(
    coinListStore.currency,
  );
  const [searchInputValue, setSearchInputValue] = useState(
    coinListStore.currency,
  );

  const [currency, setCurrency] = useState<CurrencyCode>(
    CurrencyCode[
      coinListStore.currency.toUpperCase() as keyof typeof CurrencyCode
    ],
  );
  const [chosenCategories, setChosenCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (value: string): void => {
      setSearchInputValue(value);
      setSearchParams(`?vs_currency=${value}`);
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(() => {
    console.log("search");
    if (searchInputValue.toUpperCase() in CurrencyCode) {
      console.log("search 2");

      rootStore.query.setSearch(searchInputValue);
      setCurrency(
        CurrencyCode[
          searchInputValue.toUpperCase() as keyof typeof CurrencyCode
        ],
      );
      coinListStore.resetList();
      coinListStore.getCoinListData(searchInputValue, chosenCategories);
    } else {
      setCurrency(CurrencyCode.USD);
      rootStore.query.setSearch("usd");
      coinListStore.resetList();
      coinListStore.getCoinListData("usd", chosenCategories);
      setSearchParams(`?vs_currency=usd`);
      setSearchInputValue("");
      // todo придумать какой-то более красивый способ сказать, что такой валюты нет.
      alert("There is no such currency, try USD, BTC, or EUR");
    }
  }, [chosenCategories, coinListStore, searchInputValue, setSearchParams]);

  const handleCoinClick = (id: string) => {
    navigate(
      `/coins/${id}?vs_currency=${
        searchInputValue.trim() === "" ? "usd" : searchInputValue
      }`,
    );
  };

  const handleDropdownClose = useCallback(() => {
    if (chosenCategories.length !== 0) {
      coinListStore.getCoinListData(searchInputValue, chosenCategories);
    }
  }, [chosenCategories, coinListStore, searchInputValue]);

  useEffect(() => {
    coinCategoryListStore.getCoinCategoryListData();
    coinListStore.getCoinListData(coinListStore.currency, chosenCategories);
  }, []);

  if (coinCategoryListStore.meta === Meta.loading) {
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
          onClose={handleDropdownClose}
          onChange={setChosenCategories}
          pluralizeOptions={(values: string[]) =>
            values.length === 0
              ? "Choose coins"
              : `Chosen: ${values.join(", ")}`
          }
        />
      </div>
      <div className={styles["coin-list__tabs"]} />
      <div>
        {coinListStore.list && (
          <InfiniteScroll
            className={styles["coin-list__list"]}
            dataLength={coinListStore.list.length}
            next={() =>
              coinListStore.getNextPage(searchInputValue, chosenCategories)
            }
            hasMore={true}
            loader={<Loader className={styles.loader} />}
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
