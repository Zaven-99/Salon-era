import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import logo from "./img/logo.png";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppWithStatusCheck() {
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch("https://api.salon-era.ru/server/status");
        if (!response.ok) {
          throw new Error("Сервер недоступен");
        }
      } catch (error) {
        setServerError(true);
        console.error("Ошибка при подключении к серверу:", error);
      }
    };

    checkServerStatus();
  }, []);

  if (serverError) {
    return (
      <div className="message">
        <img className="logo" src={logo} alt="" />
        <p className="text">
          Cервер временно недоступен. Пожалуйста, попробуйте позже.
        </p>
      </div>
    );
  }

  return <App />;
}

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <AppWithStatusCheck />
    </Provider>
  </BrowserRouter>
);
