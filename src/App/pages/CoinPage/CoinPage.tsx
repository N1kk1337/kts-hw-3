import { useCallback, useEffect, useState } from "react";
import React from "react";

import Loader from "components/Loader";
import { LoaderSize } from "components/Loader/Loader";
import { MAIN_PAGE } from "config/routes";
import backArrow from "images/back_arrow.svg";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import SingleCoinStore from "stores/SingleCoinStore";
import { useLocalStore } from "stores/useLocalStore";
import { CurrencyCode } from "utils/currency";
import { Meta } from "utils/meta";

import styles from "./CoinPage.module.scss";

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
    navigate(MAIN_PAGE);
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
      <header className={styles["coin-page__header"]}>
        <button
          onClick={handleBackClick}
          className={styles["coin-page__back-btn"]}
        >
          <img src={backArrow} alt="back" />
        </button>
        <img
          alt=""
          src={singleCoinStore.coin?.image.small}
          className={styles["coin-page__img"]}
        />
        <h1 className={styles["coin-page__title"]}>
          {singleCoinStore.coin.name}
        </h1>
        <h2 className={styles["coin-page__subtitle"]}>
          ({singleCoinStore.coin.symbol.toUpperCase()})
        </h2>
      </header>
      <div className={styles["coin-page__price-container"]}>
        <span className={styles["coin-page__price"]}>
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
        <span className={styles["coin-page__price-change"]}>
          {singleCoinStore.coin.market_data.price_change_percentage_24h}
        </span>
      </div>
      <ul className={styles["coin-page__info"]}>
        <li className={styles["coin-page__info-item"]}>
          <span className={styles["coin-page__info-label"]}>Market Cap</span>
          <span className={styles["coin-page__info-numbers"]}>
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
        <li className={styles["coin-page__info-item"]}>
          <span className={styles["coin-page__info-label"]}>
            Fully Diluted Valuation
          </span>
          <span className={styles["coin-page__info-numbers"]}>
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
        <li className={styles["coin-page__info-item"]}>
          <span className={styles["coin-page__info-label"]}>
            Circulating Supply
          </span>
          <span className={styles["coin-page__info-numbers"]}>
            {singleCoinStore.coin.market_data.circulating_supply || "∞"}
          </span>
        </li>
        <li className={styles["coin-page__info-item"]}>
          <span className={styles["coin-page__info-label"]}>Total Supply</span>
          <span className={styles["coin-page__info-numbers"]}>
            {singleCoinStore.coin.market_data.total_supply || "∞"}
          </span>
        </li>
        <li className={styles["coin-page__info-item"]}>
          <span className={styles["coin-page__info-label"]}>Max Supply</span>
          <span className={styles["coin-page__info-numbers"]}>
            {singleCoinStore.coin.market_data.max_supply || "∞"}
          </span>
        </li>
      </ul>
      <h3 className={styles["coin-page__description-header"]}>Description</h3>

      <div
        dangerouslySetInnerHTML={{
          __html: singleCoinStore.coin.description.en!,
        }}
        className={styles["coin-page__description-text"]}
      />
    </div>
  );
}

export default observer(CoinPage);
