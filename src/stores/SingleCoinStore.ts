import axios from "axios";
import { BASE_URL } from "config/api";
import { SingleCoinData } from "config/types";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Meta } from "utils/meta";

import rootStore from "./RootStore/instance";
import { ILocalStore } from "./useLocalStore";

type PrivateFields = "_coin" | "_meta" | "_currency";

class SingleCoinStore implements ILocalStore {
  private _currency: string = "usd";
  private _meta: Meta = Meta.initial;
  private _coin: SingleCoinData = {
    id: "",
    symbol: "",
    name: "",
    image: {},
    description: {},
    market_data: {
      current_price: {},
      market_cap: {},
      price_change_percentage_24h: "",
      fully_diluted_valuation: {},
      circulating_supply: "",
      total_supply: "",
      max_supply: "",
    },
  };

  constructor() {
    makeObservable<SingleCoinStore, PrivateFields>(this, {
      _currency: observable,
      _coin: observable,
      _meta: observable,
      meta: computed,
      coin: computed,
      currency: computed,
      getSingleCoinData: action.bound,
    });
  }

  get coin(): SingleCoinData | undefined {
    return this._coin;
  }

  get meta(): Meta {
    return this._meta;
  }

  get currency(): string {
    return this._currency;
  }

  async getSingleCoinData(coinName: string) {
    this._currency = rootStore.query.getParam("vs_currency") as string;
    this._meta = Meta.loading;
    this._coin = {
      id: "",
      symbol: "",
      name: "",
      image: {},
      description: {},
      market_data: {
        current_price: {},
        market_cap: {},
        price_change_percentage_24h: "",
        fully_diluted_valuation: {},
        circulating_supply: "",
        total_supply: "",
        max_supply: "",
      },
    };
    const response = await axios.get<SingleCoinData>(
      `${BASE_URL}coins/${coinName}`,
    );
    runInAction(() => {
      if (response.status === 200) {
        this._coin = response.data;
        this._meta = Meta.success;
        return;
      }
      this._meta = Meta.error;
    });
  }

  destroy(): void {}
}

export default SingleCoinStore;
