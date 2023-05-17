import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (import.meta.env.VITE_MOCK_API === "1") {
  import("./mocks/browser")
    .then(({worker}) => {
      worker.start({onUnhandledRequest: "bypass"});
    })
    .then(() => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    });
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
