import { Pagination } from './pagination';

export interface SingleCategory {
	id: number;
	name: string;
	slug: string | null;
	description: string | null;
	is_active: boolean;
	parent_id: number | null;
	children?: SingleCategory[];
	created_at: string;
	updated_at: string;
}

export interface CategoryParentOption {
	id: number;
	name: string;
	label: string;
	depth: 1 | 2;
}

export interface Category extends Pagination {
	data: SingleCategory[];
}
