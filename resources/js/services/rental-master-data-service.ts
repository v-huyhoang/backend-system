import { apiFetch } from '@/lib/api-client';

export type PropertyType = { id: number; name: string; slug: string };
export type Amenity = { id: number; name: string; slug: string; icon: string | null };
export type CostType = { id: number; name: string; slug: string; unit: string };

type Collection<T> = { data: T[] };
export const getPropertyTypes = (signal?: AbortSignal) =>
	apiFetch<Collection<PropertyType>>('/api/property-types', { signal });
export const getAmenities = (signal?: AbortSignal) =>
	apiFetch<Collection<Amenity>>('/api/amenities', { signal });
export const getCostTypes = (signal?: AbortSignal) =>
	apiFetch<Collection<CostType>>('/api/listing-cost-types', { signal });
