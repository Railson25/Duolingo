export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.search;

    const upstream = `https://www.duolingo.com/2017-06-30/users${search}`;

    const r = await fetch(upstream, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; DuolingoRank/1.0)",
        accept: "application/json, */*",
      },

      method: "GET",
    });

    return new Response(await r.text(), {
      status: r.status,
      headers: {
        "content-type":
          r.headers.get("content-type") ?? "application/json; charset=utf-8",

        "access-control-allow-origin": "*",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}
