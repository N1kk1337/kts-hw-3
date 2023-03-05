import { useEffect, useState } from "react";

import Loader from "@components/Loader";
import { LoaderSize } from "@components/Loader/Loader";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

import styles from "./CoinPage.module.scss";

export interface SingleCoinData {
  id: string;
  symbol: string;
  name: string;
  image: { [key: string]: string };
  market_data: {
    current_price: { [key: string]: string };
    market_cap: { [key: string]: string };
    price_change_percentage_24h: string;
    fully_diluted_valuation: { [key: string]: string };
    circulating_supply: string;
    total_supply: string;
    max_supply: string;
  };

  description: {
    [key: string]: string;
  };
}

function CoinPage() {
  const { coinId } = useParams();
  const [currency, setCurrency] = useState("usd");
  const [coin, setCoin] = useState<SingleCoinData>();
  const [loading, setLoading] = useState(true);

  async function fetchCoin(curr: string = "usd") {
    const [coinName, currencyCode] = coinId!.split("&currency=");
    setCurrency(currencyCode || "usd");

    const url = `https://api.coingecko.com/api/v3/coins/${coinName}`;
    const response = await axios.get<SingleCoinData>(url);
    setCoin(response.data);
  }

  useEffect(() => {
    fetchCoin();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [coin]);

  return !loading ? (
    <div className={styles.coin__page}>
      <header className={styles["coin-header"]}>
        <button className={styles["coin__back-btn"]} />
        <img
          alt=""
          src={coin?.image.small}
          className={styles["coin__img"]}
        ></img>
        <h1 className={styles["coin__title"]}>{coin && coin.name}</h1>
        <h2 className={styles.coin__subtitle}>
          ({coin && coin.symbol.toUpperCase()})
        </h2>
      </header>
      <div className={styles["coin-price-container"]}>
        <span className={styles["coin-price"]}>
          {coin?.market_data.current_price[currency!]}
        </span>
        <span className={styles["coin-price-change"]}>
          {coin && coin.market_data.price_change_percentage_24h}
        </span>
      </div>
      <ul className={styles["coin-info__container"]}>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Market Cap</span>
          <span className={styles["coin-info__numbers"]}>
            {coin?.market_data.market_cap[currency!]}
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>
            Fully Diluted Valuation
          </span>
          <span className={styles["coin-info__numbers"]}>
            {coin?.market_data.fully_diluted_valuation[currency!]}
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Circulating Supply</span>
          <span className={styles["coin-info__numbers"]}>
            {coin?.market_data.circulating_supply}
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Total Supply</span>
          <span className={styles["coin-info__numbers"]}>
            {coin?.market_data.total_supply}
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Max Supply</span>
          <span className={styles["coin-info__numbers"]}>
            {coin?.market_data.max_supply}
          </span>
        </li>
      </ul>
      <h3 className={styles["description-header"]}>Description</h3>

      <div
        dangerouslySetInnerHTML={{ __html: coin?.description.en! }}
        className={styles["description-text"]}
      />
    </div>
  ) : (
    <Loader size={LoaderSize.l}></Loader>
  );
}

export default observer(CoinPage);
