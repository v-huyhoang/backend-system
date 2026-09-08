import { Pagination } from './pagination';

export type MerchantStatus = 'active' | 'inactive';

export interface SingleMerchant {
	id: number;
	platform?: string;
	external_merchant_id?: string;
	name: string;
	shop_url?: string | null;
	status: MerchantStatus;
	created_at: string;
	updated_at: string;
}

export interface Merchant extends Pagination {
	data: SingleMerchant[];
}
