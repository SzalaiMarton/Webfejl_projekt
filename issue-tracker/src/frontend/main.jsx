import React from "react";
import ReactDOM from "react-dom/client";
import Modal from "react-modal";
import App from "./App.jsx";

import "./styles/tokens.css";
import "./styles/design.css";

Modal.setAppElement(document.getElementById("root"));

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);