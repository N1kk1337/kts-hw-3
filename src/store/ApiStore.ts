import { Meta } from "@utils/meta";
import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import { SingleCoinData } from "src/App/pages/CoinPage/CoinPage";

type PrivateFields = "_coin" | "_meta";

class FetchSingleCoinData {
  currency = { value: "usd" };
  private _meta: Meta = Meta.initial;
  private _coin?: SingleCoinData;

  constructor() {
    makeObservable<FetchSingleCoinData, PrivateFields>(this, {
      currency: observable,
      _coin: observable,
      _meta: observable,
      meta: computed,
      coin: computed,
      getSingleCoinData: action.bound,
    });
  }

  get coin(): SingleCoinData {
    return this._coin;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getSingleCoinData(coinId: string, curr: string = "usd") {
    const [coinName, currencyCode] = coinId.split("&currency=");
    this.currency = currencyCode || "usd";
    const url = `https://api.coingecko.com/api/v3/coins/${coinName}`;
    const response = await axios.get<SingleCoinData>(url);
    this._coin = response.data;
    this._loading = Meta.success;
  }
}

export default new FetchSingleCoinData();
