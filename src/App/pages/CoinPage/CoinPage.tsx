import { useCallback, useEffect, useState } from "react";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "components/Loader";
import { LoaderSize } from "components/Loader/Loader";
import { BASE_URL } from "config/api";
import { MAIN_PAGE } from "config/routes";
import backArrow from "images/back_arrow.svg";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import SingleCoinStore from "stores/SingleCoinStore";
import { useLocalStore } from "stores/useLocalStore";
import { CurrencyCode } from "utils/currency";
import { Meta } from "utils/meta";

import styles from "./CoinPage.module.scss";

function CoinPage() {
  const { coinId } = useParams();
  const [currency, setCurrency] = useState("usd");
  const singleCoinStore = useLocalStore(() => new SingleCoinStore());
  const [interval, setInterval] = useState("1");
  // https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1

  const calculateInterval = () => {
    switch (interval) {
      case "1":
        return "&days=1";
      case "7":
        return "&days=7&interval=daily";
      case "30":
        return "&days=30&interval=daily";
      case "90":
        return "&days=90&interval=daily";
      case "180":
        return "&days=180&interval=daily";
      case "365":
        return "&days=365&interval=daily";
      case "max":
        return "&days=max&interval=daily";
      default:
        return "&days=1";
    }
  };

  const handleIntervalClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setInterval(e.currentTarget.value);
  };

  const {
    status: chartStatus,
    data: chartData,
    refetch: chartRefetch,
  } = useQuery(
    ["chart", coinId, currency],
    () =>
      axios
        .get(
          BASE_URL +
            `coins/${coinId}/market_chart?vs_currency=${currency}${calculateInterval()}`,
        )
        .then((res) => res.data.prices),
    {
      select: (data) =>
        data.map((item: [number, number]) => ({
          time:
            interval !== "1"
              ? new Date(item[0]).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "numeric",
                })
              : new Date(item[0]).toLocaleTimeString(undefined, {
                  hour: "numeric",
                }),
          price: item[1],
        })),
    },
  );

  useEffect(() => {
    chartRefetch();
  }, [chartRefetch, interval]);

  useEffect(() => {
    const [coinName, currencyCode] = coinId!.split("?vs_currency=");
    singleCoinStore.getSingleCoinData(coinName);
    //const  = singleCoinStore.currency;
    if (currencyCode as keyof typeof CurrencyCode)
      setCurrency(CurrencyCode[currencyCode as keyof typeof CurrencyCode]);
    else setCurrency("usd");
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
      <div className={styles["coin-page__text-info-container"]}>
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
            <span className={styles["coin-page__info-label"]}>
              Total Supply
            </span>
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
      <div className={styles["coin-page__diagram-container"]}>
        <h3 className={styles["coin-page__description-header"]}>Diagram</h3>
        {chartStatus === "loading" && <Loader size={LoaderSize.l} />}
        {chartStatus === "error" && <p>API overloaded, please wait a minute</p>}
        {chartStatus === "success" && (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={chartData}>
              <Line
                dot={false}
                type="monotone"
                dataKey="price"
                stroke="#0063F5"
                strokeWidth={3}
              />
              <Tooltip />
              <XAxis dataKey="time" />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className={styles["coin-page__interval-container"]}>
          <button onClick={handleIntervalClick} value="1">
            1D
          </button>
          <button onClick={handleIntervalClick} value="7">
            7D
          </button>
          <button onClick={handleIntervalClick} value="30">
            1M
          </button>
          <button onClick={handleIntervalClick} value="90">
            3M
          </button>
          <button onClick={handleIntervalClick} value="180">
            6M
          </button>
          <button onClick={handleIntervalClick} value="365">
            1Y
          </button>
          <button onClick={handleIntervalClick} value="max">
            MAX
          </button>
        </div>
      </div>
    </div>
  );
}

export default observer(CoinPage);
