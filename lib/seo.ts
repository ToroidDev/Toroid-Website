export const SITE_URL = "https://toroid.com.br";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
