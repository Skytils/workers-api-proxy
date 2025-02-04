export default {
	async fetch(request, env, ctx): Promise<Response> {
		let url = new URL(request.url);
		url.host = env.ROOT;
		url.port = "";
		let cache = caches.default;
		let response = await cache.match(url);
		if (!response) {
			response = await fetch(url, {
				cf: {
					cacheEverything: true,
					cacheTtlByStatus: {
						"200-299": 3600,
						"429": 0
					}
				},
				headers: {
					"API-Key": env.API_KEY
				}
			});
			response = new Response(response.body);
			response.headers.delete("cache-control");
			await cache.put(url, response.clone());
		}
		return response;
	},
} satisfies ExportedHandler<Env>;
