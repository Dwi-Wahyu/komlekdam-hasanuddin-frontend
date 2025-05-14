import truncate from "truncate-html";

export function truncateHtml(content: string, maxLength: number): string {
  return truncate(content, {
    length: maxLength,
    ellipsis: "...",
    keepWhitespaces: false,
  });
}
