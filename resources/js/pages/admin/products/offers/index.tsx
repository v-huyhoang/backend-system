import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

type Offer = {
	id: number;
	merchant_name: string;
	platform: string;
	reference_price: string | null;
	currency: string;
	is_in_stock: boolean;
	status: string;
	product_url: string;
};

export default function ProductOffers({
	product,
	offers,
}: {
	product: { id: number; name: string; code: string };
	offers: Offer[];
}) {
	const breadcrumbs: BreadcrumbItem[] = [
		{ title: 'Products', href: '/admin/products' },
		{ title: product.code, href: `/admin/products/${product.id}` },
		{ title: 'Offers', href: `/admin/products/${product.id}/offers` },
	];
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`${product.name} — Offers`} />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card className="gap-2">
					<CardHeader>
						<CardTitle>Product Offers</CardTitle>
						<p className="text-sm text-muted-foreground">
							{product.name}
						</p>
					</CardHeader>
					<hr />
					<CardContent>
						<Table>
							<TableHeader className="bg-slate-500 dark:bg-slate-700">
								<TableRow>
									<TableHead className="font-bold text-white">
										Merchant
									</TableHead>
									<TableHead className="font-bold text-white">
										Platform
									</TableHead>
									<TableHead className="font-bold text-white">
										Price
									</TableHead>
									<TableHead className="font-bold text-white">
										Stock
									</TableHead>
									<TableHead className="font-bold text-white">
										Status
									</TableHead>
									<TableHead className="font-bold text-white">
										Link
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{offers.map((offer) => (
									<TableRow
										key={offer.id}
										className="odd:bg-slate-50 dark:odd:bg-slate-900/40"
									>
										<TableCell className="font-medium">
											{offer.merchant_name}
										</TableCell>
										<TableCell>{offer.platform}</TableCell>
										<TableCell>
											{offer.reference_price
												? `${offer.reference_price} ${offer.currency}`
												: '—'}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													offer.is_in_stock
														? 'green'
														: 'gray'
												}
											>
												{offer.is_in_stock
													? 'In stock'
													: 'Out of stock'}
											</Badge>
										</TableCell>
										<TableCell>{offer.status}</TableCell>
										<TableCell>
											<a
												href={offer.product_url}
												target="_blank"
												rel="noreferrer"
												className="text-primary hover:underline"
											>
												Open
											</a>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						{!offers.length && (
							<div className="py-8 text-center text-muted-foreground">
								No offers found.
							</div>
						)}
						<div className="mt-4">
							<Link
								href={`/admin/products/${product.id}`}
								className="text-sm text-muted-foreground hover:underline"
							>
								← Back to product
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}
