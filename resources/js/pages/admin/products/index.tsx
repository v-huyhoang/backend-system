import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { SystemPermission } from '@/enums/access-control';
import { usePermissions } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PageProps } from '@/types/page';
import type { Product, ProductStatus } from '@/types/product';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'Products', href: '/admin/products' },
];

const statusVariant = {
	draft: 'secondary',
	published: 'default',
	archived: 'outline',
} as const;

interface ProductsPageProps {
	products: Product;
	filters?: PageProps['filters'] & { status?: string };
}

export default function Products({
	products,
	filters = {},
}: ProductsPageProps) {
	const { can } = usePermissions();
	const { flash } = usePage<{ flash: { message?: string; error?: string } }>()
		.props;
	const [search, setSearch] = useState(filters.q ?? '');
	const [status, setStatus] = useState(filters.status ?? 'all');
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (flash.message) toast.success(flash.message);
		if (flash.error) toast.error(flash.error);
	}, [flash]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const timeout = setTimeout(() => {
			router.get(
				'/admin/products',
				{
					...(search.trim() ? { q: search.trim() } : {}),
					...(status !== 'all' ? { status } : {}),
				},
				{ preserveState: true, replace: true },
			);
		}, 400);
		return () => clearTimeout(timeout);
	}, [search, status]);

	function remove(id: number, name: string) {
		if (confirm(`Delete product "${name}"?`)) {
			router.delete(`/admin/products/${id}`, { preserveScroll: true });
		}
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Products" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<div>
							<CardTitle>Products Management</CardTitle>
							<p className="mt-1 text-sm text-muted-foreground">
								Manage product content and publishing status.
							</p>
						</div>
						<CardAction>
							{can(SystemPermission.CreateProducts) && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button asChild size="icon">
											<Link
												href="/admin/products/create"
												aria-label="Add new product"
											>
												<Plus />
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										Add new product
									</TooltipContent>
								</Tooltip>
							)}
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent>
						<div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]"></div>
						<div className="pb-4">
							<Table>
								<TableHeader>
									<TableRow className="border-none hover:bg-transparent">
										<TableHead>Search</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow className="hover:bg-transparent">
										<TableCell>
											<Input
												value={search}
												onChange={(event) =>
													setSearch(
														event.target.value,
													)
												}
												placeholder="Search by name or code..."
												aria-label="Search products"
											/>
										</TableCell>
										<TableCell>
											<Select
												value={status}
												onValueChange={setStatus}
											>
												<SelectTrigger>
													<SelectValue placeholder="All statuses" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">
														All statuses
													</SelectItem>
													<SelectItem value="draft">
														Draft
													</SelectItem>
													<SelectItem value="published">
														Published
													</SelectItem>
													<SelectItem value="archived">
														Archived
													</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
						<Table className="min-w-[48rem] table-fixed">
							<TableHeader className="bg-slate-500 dark:bg-slate-700">
								<TableRow>
									<TableHead className="w-20 font-bold text-white">
										Code
									</TableHead>
									<TableHead className="font-bold text-white">
										Product
									</TableHead>
									<TableHead className="w-40 font-bold text-white">
										Category
									</TableHead>
									<TableHead className="w-28 font-bold text-white">
										Status
									</TableHead>
									<TableHead className="w-20 font-bold text-white">
										Order
									</TableHead>
									<TableHead className="w-24 font-bold text-white">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.data.map((product) => (
									console.log(product),
									<TableRow
										key={product.id}
										className="odd:bg-slate-100 dark:odd:bg-slate-800"
									>
										<TableCell className="font-medium">
											{product.code}
										</TableCell>
										<TableCell>
											<div className="flex min-w-0 items-center gap-3">
												{product.thumbnail_path ? (
													<img
														src={
															product.thumbnail_path
														}
														alt=""
														className="size-10 shrink-0 rounded-md border object-cover"
													/>
												) : (
													<div className="grid size-10 shrink-0 place-items-center rounded-md border bg-muted text-xs text-muted-foreground">
														IMG
													</div>
												)}
												<div className="min-w-0">
													<div className="flex items-center gap-1.5">
														<p
															className="truncate font-medium"
															title={product.name}
														>
															{product.name}
														</p>
														{product.is_featured && (
															<Star
																className="size-4 shrink-0 fill-amber-400 text-amber-500"
																aria-label="Featured"
															/>
														)}
													</div>
													<p className="truncate text-xs text-muted-foreground">
														/{product.slug}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell
											className="truncate"
											title={product.category?.name}
										>
											{product.category?.name ?? '—'}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													statusVariant[
														product.status as ProductStatus
													]
												}
											>
												{product.status}
											</Badge>
										</TableCell>
										<TableCell>
											{product.sort_order}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{can(
													SystemPermission.EditProducts,
												) && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																asChild
																variant="outline"
																size="icon"
																className="size-8"
															>
																<Link
																	href={`/admin/products/${product.id}/edit`}
																	aria-label={`Edit ${product.name}`}
																>
																	<Pencil />
																</Link>
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Edit product
														</TooltipContent>
													</Tooltip>
												)}
												{can(
													SystemPermission.DeleteProducts,
												) && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="destructive"
																size="icon"
																className="size-8"
																aria-label={`Delete ${product.name}`}
																onClick={() =>
																	remove(
																		product.id,
																		product.name,
																	)
																}
															>
																<Trash2 />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Delete product
														</TooltipContent>
													</Tooltip>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
					{products.data.length > 0 ? (
						<TablePagination
							total={products.total}
							from={products.from}
							to={products.to}
							links={products.links}
						/>
					) : (
						<div className="py-10 text-center text-muted-foreground">
							No products found.
						</div>
					)}
				</Card>
			</div>
		</AppLayout>
	);
}
