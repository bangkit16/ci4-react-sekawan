import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
