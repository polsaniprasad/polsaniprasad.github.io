/**
 * Prefix a /public path with the deploy sub-path (e.g. "/prasad-portfolio" on GitHub Pages).
 * Next only rewrites its own links and scripts; raw src/href strings need this.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
