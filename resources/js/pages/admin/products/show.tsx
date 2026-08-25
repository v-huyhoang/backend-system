import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemPermission } from '@/enums/access-control';
import { usePermissions } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { ProductStatus, SingleProduct } from '@/types/product';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, Pencil, Star, X } from 'lucide-react';

const statusVariant = {
	draft: 'yellow',
	published: 'green',
	archived: 'gray',
} as const;

function formatDate(value?: string | null) {
	if (!value) return '—';

	return new Intl.DateTimeFormat('vi-VN', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(value));
}

function ReviewList({
	title,
	items,
	tone,
}: {
	title: string;
	items?: string[] | null;
	tone: 'positive' | 'negative';
}) {
	const Icon = tone === 'positive' ? Check : X;

	return (
		<div className="rounded-lg border p-4">
			<h3 className="flex items-center gap-2 font-semibold">
				<Icon
					className={
						tone === 'positive'
							? 'size-4 text-green-600'
							: 'size-4 text-red-600'
					}
					aria-hidden="true"
				/>
				{title}
			</h3>
			{items?.length ? (
				<ul className="mt-3 space-y-2 text-sm text-muted-foreground">
					{items.map((item) => (
						<li key={item} className="flex gap-2">
							<span aria-hidden="true">•</span>
							<span>{item}</span>
						</li>
					))}
				</ul>
			) : (
				<p className="mt-3 text-sm text-muted-foreground">
					No information provided.
				</p>
			)}
		</div>
	);
}

export default function ProductShow({ product }: { product: SingleProduct }) {
	const { can } = usePermissions();
	const breadcrumbs: BreadcrumbItem[] = [
		{ title: 'Products', href: '/admin/products' },
		{ title: product.code, href: `/admin/products/${product.id}` },
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`${product.name} — Product details`} />
			<div className="flex flex-1 flex-col gap-4 p-4">
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
							<Badge variant="outline" className="font-mono">
								{product.code}
							</Badge>
							<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
								{product.name}
							</h1>
						</div>
						<p className="mt-1 text-sm break-all text-muted-foreground">
							/{product.slug}
						</p>
					</div>
					<div className="flex shrink-0 gap-2">
						<Button asChild variant="outline">
							<Link href="/admin/products">
								<ArrowLeft /> Back
							</Link>
						</Button>
						{can(SystemPermission.EditProducts) && (
							<Button asChild>
								<Link
									href={`/admin/products/${product.id}/edit`}
								>
									<Pencil /> Edit
								</Link>
							</Button>
						)}
					</div>
				</div>

				<div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Content</CardTitle>
							</CardHeader>
							<CardContent className="space-y-5">
								<div>
									<h2 className="text-sm font-medium">
										Short description
									</h2>
									<p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-muted-foreground">
										{product.short_description ||
											'No short description provided.'}
									</p>
								</div>
								<div className="border-t pt-5">
									<h2 className="text-sm font-medium">
										Full content
									</h2>
									<p className="mt-2 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
										{product.content ||
											'No content provided.'}
									</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Review details</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4 md:grid-cols-2">
								<ReviewList
									title="Advantages"
									items={product.advantages}
									tone="positive"
								/>
								<ReviewList
									title="Disadvantages"
									items={product.disadvantages}
									tone="negative"
								/>
								<ReviewList
									title="Suitable for"
									items={product.suitable_for}
									tone="positive"
								/>
								<ReviewList
									title="Not suitable for"
									items={product.not_suitable_for}
									tone="negative"
								/>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Overview</CardTitle>
							</CardHeader>
							<CardContent>
								{product.thumbnail_path ? (
									<img
										src={product.thumbnail_path}
										alt={product.name}
										className="aspect-video w-full rounded-lg border object-cover"
									/>
								) : (
									<div className="grid aspect-video place-items-center rounded-lg border bg-muted text-sm text-muted-foreground">
										No image
									</div>
								)}
								<dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
									<div>
										<dt className="text-muted-foreground">
											Status
										</dt>
										<dd className="mt-1">
											<Badge
												variant={
													statusVariant[
														product.status as ProductStatus
													]
												}
											>
												{product.status}
											</Badge>
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">
											Product type
										</dt>
										<dd className="mt-1">
											{product.is_featured ? (
												<Badge variant="yellow">
													Featured
												</Badge>
											) : (
												<Badge variant="gray">
													Standard
												</Badge>
											)}
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">
											Category
										</dt>
										<dd className="mt-1 font-medium">
											{product.category?.name ??
												'Uncategorized'}
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">
											Sort order
										</dt>
										<dd className="mt-1 font-medium">
											{product.sort_order}
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">
											Published at
										</dt>
										<dd className="mt-1 font-medium">
											{formatDate(product.published_at)}
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">
											Created at
										</dt>
										<dd className="mt-1 font-medium">
											{formatDate(product.created_at)}
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">
											Updated at
										</dt>
										<dd className="mt-1 font-medium">
											{formatDate(product.updated_at)}
										</dd>
									</div>
								</dl>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
