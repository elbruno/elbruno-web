const blogHosts = new Set(['elbruno.com', 'www.elbruno.com', 'elbruno.wordpress.com']);

export function isExternalBlog(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  return blogHosts.has(new URL(href).hostname);
}
