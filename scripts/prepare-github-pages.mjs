import { copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("dist/client");
const files = await readdir(output);

for (const file of files) {
  if (!file.endsWith(".html") || file === "index.html" || file === "404.html") continue;
  const route = file.slice(0, -".html".length);
  const routeDirectory = resolve(output, route);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(resolve(output, file), resolve(routeDirectory, "index.html"));
}

const home = await readFile(resolve(output, "index.html"), "utf8");
const expectedPrefix = "/2026_VCA-Prudens/";
if (!home.includes(`href="${expectedPrefix}`) || !home.includes(`src="${expectedPrefix}`)) {
  throw new Error(`GitHub Pages export is missing the expected ${expectedPrefix} URL prefix.`);
}

for (const required of ["description", "methods", "members", "results"]) {
  const html = await readFile(resolve(output, required, "index.html"), "utf8");
  if (!html.includes("VCA-Prudens")) throw new Error(`Static route ${required} was not generated correctly.`);
}

console.log("GitHub Pages clean URLs prepared and verified.");
