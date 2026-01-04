import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ensures external links work even when admins save URLs like "www.youtube.com/...".
export function toExternalUrl(rawUrl: string): string {
  const url = (rawUrl ?? "").trim();
  if (!url) return "#";

  // If it already has a scheme (https:, http:, mailto:, etc.), keep it.
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return url;

  // Protocol-relative URL
  if (url.startsWith("//")) return `https:${url}`;

  return `https://${url}`;
}
