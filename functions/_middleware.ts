import type { PagesFunction } from '@cloudflare/workers-types';

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
    const response = await context.next();
    // Do NOT return HTML fallback for missing JS/CSS/image static assets
    const isStaticAsset = url.pathname.startsWith('/assets/') || url.pathname.startsWith('/pdf/') || url.pathname.match(/\.(js|css|ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot|json|map|txt|xml|pdf)$/i);
    if (response.status === 404 && !isStaticAsset) {
      const fallbackUrl = new URL('/', context.request.url);
      return context.env.ASSETS.fetch(new Request(fallbackUrl.toString(), context.request as any) as any) as any;
    }
    return response;
  }

  // If on French domain (fr.carecalculus.com)
  if (hostname.startsWith('fr.')) {
    // Cloudflare Pages canonicalizes the internally rewritten /fr route to
    // /fr/. Let that canonical route pass through on the French host. Trying
    // to redirect it back to / creates a / -> /fr/ -> / loop.
    if (url.pathname === '/fr' || url.pathname.startsWith('/fr/')) {
      const response = await context.next();
      if (response.status === 404) {
        const fallbackUrl = new URL('/', context.request.url);
        return context.env.ASSETS.fetch(new Request(fallbackUrl.toString(), context.request as any) as any) as any;
      }
      return response;
    }

    // Check if request is for a static asset or file extension (e.g., .js, .css, .png, .ico, /assets/, /pdf/, etc.)
    // If so, pass through directly without rewriting path
    if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/pdf/') ||
      url.pathname.match(/\.(js|css|ico|png|jpg|jpeg|svg|webp|woff|woff2|ttf|eot|json|map|txt|xml|pdf)$/i)
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
    const newRequest = new Request(new URL(targetPath, url.origin).toString(), context.request as any) as any;
    const response = await context.next(newRequest);
    
    // If the prerendered French path doesn't exist, fallback to SPA index
    if (response.status === 404) {
      const fallbackUrl = new URL('/', context.request.url);
      return context.env.ASSETS.fetch(new Request(fallbackUrl.toString(), context.request as any) as any) as any;
    }
    return response;
  }

  const finalResponse = await context.next();
  if (finalResponse.status === 404) {
    const fallbackUrl = new URL('/', context.request.url);
    return context.env.ASSETS.fetch(new Request(fallbackUrl.toString(), context.request as any) as any) as any;
  }
  return finalResponse;
};
