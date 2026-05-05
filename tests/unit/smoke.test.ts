import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("project scaffold", () => {
  it("validates a minimal news item shape with zod", () => {
    const newsItemSchema = z.object({
      title: z.string().min(1),
      url: z.url()
    });

    expect(
      newsItemSchema.parse({
        title: "Hello world from IANEWS",
        url: "https://example.com"
      })
    ).toEqual({
      title: "Hello world from IANEWS",
      url: "https://example.com"
    });
  });
});
