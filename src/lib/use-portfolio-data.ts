import { useContext } from "react";
import { PortfolioContext } from "./portfolio-context";

export function usePortfolioStore() {
  const store = useContext(PortfolioContext);
  if (!store) throw new Error("usePortfolioStore must be used within PortfolioProvider");
  return store;
}

export function usePortfolioData() {
  return usePortfolioStore().data;
}
