import { configure } from "mobx";

export default configure({
  useProxies: "ifavailable",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});
