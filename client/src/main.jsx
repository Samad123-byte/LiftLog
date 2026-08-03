import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { registerSW } from "virtual:pwa-register";
import { InstallProvider } from "./context/InstallContext";
import "./index.css";

registerSW({
  immediate: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
  <ToastProvider>
    <AuthProvider>
      <InstallProvider>
        <App />
      </InstallProvider>
    </AuthProvider>
  </ToastProvider>
</BrowserRouter>
  </React.StrictMode>,
);