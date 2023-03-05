import { Option } from "@components/MultiDropdown/MultiDropdown";
import { API_CATEGORIES } from "@config/api";
import { Meta } from "@utils/meta";
import axios from "axios";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { ILocalStore } from "./useLocalStore";

type PrivateFields = "_list" | "_meta";

class CoinCategoryListStore implements ILocalStore {
  // private _currency = "usd";
  private _meta: Meta = Meta.initial;
  private _list: Option[] | undefined;

  constructor() {
    makeObservable<CoinCategoryListStore, PrivateFields>(this, {
      // _currency: observable,
      _list: observable,
      _meta: observable,
      meta: computed,
      list: computed,
      getCoinCategoryListData: action.bound,
    });
  }

  get list(): Option[] | undefined {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getCoinCategoryListData() {
    this._meta = Meta.loading;
    this._list = undefined;
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
  }
  destroy(): void {}
}

export default CoinCategoryListStore;
