import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SystemPermission } from '@/enums/access-control';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BoxIcon, Key, LayoutGrid, LockKeyholeIcon, LucideBoxes, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
	{
		title: 'Dashboard',
		href: dashboard(),
		icon: LayoutGrid,
		permission: SystemPermission.ViewDashboard,
	},
	{
		title: 'Permissions',
		href: '/admin/permissions',
		icon: Key,
		permission: SystemPermission.ViewPermissions,
	},
	{
		title: 'Roles',
		href: '/admin/roles',
		icon: LockKeyholeIcon,
		permission: SystemPermission.ViewRoles,
	},
	{
		title: 'Users',
		href: '/admin/users',
		icon: User,
		permission: SystemPermission.ViewUsers,
	},
	{
		title: 'Categories',
		href: '/admin/categories',
		icon: BoxIcon,
		permission: SystemPermission.ViewCategories,
	},
	{
		title: 'Products',
		href: '/admin/products',
		icon: LucideBoxes,
		permission: SystemPermission.ViewProducts,
	},
];

const footerNavItems: NavItem[] = [
	// {
	//     title: 'Repository',
	//     href: 'https://github.com/laravel/react-starter-kit',
	//     icon: Folder,
	// },
	// {
	//     title: 'Documentation',
	//     href: 'https://laravel.com/docs/starter-kits#react',
	//     icon: BookOpen,
	// },
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href={dashboard()} prefetch>
								<AppLogo />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={mainNavItems} />
			</SidebarContent>

			<SidebarFooter>
				<NavFooter items={footerNavItems} className="mt-auto" />
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
