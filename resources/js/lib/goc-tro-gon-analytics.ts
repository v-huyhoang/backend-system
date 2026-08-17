export function trackGocTroGonEvent(
	event: string,
	data: Record<string, string> = {},
) {
	window.dispatchEvent(
		new CustomEvent('gtg:analytics', { detail: { event, ...data } }),
	);
}
