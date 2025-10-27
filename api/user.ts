export const config = { runtime: "edge" };

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const url = new URL(req.url);

    const upstream = `https://www.duolingo.com/2017-06-30/users${url.search}`;

    const r = await fetch(upstream, {
      method: "GET",
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; DuolingoRank/1.0)",
        accept: "application/json, */*",
        "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8",

        referer: "https://www.duolingo.com/",
      },
    });

    const body = await r.text();
    const headers = new Headers(CORS_HEADERS);
    headers.set(
      "content-type",
      r.headers.get("content-type") ?? "application/json; charset=utf-8"
    );
    headers.set("cache-control", "no-store");

    return new Response(body, { status: r.status, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
