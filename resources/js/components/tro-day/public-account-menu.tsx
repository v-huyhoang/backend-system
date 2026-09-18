import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
	FileText,
	LayoutDashboard,
	LogOut,
	Plus,
	Settings,
} from 'lucide-react';

interface PublicAccountMenuProps {
	user: User;
}

export function PublicAccountMenu({ user }: PublicAccountMenuProps) {
	const getInitials = useInitials();

	const handleLogout = () => {
		router.flushAll();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--gtg-secondary)]"
					aria-label={`Mở menu tài khoản của ${user.name}`}
				>
					<Avatar className="size-9 ring-2 ring-[var(--gtg-primary-soft)]">
						<AvatarImage src={user.avatar} alt="" />
						<AvatarFallback className="bg-[var(--gtg-primary-soft)] text-sm font-semibold text-[var(--gtg-primary)]">
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-60 rounded-xl border-[var(--gtg-border)] p-1.5"
			>
				<DropdownMenuLabel className="px-2.5 py-2 font-normal">
					<p className="truncate text-sm font-semibold text-[var(--gtg-text)]">
						{user.name}
					</p>
					<p className="truncate text-xs text-[var(--gtg-muted)]">
						{user.email}
					</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href={edit()} className="w-full cursor-pointer">
							<Settings aria-hidden="true" />
							Tài khoản
						</Link>
					</DropdownMenuItem>
					{user.hasListings && (
						<DropdownMenuItem asChild>
							<Link
								href="/landlord/listings"
								className="w-full cursor-pointer"
							>
								<FileText aria-hidden="true" />
								Tin đăng của tôi
							</Link>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem asChild>
						<Link
							href="/landlord/listings/create"
							className="w-full cursor-pointer"
						>
							<Plus aria-hidden="true" />
							Đăng phòng
						</Link>
					</DropdownMenuItem>
					{user.canAccessAdmin && (
						<DropdownMenuItem asChild>
							<Link
								href="/admin/dashboard"
								className="w-full cursor-pointer"
							>
								<LayoutDashboard aria-hidden="true" />
								Quản trị
							</Link>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href={logout()}
						as="button"
						className="w-full cursor-pointer"
						onClick={handleLogout}
					>
						<LogOut aria-hidden="true" />
						Đăng xuất
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
