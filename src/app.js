import React from "react";
import { HashRouter } from "react-router-dom";
import { render } from "react-dom";
import { Toaster } from "react-hot-toast";

import "./css/app.css";

import AppBar from "./components/shared/AppBar";
import Footer from "./components/shared/Footer";
import Main from "./components/Main";

const App = () => (
  <div>
    <AppBar />
    <Main />
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: "blue",
            color: "white",
          },
        },
        error: {
          style: {
            background: "red",
            color: "white",
          },
        },
        style: {
          padding: "5rem 5rem",
        },
      }}
    />
    <Footer />
  </div>
);

render(
  <HashRouter basename="/">
    <App />
  </HashRouter>,

  document.getElementById("memory-game"),
);
