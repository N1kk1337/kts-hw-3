import { useCallback, useEffect, useState } from "react";

import Loader from "@components/Loader";
import { LoaderSize } from "@components/Loader/Loader";
import backArrow from "@images/back_arrow.svg";
import rootStore from "@stores/RootStore/instance";
import SingleCoinStore from "@stores/SingleCoinStore";
import { useLocalStore } from "@stores/useLocalStore";
import { CurrencyCode } from "@utils/currency";
import { Meta } from "@utils/meta";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";

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
  const singleCoinStore = useLocalStore(() => new SingleCoinStore());

  useEffect(() => {
    const coinName = coinId!.split("?vs_currency=")[0];
    singleCoinStore.getSingleCoinData(coinName);
    const currencyCode = singleCoinStore.currency;
    setCurrency(CurrencyCode[currencyCode as keyof typeof CurrencyCode]);
  }, [coinId, currency, singleCoinStore]);

  const navigate = useNavigate();

  const handleBackClick = useCallback(() => {
    navigate("/");
  }, []);

  if (singleCoinStore.meta === Meta.loading) {
    return <Loader size={LoaderSize.l} />;
  }
  if (singleCoinStore.meta === Meta.error) {
    return <p>API overloaded, please wait a minute and refresh the page</p>;
  }
  if (!singleCoinStore.coin) {
    return <p>There is no such coin</p>;
  }

  return (
    <div className={styles["coin-page"]}>
      <header className={styles["coin-header"]}>
        <button onClick={handleBackClick} className={styles["coin__back-btn"]}>
          <img src={backArrow} alt="back" />
        </button>
        <img
          alt=""
          src={singleCoinStore.coin?.image.small}
          className={styles["coin__img"]}
        />
        <h1 className={styles["coin__title"]}>{singleCoinStore.coin.name}</h1>
        <h2 className={styles.coin__subtitle}>
          ({singleCoinStore.coin.symbol.toUpperCase()})
        </h2>
      </header>
      <div className={styles["coin-price-container"]}>
        <span className={styles["coin-price"]}>
          {
            CurrencyCode[
              singleCoinStore.currency.toUpperCase() as keyof typeof CurrencyCode
            ]
          }

          {
            singleCoinStore.coin.market_data.current_price[
              singleCoinStore.currency!
            ]
          }
        </span>
        <span className={styles["coin-price-change"]}>
          {singleCoinStore.coin.market_data.price_change_percentage_24h}
        </span>
      </div>
      <ul className={styles["coin-info__container"]}>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Market Cap</span>
          <span className={styles["coin-info__numbers"]}>
            {
              CurrencyCode[
                singleCoinStore.currency.toUpperCase() as keyof typeof CurrencyCode
              ]
            }{" "}
            {
              singleCoinStore.coin.market_data.market_cap[
                singleCoinStore.currency!
              ]
            }
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>
            Fully Diluted Valuation
          </span>
          <span className={styles["coin-info__numbers"]}>
            {
              CurrencyCode[
                singleCoinStore.currency.toUpperCase() as keyof typeof CurrencyCode
              ]
            }{" "}
            {
              singleCoinStore.coin.market_data.fully_diluted_valuation[
                singleCoinStore.currency!
              ]
            }
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Circulating Supply</span>
          <span className={styles["coin-info__numbers"]}>
            {singleCoinStore.coin.market_data.circulating_supply || "∞"}
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Total Supply</span>
          <span className={styles["coin-info__numbers"]}>
            {singleCoinStore.coin.market_data.total_supply || "∞"}
          </span>
        </li>
        <li className={styles["coin-info__item"]}>
          <span className={styles["coin-info__label"]}>Max Supply</span>
          <span className={styles["coin-info__numbers"]}>
            {singleCoinStore.coin.market_data.max_supply || "∞"}
          </span>
        </li>
      </ul>
      <h3 className={styles["description-header"]}>Description</h3>

      <div
        dangerouslySetInnerHTML={{
          __html: singleCoinStore.coin.description.en!,
        }}
        className={styles["description-text"]}
      />
    </div>
  );
}

export default observer(CoinPage);
