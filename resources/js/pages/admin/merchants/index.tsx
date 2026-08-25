import TablePagination from '@/components/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Merchant = {
	id: number;
	platform: string;
	name: string;
	shop_url: string | null;
	status: string;
};
type MerchantPaginator = {
	data: Merchant[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	from: number | null;
	to: number | null;
	links: { url: string | null; label: string; active: boolean }[];
};

export default function Merchants({
	merchants,
	filters,
}: {
	merchants: MerchantPaginator;
	filters: { q?: string };
}) {
	const [search, setSearch] = useState(filters.q ?? '');
	const first = useRef(true);
	useEffect(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		const timeout = setTimeout(
			() =>
				router.get(
					'/admin/merchants',
					search.trim() ? { q: search.trim() } : {},
					{ preserveState: true, replace: true },
				),
			400,
		);
		return () => clearTimeout(timeout);
	}, [search]);
	const breadcrumbs: BreadcrumbItem[] = [
		{ title: 'Merchants', href: '/admin/merchants' },
	];
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Merchants" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card className="gap-2">
					<CardHeader>
						<CardTitle>Merchants Management</CardTitle>
						<p className="text-sm text-muted-foreground">
							Manage sales channels and stores.
						</p>
					</CardHeader>
					<hr />
					<CardContent>
						<div className="pb-4">
							<Table>
								<TableHeader>
									<TableRow className="border-none hover:bg-transparent">
										<TableHead>Search</TableHead>
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
												placeholder="Search merchants..."
											/>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
						<Table>
							<TableHeader className="bg-slate-500 dark:bg-slate-700">
								<TableRow>
									<TableHead className="font-bold text-white">
										Name
									</TableHead>
									<TableHead className="font-bold text-white">
										Platform
									</TableHead>
									<TableHead className="font-bold text-white">
										Shop URL
									</TableHead>
									<TableHead className="font-bold text-white">
										Status
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{merchants.data.map((merchant) => (
									<TableRow
										key={merchant.id}
										className="odd:bg-slate-50 dark:odd:bg-slate-900/40"
									>
										<TableCell className="font-medium">
											{merchant.name}
										</TableCell>
										<TableCell>
											{merchant.platform}
										</TableCell>
										<TableCell className="max-w-xs truncate">
											{merchant.shop_url ?? '—'}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													merchant.status === 'active'
														? 'green'
														: 'gray'
												}
											>
												{merchant.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						{!merchants.data.length && (
							<div className="py-8 text-center text-muted-foreground">
								No results found.
							</div>
						)}
					</CardContent>
					{merchants.data.length > 0 && (
						<TablePagination {...merchants} />
					)}
				</Card>
			</div>
		</AppLayout>
	);
}
