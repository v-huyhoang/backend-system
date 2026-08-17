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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
import { Role } from '@/types/role_permissions';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const visiblePermissionGroupCount = 3;

function permissionGroupLabel(permissionName: string) {
	const [, ...resourceParts] = permissionName.split('_');
	const resource = resourceParts.length
		? resourceParts.join(' ')
		: permissionName.replaceAll('_', ' ');

	return resource.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function PermissionDialogContent({
	role,
}: {
	role: Role['data'][number];
}) {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Permissions</DialogTitle>
				<DialogDescription>
					{role.permissions.length} permissions assigned to this role.
				</DialogDescription>
			</DialogHeader>
			<div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
				{role.permissions.map((permission) => (
					<div
						key={permission.id}
						className="min-w-0 rounded-md border px-3 py-2"
					>
						<p
							className="truncate text-sm font-medium"
							title={permission.name}
						>
							{permission.name}
						</p>
						{permission.description && (
							<p className="mt-1 text-xs break-words text-muted-foreground">
								{permission.description}
							</p>
						)}
					</div>
				))}
			</div>
		</DialogContent>
	);
}

function RolePermissions({ role }: { role: Role['data'][number] }) {
	if (role.permissions.length === 0) {
		return <span className="text-muted-foreground">—</span>;
	}

	const permissionGroups = Object.entries(
		role.permissions.reduce<Record<string, number>>((groups, permission) => {
			const label = permissionGroupLabel(permission.name);
			groups[label] = (groups[label] ?? 0) + 1;
			return groups;
		}, {}),
	);
	const visibleGroups = permissionGroups.slice(0, visiblePermissionGroupCount);
	const hiddenGroupCount = permissionGroups.length - visibleGroups.length;

	return (
		<div className="flex min-w-0 flex-wrap items-center gap-1.5">
			{visibleGroups.map(([label, count]) => (
				<Badge
					key={label}
					variant="outline"
					className="max-w-36 truncate"
					title={`${label}: ${count} permissions`}
				>
					{label} ({count})
				</Badge>
			))}

			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="h-6 shrink-0 px-2 text-xs"
					>
						{hiddenGroupCount > 0
							? `+${hiddenGroupCount} groups`
							: 'View all'}
					</Button>
				</DialogTrigger>
				<PermissionDialogContent role={role} />
			</Dialog>
		</div>
	);
}

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Roles',
		href: '/admin/roles',
	},
];

function deleteRole(id: number) {
	if (confirm('Are you sure you want to delete this role?')) {
		router.delete(`/admin/roles/${id}`);
	}
}

export default function Roles({ roles }: { roles: Role }) {
	const { flash } = usePage<{ flash: { message?: string; error: string } }>()
		.props;

	const { can } = usePermissions();

	useEffect(() => {
		if (flash.message) {
			toast.success(flash.message);
		}
	}, [flash.message]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Roles" />
			<div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Roles Managements</CardTitle>
						<CardAction>
							{can(SystemPermission.CreateRoles) && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button asChild size="icon">
											<Link
												href="/admin/roles/create"
												aria-label="Add new role"
											>
												<Plus />
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Add new role</TooltipContent>
								</Tooltip>
							)}
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent className="px-2 sm:px-6">
						<Table className="min-w-[38rem] table-fixed">
							<TableHeader className="bg-slate-500 dark:bg-slate-700">
								<TableRow>
									<TableHead className="w-14 font-bold text-white">
										ID
									</TableHead>
									<TableHead className="w-32 font-bold text-white">
										Name
									</TableHead>
									<TableHead className="hidden w-1/4 font-bold text-white lg:table-cell">
										Description
									</TableHead>
									<TableHead className="font-bold text-white">
										Permissions
									</TableHead>
									<TableHead className="w-24 font-bold text-white">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{roles.data.map((role, index) => (
									<TableRow
										key={index + 1}
										className="odd:bg-slate-100 dark:odd:bg-slate-800"
									>
										<TableCell>{role.id}</TableCell>
										<TableCell className="truncate" title={role.name}>
											{role.name}
										</TableCell>
										<TableCell className="hidden lg:table-cell">
											<p className="truncate" title={role.description}>
												{role.description || '—'}
											</p>
										</TableCell>
										<TableCell className="whitespace-normal">
											<RolePermissions role={role} />
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{can(
													SystemPermission.EditRoles,
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
																	href={`/admin/roles/${role.id}/edit`}
																	aria-label={`Edit ${role.name}`}
																>
																	<Pencil />
																</Link>
															</Button>
														</TooltipTrigger>
														<TooltipContent>Edit role</TooltipContent>
													</Tooltip>
												)}
												{can(
													SystemPermission.DeleteRoles,
												) && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="destructive"
																size="icon"
																className="size-8"
																aria-label={`Delete ${role.name}`}
																onClick={() => deleteRole(role.id)}
															>
																<Trash2 />
															</Button>
														</TooltipTrigger>
														<TooltipContent>Delete role</TooltipContent>
													</Tooltip>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
					{roles.data.length > 0 ? (
						<TablePagination
							total={roles.total}
							from={roles.from}
							to={roles.to}
							links={roles.links}
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
