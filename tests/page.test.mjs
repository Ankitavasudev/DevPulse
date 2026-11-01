import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

test("document basics are present", () => {
  assert.match(html, /^<!DOCTYPE html>/i);
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(html, /<meta charset="UTF-8">/i);
  assert.match(html, /name="viewport"/i);
  assert.match(html, /<title>[^<]*DevPulse[^<]*<\/title>/i);
});

test("the page ships a description and a social preview", () => {
  assert.match(html, /<meta name="description" content="[^"]{40,}"/i);
  assert.match(html, /property="og:title"/i);
  assert.match(html, /property="og:description"/i);
});

test("no placeholder images or dead asset hosts", () => {
  assert.doesNotMatch(html, /via\.placeholder\.com/);
  assert.doesNotMatch(html, /placehold\.co/);
  assert.doesNotMatch(html, /example\.com/);
});

test("all remote resources use https", () => {
  const urls = [...html.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(urls.length > 0, "expected at least the font stylesheet");
  for (const url of urls) assert.ok(url.startsWith("https://"), `insecure resource: ${url}`);
});

test("every element the script looks up actually exists", () => {
  const lookups = new Set([
    ...[...html.matchAll(/\$\('([A-Za-z0-9_-]+)'\)/g)].map((m) => m[1]),
    ...[...html.matchAll(/getElementById\('([A-Za-z0-9_-]+)'\)/g)].map((m) => m[1]),
  ]);
  assert.ok(lookups.size > 20, `expected many lookups, found ${lookups.size}`);
  const missing = [...lookups].filter((id) => !ids.has(id));
  assert.deepEqual(missing, [], `script references missing ids: ${missing.join(", ")}`);
});

test("inline scripts parse as valid JavaScript", () => {
  assert.ok(scripts.length >= 1, "expected an inline script");
  for (const code of scripts) {
    assert.doesNotThrow(() => new vm.Script(code), "inline script has a syntax error");
  }
});

test("the GitHub API base is configured once and overridable", () => {
  assert.match(html, /const\s+API\s*=\s*['"]https:\/\/api\.github\.com['"]/);
});

test("keyboard shortcuts documented in the README exist in the script", () => {
  for (const key of ["'/'", "'d'", "'s'"]) {
    assert.ok(html.includes(key), `missing shortcut handler for ${key}`);
  }
});

test("the bundle stays a single self-contained file", () => {
  const bytes = Buffer.byteLength(html, "utf8");
  assert.ok(bytes > 20_000, `unexpectedly small: ${bytes} bytes`);
  assert.ok(bytes < 250_000, `unexpectedly large: ${bytes} bytes`);
  assert.equal([...html.matchAll(/<script\b[^>]*src=/g)].length, 0, "must not load external scripts");
});
