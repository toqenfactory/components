import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import { defineChain } from "viem";
import { createConfig, http } from "wagmi";

const queryClient = new QueryClient();

const localhost = {
  id: 31_337,
  name: "Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
};

const bitTorrent = defineChain({
  id: 1029,
  name: "BitTorrent Chain Donau",
  nativeCurrency: { name: "BitTorrent", symbol: "BTT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://pre-rpc.bittorrentchain.io/"] },
  },
  blockExplorers: {
    default: { name: "BitTorrent", url: "https://testscan.bt.io" },
  },
  contracts: {
    multicall3: {
      address: "0x5608020135e7Eb9a1ef6683aD4988200eA5Cfcbf",
    },
  },
});

export const config = createConfig({
  chains: [bitTorrent, localhost],
  transports: {
    [bitTorrent.id]: http(),
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
