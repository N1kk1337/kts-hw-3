import axios from "axios";
import { API_CATEGORIES } from "config/api";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Option } from "models/types";
import { Meta } from "utils/meta";

import { ILocalStore } from "../../useLocalStore";

type PrivateFields = "_list" | "_meta";

class CoinCategoryListStore implements ILocalStore {
  // private _currency = "usd";
  private _meta: Meta = Meta.initial;
  private _list: Option[] = [];

  constructor() {
    makeObservable<CoinCategoryListStore, PrivateFields>(this, {
      // _currency: observable,
      _list: observable,
      _meta: observable,
      meta: computed,
      list: computed,
      getCategoryList: action.bound,
    });
  }

  get list(): Option[] | undefined {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getCategoryList() {
    this._meta = Meta.loading;
    this._list = [];
    try {
      const response = await axios.get(API_CATEGORIES);
      runInAction(() => {
        if (response.status === 200) {
          this._list = response.data.map(
            (item: { category_id: any; name: any }) => ({
              key: item.category_id,
              value: item.name,
            }),
          );
          this._meta = Meta.success;
          return;
        }
        this._meta = Meta.error;
      });
    } catch (e) {
      this._meta = Meta.error;
      alert("API is overloaded, try again in a few minutes.");
    }
  }
  destroy(): void {}
}

export default CoinCategoryListStore;
