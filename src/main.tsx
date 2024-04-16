import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { http, createConfig } from "wagmi";

const queryClient = new QueryClient();

const localhost = {
  id: 31_337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Go",
    symbol: "GO",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
};

export const config = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
