import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { portfolioSchema } from "./portfolio-context";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const loadPortfolioFromDatabase = createServerFn({ method: "GET" }).handler(async () => {
  const { readPortfolioData } = await import("./portfolio-db.server");
  return readPortfolioData();
});

export const verifyPortfolioAdmin = createServerFn({ method: "POST" })
  .validator(credentialsSchema)
  .handler(async ({ data }) => {
    const { verifyPortfolioAdmin: verify } = await import("./portfolio-db.server");
    if (!verify(data.username, data.password)) {
      throw new Error("Incorrect username or password.");
    }
    return true;
  });

export const savePortfolioToDatabase = createServerFn({ method: "POST" })
  .validator(
    z.object({
      credentials: credentialsSchema,
      portfolio: portfolioSchema,
    }),
  )
  .handler(async ({ data }) => {
    const { verifyPortfolioAdmin: verify, writePortfolioData } =
      await import("./portfolio-db.server");
    if (!verify(data.credentials.username, data.credentials.password)) {
      throw new Error("Incorrect username or password.");
    }
    return writePortfolioData(data.portfolio);
  });
