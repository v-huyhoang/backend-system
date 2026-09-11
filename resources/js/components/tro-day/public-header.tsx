import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Plus, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from './brand-logo';

const navigation = [
	{ label: 'Tìm phòng', href: '/phong-tro' },
	{ label: 'Loại hình', href: '/#loai-hinh' },
	{ label: 'Dành cho chủ trọ', href: '/#chu-tro' },
] as const;

export function PublicHeader() {
	const { auth } = usePage<SharedData>().props;
	const createListingHref = auth.user
		? '/chu-tro/tin-dang/tao-moi'
		: '/register';
	const [menuOpen, setMenuOpen] = useState(false);
	const getInitials = useInitials();

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--gtg-border)] bg-white/95 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
				<div className="flex min-w-0 items-center gap-6">
					<BrandLogo />
					<nav
						className="hidden items-center gap-1 md:flex"
						aria-label="Điều hướng chính"
					>
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold text-[var(--gtg-muted)] hover:bg-[var(--gtg-surface-low)] hover:text-[var(--gtg-text)]"
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex items-center gap-2">
					<Link
						href={createListingHref}
						className="hidden min-h-11 items-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-4 text-[15px] font-semibold text-white shadow-sm hover:bg-[var(--gtg-primary-dark)] sm:inline-flex"
					>
						<Plus className="size-4" aria-hidden="true" />
						Đăng phòng
					</Link>

					{auth.user ? (
						<Link
							href="/chu-tro/tin-dang"
							className="rounded-full focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--gtg-secondary)]"
							aria-label={`Mở tài khoản của ${auth.user.name}`}
						>
							<Avatar className="size-9 ring-2 ring-[var(--gtg-primary-soft)]">
								<AvatarImage src={auth.user.avatar} alt="" />
								<AvatarFallback className="bg-[var(--gtg-primary-soft)] text-sm font-semibold text-[var(--gtg-primary)]">
									{getInitials(auth.user.name)}
								</AvatarFallback>
							</Avatar>
						</Link>
					) : (
						<Link
							href="/login"
							className="hidden min-h-11 items-center px-3 text-[15px] font-semibold text-[var(--gtg-primary)] hover:underline sm:inline-flex"
						>
							Đăng nhập
						</Link>
					)}

					<button
						type="button"
						className="grid size-11 place-items-center rounded-xl text-[var(--gtg-primary)] hover:bg-[var(--gtg-surface-low)] md:hidden"
						onClick={() => setMenuOpen((open) => !open)}
						aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
						aria-expanded={menuOpen}
						aria-controls="public-mobile-menu"
					>
						{menuOpen ? (
							<X aria-hidden="true" />
						) : (
							<Menu aria-hidden="true" />
						)}
					</button>
				</div>
			</div>

			{menuOpen && (
				<nav
					id="public-mobile-menu"
					className="border-t border-[var(--gtg-border)] bg-white px-4 py-3 md:hidden"
					aria-label="Điều hướng di động"
				>
					{navigation.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMenuOpen(false)}
							className="flex min-h-11 items-center rounded-lg px-3 font-semibold text-[var(--gtg-text)] hover:bg-[var(--gtg-surface-low)]"
						>
							{item.label}
						</Link>
					))}
					<div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--gtg-border)] pt-3">
						<Link
							href={createListingHref}
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-3 font-semibold text-white"
						>
							<Plus className="size-4" aria-hidden="true" />
							Đăng phòng
						</Link>
						<Link
							href={auth.user ? '/admin/dashboard' : '/login'}
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-surface-low)] px-3 font-semibold text-[var(--gtg-primary)]"
						>
							<UserRound className="size-4" aria-hidden="true" />
							{auth.user ? 'Tài khoản' : 'Đăng nhập'}
						</Link>
					</div>
				</nav>
			)}
		</header>
	);
}
