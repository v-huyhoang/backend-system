import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ProductCategoryOption, SingleProduct } from '@/types/product';
import { Head } from '@inertiajs/react';
import ProductForm from './product-form';

export default function EditProduct({
	product,
	categories = [],
}: {
	product: SingleProduct;
	categories?: ProductCategoryOption[];
}) {
	const breadcrumbs: BreadcrumbItem[] = [
		{ title: 'Products', href: '/admin/products' },
		{ title: product.name, href: `/admin/products/${product.id}/edit` },
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Edit ${product.name}`} />
			<div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
				<div>
					<h1 className="text-2xl font-semibold">Edit product</h1>
					<p className="mt-1 text-sm text-muted-foreground">Update {product.code} without losing sight of its publishing state.</p>
				</div>
				<ProductForm product={product} categories={categories} />
			</div>
		</AppLayout>
	);
}
