export async function GET(request: Request) {
  // 1. Get the symbol from the client's request
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return new Response('Missing symbol', { status: 400 });
  }

  // 2. Build the secure URL on the server
  const logoUrl = `https://img.logo.dev/ticker/${symbol}?token=${process.env.LOGO_DEV_TOKEN}&format=webp&retina=true`;

  try {
    // 3. Fetch the image securely
    const response = await fetch(logoUrl);
    
    if (!response.ok) {
      return new Response('Image not found', { status: response.status });
    }

    // 4. Return the image directly to the client with caching
    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400' // Cache for 24 hours
      },
    });
  } catch (error) {
    return new Response('Error fetching logo', { status: 500 });
  }
}