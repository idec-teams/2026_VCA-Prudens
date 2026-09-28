import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const githubRepository = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "2026_VCA-Prudens";
const githubBasePath = `/${githubRepository}`;

const nextConfig: NextConfig = {
  ...(githubPages ? {
    output: "export",
    assetPrefix: githubBasePath,
  } : {}),
};

export default nextConfig;
