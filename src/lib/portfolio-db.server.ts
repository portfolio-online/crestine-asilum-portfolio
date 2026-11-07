import { mkdirSync } from "node:fs";
import { timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";
import { defaultPortfolioData } from "./portfolio-data";
import { portfolioSchema } from "./portfolio-context";

const configuredPath = process.env["PORTFOLIO_DB_PATH"]?.trim() || "data/portfolio.sqlite";
const databasePath = configuredPath === ":memory:" ? configuredPath : resolve(configuredPath);
if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec(`
  CREATE TABLE IF NOT EXISTS portfolio_content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    content TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

database
  .prepare("INSERT INTO portfolio_content (id, content) VALUES (1, ?) ON CONFLICT(id) DO NOTHING")
  .run(JSON.stringify(defaultPortfolioData));

const readContent = database.prepare("SELECT content FROM portfolio_content WHERE id = 1");
const writeContent = database.prepare(`
  INSERT INTO portfolio_content (id, content, updated_at)
  VALUES (1, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(id) DO UPDATE SET
    content = excluded.content,
    updated_at = excluded.updated_at
`);

export function readPortfolioData() {
  const row = readContent.get() as { content: string } | undefined;
  if (!row) throw new Error("Portfolio data was not found in the SQLite database.");

  return portfolioSchema.parse(JSON.parse(row.content));
}

export function writePortfolioData(content: unknown) {
  const portfolio = portfolioSchema.parse(content);
  writeContent.run(JSON.stringify(portfolio));
  return portfolio;
}

export function verifyPortfolioAdmin(username: string, password: string) {
  const expectedUsername = process.env["PORTFOLIO_ADMIN_USERNAME"];
  const expectedPassword = process.env["PORTFOLIO_ADMIN_PASSWORD"];
  if (!expectedUsername || !expectedPassword) {
    throw new Error(
      "Admin access is not configured. Set PORTFOLIO_ADMIN_USERNAME and PORTFOLIO_ADMIN_PASSWORD on the server.",
    );
  }

  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

function safeEqual(actual: string, expected: string) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length) return false;

  return timingSafeEqual(actualBytes, expectedBytes);
}
