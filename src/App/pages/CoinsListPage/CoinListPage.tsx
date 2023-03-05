import { useEffect, useState } from "react";

import Button from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import Loader from "@components/Loader";
import MultiDropdown from "@components/MultiDropdown";
import { Option } from "@components/MultiDropdown/MultiDropdown";
import { API_ALL_COINS, API_CATEGORIES } from "@config/api";
import axios from "axios";
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

export default function CoinListPage() {
  const [inputValue, setInputValue] = useState("");
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [slicedCoins, setSlicedCoins] = useState<CoinData[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [chosenCategories, setChosenCategories] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const handleInputChange = (value: string): void => {
    setInputValue(value);
  };

  const handleSearch = () => {
    fetchCoins(inputValue);
  };

  const handleCoinClick = (id: string) => {
    navigate(`/coins/${id}&currency=${inputValue === "" ? "usd" : inputValue}`);
  };

  async function fetchCategories(): Promise<Option[]> {
    const response = await axios.get<{ category_id: string; name: string }[]>(
      API_CATEGORIES,
    );
    const options: Option[] = response.data.map((obj) => ({
      key: obj.category_id,
      value: obj.name,
    }));
    setCategories(options);
    return options;
  }

  async function fetchCoins(search: string = "usd") {
    if (chosenCategories.length === 0) {
      const response = await axios.get<CoinData[]>(API_ALL_COINS + search);
      setCoins(response.data);
    } else {
      setCoins([]);
      chosenCategories.forEach(async (cat) => {
        const response = await axios.get<CoinData[]>(
          API_ALL_COINS + search + `&category=${cat.key}`,
        );
        setCoins([...coins, ...response.data.flat()]);
      });
    }
  }

  const getMoreCoins = async () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchCategories();
    fetchCoins();
  }, []);

  useEffect(() => {
    setSlicedCoins(coins.slice(0, 20 * currentPage));
  }, [currentPage, coins]);

  useEffect(() => {
    setSlicedCoins([]);
    fetchCoins();
    setCurrentPage(1);
  }, [chosenCategories]);

  return (
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
          options={categories}
          value={chosenCategories}
          onChange={setChosenCategories}
          pluralizeOptions={(values: Option[]) =>
            values.length === 0 ? "Choose coins" : `Chosen: ${values.length}`
          }
        />
      </div>
      <div className={styles["coin-list__tabs"]}></div>
      <div className={styles["coin-list__list"]}>
        <InfiniteScroll
          dataLength={slicedCoins.length}
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
          {slicedCoins &&
            slicedCoins.map((coin) => {
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
      </div>
    </div>
  );
}
