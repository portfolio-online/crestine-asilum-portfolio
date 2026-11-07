import { describe, expect, it } from "vitest";
import { MAX_WORK_SAMPLE_FILE_SIZE_BYTES } from "./portfolio-context";
import { readWorkSampleFile } from "./work-sample-attachment";

describe("work sample attachments", () => {
  it("reads a supported file as a data URL", async () => {
    const file = new File(["sample"], "sample.pdf", { type: "application/pdf" });

    await expect(readWorkSampleFile(file)).resolves.toEqual({
      name: "sample.pdf",
      dataUrl: "data:application/pdf;base64,c2FtcGxl",
    });
  });

  it("rejects unsupported file types", async () => {
    const file = new File(["script"], "script.js", { type: "text/javascript" });

    await expect(readWorkSampleFile(file)).rejects.toThrow("Choose a PDF");
  });

  it("rejects files larger than 2 MB", async () => {
    const file = new File([new Uint8Array(MAX_WORK_SAMPLE_FILE_SIZE_BYTES + 1)], "large.pdf", {
      type: "application/pdf",
    });

    await expect(readWorkSampleFile(file)).rejects.toThrow("smaller than 2 MB");
  });
});
