import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://gateway-arbitrum.network.thegraph.com/api/408f02f61649fabdcca157b71ceff3c7/subgraphs/id/AyuqXZx9qg6VjBgmL9bTdCizkcbzamEhkqHmDaGLbjW1", // Replace with your GraphQL API URL
  cache: new InMemoryCache(),
});

export default client;
