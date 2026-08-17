import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ProductCategoryOption } from '@/types/product';
import { Head } from '@inertiajs/react';
import ProductForm from './product-form';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'Products', href: '/admin/products' },
	{ title: 'Create', href: '/admin/products/create' },
];

export default function CreateProduct({
	categories = [],
}: {
	categories?: ProductCategoryOption[];
}) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create Product" />
			<div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
				<div>
					<h1 className="text-2xl font-semibold">Create product</h1>
					<p className="mt-1 text-sm text-muted-foreground">Add product information, publishing settings, and review details.</p>
				</div>
				<ProductForm categories={categories} />
			</div>
		</AppLayout>
	);
}
