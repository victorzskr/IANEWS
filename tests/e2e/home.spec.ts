import { expect, test } from "@playwright/test";

test("renders the AgoraAI timeline", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "AgoraAI home" })).toBeVisible();
  await expect(page.getByPlaceholder("Buscar noticias...")).toBeVisible();
  await expect(page.getByText(/Actualizado/)).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "OpenAI actualiza sus herramientas para agentes"
    })
  ).toBeVisible();
});

test("filters timeline cards from the search box", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Buscar noticias...").fill("Claude Code");

  await expect(
    page.getByRole("heading", { name: "Anthropic publica mejoras en Claude Code" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "OpenAI actualiza sus herramientas para agentes"
    })
  ).toBeHidden();
});

test("filters case-insensitively and restores the timeline after clearing search", async ({
  page
}) => {
  await page.goto("/");

  const searchInput = page.getByPlaceholder("Buscar noticias...");

  await searchInput.fill("claude code");

  await expect(
    page.getByRole("heading", { name: "Anthropic publica mejoras en Claude Code" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "OpenAI actualiza sus herramientas para agentes"
    })
  ).toBeHidden();

  await searchInput.clear();

  await expect(
    page.getByRole("heading", { name: "Anthropic publica mejoras en Claude Code" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "OpenAI actualiza sus herramientas para agentes"
    })
  ).toBeVisible();
});

test("shows an empty state when search has no matches", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Buscar noticias...").fill("no matches here");

  await expect(
    page.getByText("No hay noticias que coincidan con la búsqueda.")
  ).toBeVisible();
});

test("opens external source links in a new tab safely", async ({ context, page }) => {
  await page.goto("/");

  const sourceLink = page
    .getByRole("link", { name: /Leer fuente/ })
    .first();

  await expect(sourceLink).toHaveAttribute("href", /^https:\/\//);
  await expect(sourceLink).toHaveAttribute("target", "_blank");
  await expect(sourceLink).toHaveAttribute("rel", /noopener/);
  await expect(sourceLink).toHaveAttribute("rel", /noreferrer/);
  await expect(sourceLink).toHaveAttribute("rel", /external/);

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    sourceLink.click()
  ]);

  await expect(page).toHaveURL("/");
  expect(newPage.url()).not.toBe(page.url());
  await newPage.close();
});
