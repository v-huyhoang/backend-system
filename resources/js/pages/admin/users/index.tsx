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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { SystemPermission } from '@/enums/access-control';
import { ActiveStatus } from '@/enums/customer';
import { usePermissions } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import * as userRoutes from '@/routes/admin/users';
import { type BreadcrumbItem } from '@/types';
import type { PageProps } from '@/types/page';
import { RoleOption, User } from '@/types/user';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Users',
		href: userRoutes.index.url(),
	},
];

function deleteUser(id: number) {
	if (confirm('Are you sure you want to delete this user?')) {
		router.delete(userRoutes.destroy.url(id));
	}
}

interface UsersPageProps {
	users: User;
	roles: RoleOption[];
	filters: PageProps['filters'];
}

export default function Users({ users, roles, filters }: UsersPageProps) {
	const { flash } = usePage<{ flash: { message?: string; error: string } }>()
		.props;

	const { can } = usePermissions();

	const [search, setSearch] = useState(filters.q ?? '');
	const [roleFilter, setRoleFilter] = useState(filters.role_id ?? 'all');
	const [activeFilter, setActiveFilter] = useState(
		filters.is_active ?? 'all',
	);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (flash.message) {
			toast.success(flash.message);
		}
	}, [flash.message]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const timeout = setTimeout(() => {
			const query: {
				q?: string;
				role_id?: string;
				is_active?: string;
			} = {};
			const normalizedSearch = search.trim();

			if (normalizedSearch) {
				query.q = normalizedSearch;
			}

			if (activeFilter !== 'all') {
				query.is_active = activeFilter;
			}

			if (roleFilter !== 'all') {
				query.role_id = roleFilter;
			}

			router.get(userRoutes.index.url(), query, {
				preserveState: true,
				replace: true,
			});
		}, 400);

		return () => clearTimeout(timeout);
	}, [search, roleFilter, activeFilter]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Users" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Users Managements</CardTitle>
						<CardAction>
							{can(SystemPermission.CreateUsers) && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button asChild size="icon">
											<Link
												href={userRoutes.create()}
												aria-label="Add new user"
											>
												<Plus />
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										Add new user
									</TooltipContent>
								</Tooltip>
							)}
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent>
						<div className="pb-4">
							<Table>
								<TableHeader>
									<TableRow className="border-none hover:bg-transparent">
										<TableHead>Search</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow className="hover:bg-transparent">
										<TableCell>
											<Input
												placeholder="Filter by name or email..."
												id="search"
												value={search}
												onChange={(e) =>
													setSearch(e.target.value)
												}
											/>
										</TableCell>
										<TableCell>
											<Select
												value={roleFilter}
												onValueChange={setRoleFilter}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a role" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectItem value="all">
															All Roles
														</SelectItem>
														{roles.map((role) => (
															<SelectItem
																key={role.id}
																value={String(
																	role.id,
																)}
															>
																{role.name}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										</TableCell>
										<TableCell>
											<Select
												value={activeFilter}
												onValueChange={setActiveFilter}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select a status" />
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
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
						<Table>
							<TableHeader className="bg-slate-500 dark:bg-slate-700">
								<TableRow>
									<TableHead className="font-bold text-white">
										ID
									</TableHead>
									<TableHead className="font-bold text-white">
										Name
									</TableHead>
									<TableHead className="font-bold text-white">
										Email
									</TableHead>
									<TableHead className="font-bold text-white">
										Roles
									</TableHead>
									<TableHead className="font-bold text-white">
										Status
									</TableHead>
									<TableHead className="font-bold text-white">
										Created At
									</TableHead>
									<TableHead className="w-24 font-bold text-white">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.data.map((user, index) => (
									<TableRow
										key={index + 1}
										className="odd:bg-slate-100 dark:odd:bg-slate-800"
									>
										<TableCell>{user.id}</TableCell>
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell className="flex flex-wrap items-center gap-2">
											{user.roles.map((role, idx) => (
												<Badge
													key={idx}
													variant={'outline'}
													className="me-1"
												>
													{role}
												</Badge>
											))}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													user.is_active ===
													ActiveStatus.Active
														? 'default'
														: 'secondary'
												}
											>
												{user.is_active ===
												ActiveStatus.Active
													? 'Active'
													: 'Inactive'}
											</Badge>
										</TableCell>
										<TableCell>{user.created_at}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{can(
													SystemPermission.EditUsers,
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
																	href={userRoutes.edit(
																		user.id,
																	)}
																	aria-label={`Edit ${user.name}`}
																>
																	<Pencil />
																</Link>
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Edit user
														</TooltipContent>
													</Tooltip>
												)}
												{can(
													SystemPermission.DeleteUsers,
												) && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="destructive"
																size="icon"
																className="size-8"
																aria-label={`Delete ${user.name}`}
																onClick={() =>
																	deleteUser(
																		user.id,
																	)
																}
															>
																<Trash2 />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Delete user
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
					{users.data.length > 0 ? (
						<TablePagination
							total={users.total}
							from={users.from}
							to={users.to}
							links={users.links}
						/>
					) : (
						<div className="flex h-full items-center justify-center">
							No Results Found!
						</div>
					)}
				</Card>
			</div>
		</AppLayout>
	);
}
