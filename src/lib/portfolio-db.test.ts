import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { defaultPortfolioData } from "./portfolio-data";

const originalEnvironment = {
  databasePath: process.env["PORTFOLIO_DB_PATH"],
  adminUsername: process.env["PORTFOLIO_ADMIN_USERNAME"],
  adminPassword: process.env["PORTFOLIO_ADMIN_PASSWORD"],
};

describe("portfolio SQLite database", () => {
  let database: typeof import("./portfolio-db.server");

  beforeAll(async () => {
    process.env["PORTFOLIO_DB_PATH"] = ":memory:";
    process.env["PORTFOLIO_ADMIN_USERNAME"] = "admin";
    process.env["PORTFOLIO_ADMIN_PASSWORD"] = "test-password";
    database = await import("./portfolio-db.server");
  });

  afterAll(() => {
    restoreEnvironment("PORTFOLIO_DB_PATH", originalEnvironment.databasePath);
    restoreEnvironment("PORTFOLIO_ADMIN_USERNAME", originalEnvironment.adminUsername);
    restoreEnvironment("PORTFOLIO_ADMIN_PASSWORD", originalEnvironment.adminPassword);
  });

  it("initializes with defaults and persists valid edits", () => {
    expect(database.readPortfolioData()).toEqual(defaultPortfolioData);

    const updated = {
      ...defaultPortfolioData,
      profile: { ...defaultPortfolioData.profile, name: "Updated Name" },
      capabilities: [...defaultPortfolioData.capabilities, "New capability"],
    };

    database.writePortfolioData(updated);

    expect(database.readPortfolioData()).toEqual(updated);
  });

  it("rejects malformed portfolio data", () => {
    const malformed: unknown = { ...defaultPortfolioData, capabilities: "not a list" };

    expect(() => database.writePortfolioData(malformed)).toThrow();
  });

  it("persists work sample attachments and upgrades older link-only entries", () => {
    const sample = {
      title: "Work sample",
      description: "A sample document.",
      attachment: {
        name: "sample.pdf",
        dataUrl: "data:application/pdf;base64,c2FtcGxl",
      },
    };
    const updated = { ...defaultPortfolioData, workSamples: [sample] };

    database.writePortfolioData(updated);

    expect(database.readPortfolioData().workSamples).toEqual([sample]);

    const legacyData = {
      ...defaultPortfolioData,
      workSamples: [
        {
          title: "Legacy sample",
          description: "Old entry",
          googleSheetsUrl: "https://docs.google.com/spreadsheets/d/legacy/edit",
        },
      ],
    };

    expect(database.writePortfolioData(legacyData).workSamples).toEqual([
      {
        title: "Legacy sample",
        description: "Old entry",
        attachment: { name: "", dataUrl: "" },
      },
    ]);
  });

  it("persists profile images and supplies defaults for existing profile data", () => {
    const updated = {
      ...defaultPortfolioData,
      profile: {
        ...defaultPortfolioData.profile,
        sidebarImage: "data:image/jpeg;base64,c2lkZWJhcg==",
        heroImage: "data:image/png;base64,aGVybw==",
        contactImage: "data:image/webp;base64,Y29udGFjdA==",
      },
    };

    database.writePortfolioData(updated);

    expect(database.readPortfolioData().profile).toEqual(updated.profile);

    const existingProfile = { ...defaultPortfolioData.profile };
    delete (existingProfile as Partial<typeof defaultPortfolioData.profile>)["sidebarImage"];
    delete (existingProfile as Partial<typeof defaultPortfolioData.profile>)["heroImage"];
    delete (existingProfile as Partial<typeof defaultPortfolioData.profile>)["contactImage"];
    const legacy = { ...defaultPortfolioData, profile: existingProfile };

    expect(database.writePortfolioData(legacy).profile).toMatchObject({
      sidebarImage: "",
      heroImage: "",
      contactImage: "",
    });
  });

  it("rejects unsupported or oversized profile images", () => {
    const unsupported = {
      ...defaultPortfolioData,
      profile: {
        ...defaultPortfolioData.profile,
        sidebarImage: "data:image/svg+xml;base64,PHN2Zy8+",
      },
    };
    const oversized = {
      ...defaultPortfolioData,
      profile: {
        ...defaultPortfolioData.profile,
        sidebarImage: `data:image/jpeg;base64,${"A".repeat(2_800_000)}`,
      },
    };

    expect(() => database.writePortfolioData(unsupported)).toThrow();
    expect(() => database.writePortfolioData(oversized)).toThrow();
  });

  it("checks admin credentials on the server", () => {
    expect(database.verifyPortfolioAdmin("admin", "test-password")).toBe(true);
    expect(database.verifyPortfolioAdmin("admin", "wrong-password")).toBe(false);
  });
});

function restoreEnvironment(key: string, value: string | undefined) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}
