import { BASE_URL } from "@config/api";
import { Meta } from "@utils/meta";
import axios from "axios";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { SingleCoinData } from "src/App/pages/CoinPage/CoinPage";

import rootStore from "./RootStore/instance";
import { ILocalStore } from "./useLocalStore";

type PrivateFields = "_coin" | "_meta" | "_currency";

class SingleCoinStore implements ILocalStore {
  private _currency: string = "usd";
  private _meta: Meta = Meta.initial;
  private _coin: SingleCoinData | undefined;

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
    this._coin = undefined;
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
