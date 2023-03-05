import { BASE_URL } from "@config/api";
import { Meta } from "@utils/meta";
import axios from "axios";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { SingleCoinData } from "src/App/pages/CoinPage/CoinPage";

import { ILocalStore } from "./useLocalStore";

type PrivateFields = "_coin" | "_meta";

class SingleCoinStore implements ILocalStore {
  // private _currency = "usd";
  private _meta: Meta = Meta.initial;
  private _coin: SingleCoinData | undefined;

  constructor() {
    makeObservable<SingleCoinStore, PrivateFields>(this, {
      // _currency: observable,
      _coin: observable,
      _meta: observable,
      meta: computed,
      coin: computed,
      getSingleCoinData: action.bound,
    });
  }

  get coin(): SingleCoinData | undefined {
    return this._coin;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getSingleCoinData(
    coinName: string,
    // currency: string = "usd"
  ) {
    this._meta = Meta.loading;
    this._coin = undefined;
    //this._currency = currency;
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
