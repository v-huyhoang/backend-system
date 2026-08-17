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
	SelectGroup,
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
import { SystemPermission } from '@/enums/access-control';
import { ActiveStatus } from '@/enums/customer';
import { usePermissions } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import * as categoryRoutes from '@/routes/categories';
import { type BreadcrumbItem } from '@/types';
import type {
	Category as CategoryPaginator,
	SingleCategory,
} from '@/types/category';
import type { PageProps } from '@/types/page';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'Categories', href: categoryRoutes.index.url() },
];

interface CategoriesPageProps {
	categories: CategoryPaginator;
	filters: PageProps['filters'];
}

function CategoryRows({
	categories,
	depth = 1,
}: {
	categories: SingleCategory[];
	depth?: number;
}) {
	const { can } = usePermissions();
	const [expandedIds, setExpandedIds] = useState<Set<number>>(
		() => new Set(categories.map((category) => category.id)),
	);

	function toggle(id: number) {
		setExpandedIds((current) => {
			const next = new Set(current);

			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}

			return next;
		});
	}

	function remove(category: SingleCategory) {
		if (confirm(`Delete category "${category.name}"?`)) {
			router.delete(categoryRoutes.destroy.url(category.id), {
				preserveScroll: true,
			});
		}
	}

	return categories.map((category) => {
		const children = category.children ?? [];
		const hasChildren = children.length > 0;
		const isExpanded = expandedIds.has(category.id);

		return (
			<Fragment key={category.id}>
				<TableRow className="odd:bg-slate-50 dark:odd:bg-slate-900/40">
					<TableCell>{category.id}</TableCell>
					<TableCell>{category.sort_order}</TableCell>
					<TableCell>
						<div
							className="flex items-center gap-1"
							style={{ paddingLeft: `${(depth - 1) * 24}px` }}
						>
							{hasChildren ? (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-7 w-7 shrink-0"
									onClick={() => toggle(category.id)}
									aria-label={
										isExpanded ? 'Collapse' : 'Expand'
									}
								>
									{isExpanded ? (
										<ChevronDown className="h-4 w-4" />
									) : (
										<ChevronRight className="h-4 w-4" />
									)}
								</Button>
							) : (
								<span className="w-7 shrink-0" />
							)}
							<span className="font-medium">{category.name}</span>
							<Badge variant="outline" className="ml-2 text-xs">
								Level {depth}
							</Badge>
						</div>
					</TableCell>
					<TableCell>{category.slug || '—'}</TableCell>
					<TableCell
						className="max-w-72 truncate"
						title={category.description ?? ''}
					>
						{category.description || '—'}
					</TableCell>
					<TableCell>
						<Badge
							variant={
								category.is_active ? 'default' : 'secondary'
							}
						>
							{category.is_active ? 'Active' : 'Inactive'}
						</Badge>
					</TableCell>
					<TableCell className="whitespace-nowrap">
						{can(SystemPermission.EditCategories) && (
							<Link href={categoryRoutes.edit(category.id)}>
								<Button variant="outline" size="sm">
									Edit
								</Button>
							</Link>
						)}
						{can(SystemPermission.DeleteCategories) && (
							<Button
								className="ms-2"
								variant="destructive"
								size="sm"
								onClick={() => remove(category)}
							>
								Delete
							</Button>
						)}
					</TableCell>
				</TableRow>
				{hasChildren && isExpanded && (
					<CategoryRows categories={children} depth={depth + 1} />
				)}
			</Fragment>
		);
	});
}

export default function Categories({
	categories,
	filters,
}: CategoriesPageProps) {
	const { flash } = usePage<{ flash: { message?: string; error?: string } }>()
		.props;
	const { can } = usePermissions();
	const [search, setSearch] = useState(filters.q ?? '');
	const [activeFilter, setActiveFilter] = useState(
		filters.is_active ?? 'all',
	);
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
			const query: { q?: string; is_active?: string } = {};
			if (search.trim()) query.q = search.trim();
			if (activeFilter !== 'all') query.is_active = activeFilter;

			router.get(categoryRoutes.index.url(), query, {
				preserveState: true,
				replace: true,
			});
		}, 400);

		return () => clearTimeout(timeout);
	}, [search, activeFilter]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Categories" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Categories Management</CardTitle>
						<CardAction>
							{can(SystemPermission.CreateCategories) && (
								<Link href={categoryRoutes.create()}>
									<Button>Add New</Button>
								</Link>
							)}
						</CardAction>
					</CardHeader>
					<CardContent>
						<div className="mb-4 grid gap-4 md:grid-cols-2">
							<Input
								placeholder="Search root categories..."
								value={search}
								onChange={(event) =>
									setSearch(event.target.value)
								}
							/>
							<div className="w-[180px]">
								<Select
									value={activeFilter}
									onValueChange={setActiveFilter}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="all">
												All statuses
											</SelectItem>
											<SelectItem
												value={String(
													ActiveStatus.Active,
												)}
											>
												Active
											</SelectItem>
											<SelectItem
												value={String(
													ActiveStatus.Inactive,
												)}
											>
												Inactive
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
						<Table>
							<TableHeader className="bg-slate-500 dark:bg-slate-700">
								<TableRow>
									{[
										'ID',
										'Order',
										'Name',
										'Slug',
										'Description',
										'Status',
										'Actions',
									].map((title) => (
										<TableHead
											key={title}
											className="font-bold text-white"
										>
											{title}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								<CategoryRows categories={categories.data} />
							</TableBody>
						</Table>
					</CardContent>
					{categories.data.length > 0 ? (
						<TablePagination {...categories} />
					) : (
						<div className="py-8 text-center text-muted-foreground">
							No results found.
						</div>
					)}
				</Card>
			</div>
		</AppLayout>
	);
}
