export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { ROOT, API_KEY } = env;
		const url = new URL(request.url);
		url.host = ROOT;
		url.port = "";

		const cache = caches.default;

		const cachedResponse = await cache.match(url);
		if (cachedResponse) {
			return cachedResponse;
		}

		const cacheTime = 3600;

		const upstreamResponse = await fetch(url, {
			cf: {
				cacheEverything: true,
				cacheTtlByStatus: {
					"200-299": cacheTime,
					"429": 0
				}
			},
			headers: {
				"API-Key": request.headers.get('API-Key') ?? API_KEY
			}
		});

		let response = new Response(upstreamResponse.body, {
			status: upstreamResponse.status,
			statusText: upstreamResponse.statusText,
			headers: {
				"content-type": upstreamResponse.headers.get("content-type") ?? "",
			}
		});
		if (upstreamResponse.status === 429) {
			response.headers.set("cache-control", `public, max-age=${upstreamResponse.headers.get("ratelimit-reset") ?? 30}`);
			ctx.waitUntil(cache.put(url, response.clone()));
		} else {
			response.headers.delete("cache-control");
			ctx.waitUntil(cache.put(url, response.clone()));
			response.headers.set("cache-control", `public, immutable, max-age=${cacheTime}`);
		}

		return response;
	},
} satisfies ExportedHandler<Env>;
