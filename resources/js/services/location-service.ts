import { apiFetch } from '@/lib/api-client';

export interface LocationSuggestion {
	id?: number;
	label: string;
	url: string;
	type: string;
}

interface ApiCollection<T> {
	data: T[];
}

export function searchLocations(
	query: string,
	signal?: AbortSignal,
): Promise<ApiCollection<LocationSuggestion>> {
	const params = new URLSearchParams();

	if (query) params.set('q', query);

	return apiFetch(`/api/dia-chi/goi-y?${params}`, { signal });
}

export function getProvinces(
	signal?: AbortSignal,
): Promise<ApiCollection<LocationSuggestion>> {
	return apiFetch('/api/tinh-thanh', { signal });
}

export function getWards(
	provinceSlug: string | undefined,
	signal?: AbortSignal,
): Promise<ApiCollection<LocationSuggestion>> {
	return apiFetch(`/api/tinh-thanh/${provinceSlug}/phuong-xa`, { signal });
}
