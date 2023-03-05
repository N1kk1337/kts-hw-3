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
import { CoinData } from "src/App/pages/CoinsListPage/CoinListPage";

import { ILocalStore } from "./useLocalStore";

type PrivateFields = "_list" | "_meta" | "_page";

class CoinListStore implements ILocalStore {
  // private _currency = "usd";
  private _meta: Meta = Meta.initial;
  private _list: CoinData[] | undefined;
  private _page: number = 1;

  constructor() {
    makeObservable<CoinListStore, PrivateFields>(this, {
      // _currency: observable,
      _list: observable,
      _meta: observable,
      _page: observable,
      meta: computed,
      list: computed,
      getCoinListData: action.bound,
    });
  }

  get list(): CoinData[] | undefined {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  get page(): number {
    return this._page;
  }

  async getCoinListData(search: string, categories?: string[]) {
    if (search.trim() === "") search = "usd";
    this._meta = Meta.loading;
    this._list = undefined;
    const response = await axios.get<CoinData[]>(
      `${BASE_URL}/coins/markets/?vs_currency=${search}
      `,
    );
    runInAction(() => {
      if (response.status === 200) {
        this._list = response.data;
        this._meta = Meta.success;
        return;
      }
      this._meta = Meta.error;
    });
  }
  destroy(): void {}
}

export default CoinListStore;
