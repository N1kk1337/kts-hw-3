import CategoryStore from "./CategoryStore";
import QueryParamsStore from "./QueryParamsStore";

export default class RootStore {
  readonly query = new QueryParamsStore();
  readonly category = new CategoryStore();
}
