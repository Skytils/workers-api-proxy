export default {
	async fetch(request, env, ctx): Promise<Response> {
		let url = new URL(request.url);
		url.host = env.ROOT;
		url.port = "";
		return fetch(url, {
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
	},
} satisfies ExportedHandler<Env>;
