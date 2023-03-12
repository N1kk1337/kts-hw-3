import React from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import mobXconfig from "../config/configureMobX";
import App from "./App";
import styles from "./index.module.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className={styles.container}>
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
