import type { Pagination } from '@/types/pagination';

export type LandlordListingStatus =
	| 'draft'
	| 'pending_review'
	| 'published'
	| 'rejected'
	| 'hidden'
	| 'rented'
	| 'expired';

export interface LandlordListingCostForm {
	type: string;
	label: string;
	amount: string;
	unit: string;
	note: string;
}

export interface LandlordListing {
	public_id: string;
	title: string;
	address: string;
	monthly_rent: number | string;
	area_sqm: number | string;
	primary_image: { path: string; alt_text: string | null } | null;
	images: Array<{ path: string; alt_text: string | null }>;
	status: LandlordListingStatus;
	status_label: string;
	rejection_reason: string | null;
	expires_at: string | null;
}

export interface PaginatedLandlordListings extends Pagination {
	data: LandlordListing[];
}

export interface LandlordListingSummary {
	published: number;
	view_count: number;
	contact_count: number;
	rejected: number;
	status_counts: Record<LandlordListingStatus, number>;
}

export interface LandlordListingStat {
	label: string;
	value: string;
	description: string;
	icon: 'home' | 'chart' | 'phone' | 'alert';
}
