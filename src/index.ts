export default {
	async fetch(request, env, ctx): Promise<Response> {
		let url = new URL(request.url);
		url.host = env.ROOT;
		url.port = "";
		return fetch(url, {
			cf: {
				cacheTtl: 3600,
				cacheEverything: true
			},
			headers: {
				"API-Key": env.API_KEY
			}
		});
	},
} satisfies ExportedHandler<Env>;
