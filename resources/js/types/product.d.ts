import { Pagination } from './pagination';

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductCategoryOption {
	id: number;
	name: string;
}

export interface SingleProduct {
	id: number;
	category_id?: number | null;
	category?: ProductCategoryOption | null;
	code: string;
	name: string;
	slug: string;
	short_description?: string | null;
	content?: string | null;
	thumbnail_path?: string | null;
	advantages?: string[] | null;
	disadvantages?: string[] | null;
	suitable_for?: string[] | null;
	not_suitable_for?: string[] | null;
	status: ProductStatus;
	is_featured: boolean;
	sort_order: number;
	published_at?: string | null;
	created_at: string;
	updated_at: string;
}

export interface Product extends Pagination {
	data: SingleProduct[];
}
