export type LandlordListingStatus =
	| 'published'
	| 'pending_review'
	| 'rejected'
	| 'draft'
	| 'rented';

export interface LandlordListingCostForm {
	type: string;
	label: string;
	amount: string;
	unit: string;
	note: string;
}

export interface LandlordListing {
	publicId: string;
	title: string;
	address: string;
	monthlyRent: string;
	area: string;
	image: string;
	status: LandlordListingStatus;
	statusLabel: string;
	meta: string;
	expiresLabel?: string;
	rejectionReason?: string;
}

export interface LandlordListingStat {
	label: string;
	value: string;
	description: string;
	icon: 'home' | 'chart' | 'phone' | 'alert';
}
