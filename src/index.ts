export default {
	async fetch(request, env, ctx): Promise<Response> {
		let url = new URL(request.url);
		url.host = env.ROOT;
		url.port = "";
		return fetch(url, {
			headers: {
				"API-Key": env.API_KEY
			}
		});
	},
} satisfies ExportedHandler<Env>;
