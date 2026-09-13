export async function apiFetch<T>(
	url: string,
	options?: RequestInit,
): Promise<T> {
	const response = await fetch(url, {
		headers: {
			Accept: 'application/json',
			...options?.headers,
		},
		...options,
	});

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	return (await response.json()) as T;
}
