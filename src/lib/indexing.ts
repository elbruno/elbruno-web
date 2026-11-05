export function indexingPolicy(environment = 'staging', origin?: string) {
  if (environment !== 'staging' && environment !== 'production')
    throw new Error('SITE_ENV must be staging or production');
  if (environment === 'production' && origin !== 'https://elbruno.com')
    throw new Error('Production indexing requires SITE_ORIGIN=https://elbruno.com');
  const production = environment === 'production';
  return {
    environment,
    robots: production
      ? 'User-agent: *\nAllow: /\nSitemap: https://elbruno.com/sitemap-index.xml\n'
      : 'User-agent: *\nDisallow: /\n',
    noindex: !production,
  };
}
