const ALLOWED_ORIGINS = [
  'https://carecalculus.com',
  'https://www.carecalculus.com',
  'https://fr.carecalculus.com',
  'https://es.carecalculus.com',
  'http://localhost:3000',
  'http://localhost:5173',
];

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const isAllowed = 
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.carecalculus.pages.dev');

  const allowOrigin = isAllowed ? origin : 'https://carecalculus.com';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };
}

export function handleCorsOptions(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
