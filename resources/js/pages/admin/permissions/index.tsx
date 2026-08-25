import InputError from '@/components/input-error';
import TablePagination from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { type BreadcrumbItem } from '@/types';
import type { PageProps } from '@/types/page';
import { Permission, SinglePermission } from '@/types/role_permissions';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Permissions',
		href: '/admin/permissions',
	},
];

export default function Permissions({
	permissions,
	filters,
}: {
	permissions: Permission;
	filters: PageProps['filters'];
}) {
	const [openAddNewPermissionDialog, setOpenAddNewPermissionDialog] =
		useState(false);
	const [openEditPermissionDialog, setOpenEditPermissionDialog] =
		useState(false);
	const [search, setSearch] = useState(filters.q ?? '');
	const [assignedFilter, setAssignedFilter] = useState(
		filters.assigned ?? 'all',
	);
	const isFirstRender = useRef(true);

	const { flash } = usePage<{ flash: { message?: string; error: string } }>()
		.props;

	const { can } = usePermissions();

	useEffect(() => {
		if (flash.message) {
			setOpenAddNewPermissionDialog(false);
			setOpenEditPermissionDialog(false);
			toast.success(flash.message);
		}
	}, [flash.message]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const timeout = setTimeout(() => {
			const query: { q?: string; assigned?: string } = {};
			const normalizedSearch = search.trim();

			if (normalizedSearch) query.q = normalizedSearch;
			if (assignedFilter !== 'all') query.assigned = assignedFilter;

			router.get('/admin/permissions', query, {
				preserveState: true,
				replace: true,
			});
		}, 400);

		return () => clearTimeout(timeout);
	}, [search, assignedFilter]);

	const {
		data,
		setData,
		post,
		put,
		delete: destroy,
		processing,
		errors,
		reset,
	} = useForm({
		id: '',
		name: '',
		description: '',
	});
	function submit(e: React.FormEvent) {
		e.preventDefault();
		post('/admin/permissions', {
			onSuccess: () => {
				reset('name');
				reset('description');
			},
		});
	}

	function edit(permission: SinglePermission) {
		setData({
			name: permission.name,
			description: permission.description,
		});
		setOpenEditPermissionDialog(true);
	}

	function update(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		put(`/admin/permissions/${data.id}`, {
			onSuccess: () => {
				reset('name');
				reset('description');
			},
		});
	}

	function deletePermission(id: number) {
		destroy(`/admin/permissions/${id}`);
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Permissions" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card className='gap-2'>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Permissions Managements</CardTitle>
						<CardAction>
							{can(SystemPermission.CreatePermissions) && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size="icon"
											aria-label="Add new permission"
											onClick={() =>
												setOpenAddNewPermissionDialog(
													true,
												)
											}
										>
											<Plus />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										Add new permission
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
										<TableHead>Assignment</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow className="border-none hover:bg-transparent">
										<TableCell>
											<Input
												value={search}
												onChange={(event) =>
													setSearch(
														event.target.value,
													)
												}
												placeholder="Search by name or description..."
												aria-label="Search permissions"
											/>
										</TableCell>
										<TableCell>
											<Select
												value={assignedFilter}
												onValueChange={
													setAssignedFilter
												}
											>
												<SelectTrigger aria-label="Filter permissions by assignment">
													<SelectValue placeholder="All assignments" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">
														All assignments
													</SelectItem>
													<SelectItem value="1">
														Assigned to a role
													</SelectItem>
													<SelectItem value="0">
														Not assigned
													</SelectItem>
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
										Description
									</TableHead>
									<TableHead className="font-bold text-white">
										Created at
									</TableHead>
									<TableHead className="font-bold text-white">
										Updated at
									</TableHead>
									<TableHead className="w-24 font-bold text-white">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{permissions.data.map((permission, index) => (
									<TableRow
										key={index + 1}
										className="odd:bg-slate-100 dark:odd:bg-slate-800"
									>
										<TableCell>{permission.id}</TableCell>
										<TableCell>{permission.name}</TableCell>
										<TableCell>
											{permission.description}
										</TableCell>
										<TableCell>
											{permission.created_at}
										</TableCell>
										<TableCell>
											{permission.updated_at}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{can(
													SystemPermission.EditPermissions,
												) && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="outline"
																size="icon"
																className="size-8"
																aria-label={`Edit ${permission.name}`}
																onClick={() =>
																	edit(
																		permission,
																	)
																}
															>
																<Pencil />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Edit permission
														</TooltipContent>
													</Tooltip>
												)}
												{can(
													SystemPermission.DeletePermissions,
												) && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="destructive"
																size="icon"
																className="size-8"
																aria-label={`Delete ${permission.name}`}
																onClick={() => {
																	deletePermission(
																		permission.id,
																	);
																}}
															>
																<Trash2 />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															Delete permission
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
					{permissions.data.length > 0 ? (
						<TablePagination
							total={permissions.total}
							from={permissions.from}
							to={permissions.to}
							links={permissions.links}
						/>
					) : (
						<div className="flex h-full items-center justify-center px-4 py-8 text-center text-muted-foreground">
							No permissions match the current search and filters.
						</div>
					)}
				</Card>
				{/* add new permission diaglog start */}
				<Dialog
					open={openAddNewPermissionDialog}
					onOpenChange={setOpenAddNewPermissionDialog}
				>
					<form
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Add New Permissions</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="name">
										Permission Name
									</Label>
									<Input
										id="name"
										name="name"
										placeholder="Permission Name"
										value={data.name}
										onChange={(e) =>
											setData('name', e.target.value)
										}
										aria-invalid={!!errors.name}
									/>
									<InputError message={errors.name} />
								</div>

								<div className="grid gap-3">
									<Label htmlFor="description">
										Description
									</Label>
									<Input
										id="description"
										name="description"
										placeholder="Description"
										value={data.description}
										onChange={(e) =>
											setData(
												'description',
												e.target.value,
											)
										}
										aria-invalid={!!errors.description}
									/>
									<InputError message={errors.description} />
								</div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button
									type="submit"
									onClick={submit}
									disabled={processing}
								>
									{processing && (
										<Loader2 className="animate-spin" />
									)}
									Submit
								</Button>
							</DialogFooter>
						</DialogContent>
					</form>
				</Dialog>
				{/* add new permission diaglog end */}

				<Dialog
					open={openEditPermissionDialog}
					onOpenChange={setOpenEditPermissionDialog}
				>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Permissions</DialogTitle>
						</DialogHeader>
						<hr />
						<form onSubmit={update}>
							<div className="grid gap-4">
								<div className="grid gap-3">
									<Label htmlFor="name">
										Permission Name
									</Label>
									<Input
										id="name"
										name="name"
										placeholder="Permission Name"
										value={data.name}
										onChange={(e) =>
											setData('name', e.target.value)
										}
										aria-invalid={!!errors.name}
									/>
									<InputError message={errors.name} />
								</div>

								<div className="grid gap-3">
									<Label htmlFor="description">
										Description
									</Label>
									<Input
										id="description"
										name="description"
										placeholder="Description"
										value={data.description}
										onChange={(e) =>
											setData(
												'description',
												e.target.value,
											)
										}
										aria-invalid={!!errors.description}
									/>
									<InputError message={errors.description} />
								</div>
							</div>
						</form>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button
								type="submit"
								onClick={submit}
								disabled={processing}
							>
								{processing && (
									<Loader2 className="animate-spin" />
								)}
								Submit
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AppLayout>
	);
}
