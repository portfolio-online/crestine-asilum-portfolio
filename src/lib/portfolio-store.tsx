import { useEffect, useState, type ReactNode } from "react";
import { defaultPortfolioData, type PortfolioData } from "./portfolio-data";
import type { AdminCredentials } from "./portfolio-context";
import { PortfolioContext } from "./portfolio-context";
import { loadPortfolioFromDatabase, savePortfolioToDatabase } from "./portfolio-server";

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadPortfolioFromDatabase()
      .then((saved) => {
        if (active) setData(saved);
      })
      .catch((error: unknown) => {
        console.error("Could not load portfolio data from SQLite:", error);
        if (active) {
          setLoadError(
            "Portfolio data could not be loaded from the database. The default profile is shown.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function saveData(next: PortfolioData, credentials: AdminCredentials) {
    const saved = await savePortfolioToDatabase({ data: { portfolio: next, credentials } });
    setData(saved);
    setLoadError(null);
  }

  return (
    <PortfolioContext.Provider value={{ data, saveData, loadError }}>
      {children}
    </PortfolioContext.Provider>
  );
}
