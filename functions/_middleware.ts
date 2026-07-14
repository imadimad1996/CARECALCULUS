export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const hostname = url.hostname.toLowerCase();

  // If on English/main domain (www.carecalculus.com or carecalculus.com)
  if (!hostname.startsWith('fr.')) {
    // If the path starts with /fr/ or is exactly /fr, 301 redirect to fr.carecalculus.com
    if (url.pathname === '/fr' || url.pathname.startsWith('/fr/')) {
      const newPath = url.pathname.replace(/^\/fr(\/|$)/, '$1') || '/';
      const targetUrl = `https://fr.carecalculus.com${newPath === '/' ? '' : newPath}${url.search}`;
      return Response.redirect(targetUrl, 301);
    }
    return context.next();
  }

  // If on French domain (fr.carecalculus.com)
  if (hostname.startsWith('fr.')) {
    // Cloudflare Pages canonicalizes the internally rewritten /fr route to
    // /fr/. Let that canonical route pass through on the French host. Trying
    // to redirect it back to / creates a / -> /fr/ -> / loop.
    if (url.pathname === '/fr' || url.pathname.startsWith('/fr/')) {
      return context.next();
    }

    // Check if request is for a static asset or file extension (e.g., .js, .css, .png, .ico, /assets/, etc.)
    // If so, pass through directly without rewriting path
    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(js|css|ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot|json|map|txt|xml)$/i)
    ) {
      return context.next();
    }

    // For HTML/page requests on fr.carecalculus.com (like / or /bmi-calculator),
    // rewrite internally to the prerendered French page.  Pages normalizes
    // directory URLs to a trailing slash; include that slash in the internal
    // rewrite so it never becomes a client-visible redirect to /fr/.
    //
    // Without it the request looped forever:
    //   / -> internal /fr -> Pages 308 /fr/ -> middleware 301 / -> ...
    const targetPath = url.pathname === '/'
      ? '/fr/'
      : `/fr${url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`}`;
    const newRequest = new Request(new URL(targetPath, url.origin).toString(), context.request);
    return context.next(newRequest);
  }

  return context.next();
};
