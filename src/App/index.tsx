import React from "react";

import ReactDOM from "react-dom/client";

import mobXconfig from "../config/configureMobX";
import App from "./App";
import styles from "./index.module.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <div className={styles.container}>
      <App />
    </div>
  </React.StrictMode>,
);
