import axios from "axios";
import { BASE_URL } from "config/api";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { CoinData } from "models/types";
import { Meta } from "utils/meta";

import rootStore from "./RootStore/instance";
import { ILocalStore } from "./useLocalStore";

type PrivateFields = "_list" | "_meta" | "_page" | "_currency";

class CoinListStore implements ILocalStore {
  private _meta: Meta = Meta.initial;
  private _list: CoinData[] = [];
  private _page: number = 1;
  private _currency: string =
    (rootStore.query.getParam("vs_currency") as string) || "usd";

  constructor() {
    makeObservable<CoinListStore, PrivateFields>(this, {
      // _currency: observable,
      _list: observable,
      _meta: observable,
      _page: observable,
      _currency: observable,
      meta: computed,
      list: computed,
      currency: computed,
      getCoinListData: action.bound,
      filterGainers: action.bound,
      filterLosers: action.bound,
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

  get currency(): string {
    return this._currency;
  }

  filterLosers() {
    this._list = this._list.filter(
      (item) => parseInt(item.price_change_percentage_24h) < 0,
    );
  }
  filterGainers() {
    this._list = this._list.filter(
      (item) => parseInt(item.price_change_percentage_24h) > 0,
    );
  }

  getNextPage(search: string, categories: string[]) {
    this._page++;
    this.getCoinListData(search, categories);
  }

  resetList() {
    runInAction(() => {
      this._page = 1;
      this._list = [];
    });
  }

  async getCoinListData(search: string, categories: string[]) {
    if (search.trim() === "") search = "usd";
    this._meta = Meta.loading;

    if (categories.length !== 0) {
      // Если я правильно понимаю, апи может отдавать только монеты 1 категории за раз, так что придётся делать кучу вызовов.
      try {
        runInAction(() => {
          categories.forEach(async (cat) => {
            const response = await axios.get<CoinData[]>(
              `${BASE_URL}/coins/markets/?vs_currency=${search}&category=${cat}&per_page=50&page=${this._page}
          `,
            );
            runInAction(() => {
              if (response.status === 200) {
                this._list = [...this._list!, ...response.data];
              }
            });
          });
        });

        this._meta = Meta.success;
      } catch (e) {
        this._meta = Meta.error;
        alert("API is overloaded, try again in a few minutes.");
      }
    } else {
      try {
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
        });
      } catch (e) {
        this._meta = Meta.error;

        alert("API is overloaded, try again in a few minutes.");
      }
    }
  }
  destroy(): void {
    this._list = [];
    this._page = 1;
  }
  private readonly _qpReaction: IReactionDisposer = reaction(
    () => rootStore.query.getParam("vs_currency"),
    (currency) => {
      if (currency) this._currency = currency as string;
      else this._currency = "usd";
    },
    { delay: 1000 },
  );
}

export default CoinListStore;
