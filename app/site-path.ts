const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH?.replace(/\/$/, "") ?? "";

/** Keep root-relative links portable between the Sites domain and GitHub Pages. */
export function sitePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (path === "/") return basePath ? `${basePath}/` : "/";
  return `${basePath}${path}`;
}
