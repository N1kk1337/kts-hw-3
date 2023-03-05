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
  private _list: CoinData[] = [];
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

  getNextPage(search: string) {
    this._page++;
    this.getCoinListData(search);
  }

  async getCoinListData(search: string, categories?: string[]) {
    if (search.trim() === "") search = "usd";
    this._meta = Meta.loading;
    const response = await axios.get<CoinData[]>(
      `${BASE_URL}/coins/markets/?vs_currency=${search}&per_page=50&page=${this._page}
      `,
    );
    runInAction(() => {
      if (response.status === 200) {
        if (this._page === 1) {
          this._list = response.data;
          this._meta = Meta.success;
        } else {
          this._list = [...this._list!, ...response.data];
          this._meta = Meta.success;
        }
        return;
      }
      this._meta = Meta.error;
    });
  }
  destroy(): void {
    this._list = [];
    this._page = 1;
  }
}

export default CoinListStore;
