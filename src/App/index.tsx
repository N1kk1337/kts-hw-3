import React from "react";

import mobXconfig from "config/configureMobX";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import styles from "./index.module.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <BrowserRouter>
    <div className={styles.wrapper}>
      <App />
    </div>
  </BrowserRouter>,
);
