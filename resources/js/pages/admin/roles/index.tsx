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
import { SystemPermission } from '@/enums/access-control';
import { usePermissions } from '@/hooks/user-permissions';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Role } from '@/types/role_permissions';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const visiblePermissionCount = 5;

function RolePermissions({ role }: { role: Role['data'][number] }) {
	const visiblePermissions = role.permissions.slice(
		0,
		visiblePermissionCount,
	);
	const hiddenPermissionCount =
		role.permissions.length - visiblePermissions.length;

	if (role.permissions.length === 0) {
		return <span className="text-muted-foreground">—</span>;
	}

	return (
		<div className="flex max-w-72 items-center gap-1.5">
			{visiblePermissions.map((permission) => (
				<Badge
					key={permission.id}
					variant="outline"
					className="max-w-32 truncate"
					title={permission.name}
				>
					{permission.name}
				</Badge>
			))}

			{hiddenPermissionCount > 0 && (
				<Dialog>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 shrink-0 px-2 text-xs"
						>
							+{hiddenPermissionCount} more
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Permissions</DialogTitle>
							<DialogDescription>
								{role.permissions.length} permissions assigned
								to this role.
							</DialogDescription>
						</DialogHeader>
						<div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
							{role.permissions.map((permission) => (
								<div
									key={permission.id}
									className="rounded-md border px-3 py-2"
								>
									<p className="text-sm font-medium">
										{permission.name}
									</p>
									{permission.description && (
										<p className="mt-1 text-xs text-muted-foreground">
											{permission.description}
										</p>
									)}
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>
			)}
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
								<Link href={'/admin/roles/create'}>
									<Button variant={'default'}>Add New</Button>
								</Link>
							)}
						</CardAction>
					</CardHeader>
					<hr />
					<CardContent>
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
										Permissions
									</TableHead>
									<TableHead className="font-bold text-white">
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
										<TableCell>{role.name}</TableCell>
										<TableCell>
											{role.description}
										</TableCell>
										<TableCell>
											<RolePermissions role={role} />
										</TableCell>
										<TableCell className="whitespace-nowrap">
											{can(
												SystemPermission.EditRoles,
											) && (
												<Link
													href={`/admin/roles/${role.id}/edit`}
												>
													<Button
														variant={'outline'}
														size={'sm'}
													>
														Edit
													</Button>
												</Link>
											)}
											{can(
												SystemPermission.DeleteRoles,
											) && (
												<Button
													className="ms-2"
													variant={'destructive'}
													size={'sm'}
													onClick={() =>
														deleteRole(role.id)
													}
												>
													Delete
												</Button>
											)}
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
