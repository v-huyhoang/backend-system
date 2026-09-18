import { BrandLogo } from '@/components/tro-day/brand-logo';
import { PublicAccountMenu } from '@/components/tro-day/public-account-menu';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, LayoutDashboard, Plus } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const navigation = [
	{
		label: 'Tổng quan',
		href: '/landlord',
		icon: LayoutDashboard,
		isActive: (url: string) => url === '/landlord',
	},
	{
		label: 'Tin đăng',
		href: '/landlord/listings',
		icon: ClipboardList,
		isActive: (url: string) => url.startsWith('/landlord/listings'),
	},
] as const;

export default function LandlordLayout({ children }: PropsWithChildren) {
	const { auth } = usePage<SharedData>().props;
	const { url } = usePage();

	return (
		<div className="gtg-theme min-h-screen bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<a
				href="#main-content"
				className="sr-only z-50 rounded-md bg-[var(--gtg-primary)] px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
			>
				Bỏ qua điều hướng
			</a>
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--gtg-border)] bg-white lg:flex">
				<div className="flex h-20 items-center px-6">
					<BrandLogo />
				</div>
				<div className="border-y border-[var(--gtg-border)] px-4 py-5">
					<p className="px-3 text-xs font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
						Khu vực chủ trọ
					</p>
					<nav
						className="mt-3 space-y-1"
						aria-label="Điều hướng chủ trọ"
					>
						<NavigationItems url={url} />
					</nav>
				</div>
				<div className="mt-auto border-t border-[var(--gtg-border)] p-4">
					<Link
						href="/landlord/listings/create"
						className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-4 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
					>
						<Plus className="size-4" aria-hidden="true" />
						Đăng phòng mới
					</Link>
				</div>
			</aside>

			<div className="lg:pl-64">
				<header className="sticky top-0 z-20 border-b border-[var(--gtg-border)] bg-white/95 backdrop-blur-md">
					<div className="flex min-h-16 items-center justify-between gap-4 px-4 md:px-6">
						<div className="lg:hidden">
							<BrandLogo />
						</div>
						<p className="hidden text-sm font-semibold text-[var(--gtg-muted)] lg:block">
							Quản lý cho thuê
						</p>
						{auth.user && <PublicAccountMenu user={auth.user} />}
					</div>
					<nav
						className="flex gap-1 overflow-x-auto border-t border-[var(--gtg-border)] px-3 py-2 lg:hidden"
						aria-label="Điều hướng chủ trọ"
					>
						<NavigationItems url={url} compact />
						<Link
							href="/landlord/listings/create"
							className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[var(--gtg-primary)] px-3 text-sm font-semibold text-white"
						>
							<Plus className="size-4" aria-hidden="true" />
							Đăng tin
						</Link>
					</nav>
				</header>
				<main id="main-content">{children}</main>
			</div>
		</div>
	);
}

function NavigationItems({
	url,
	compact = false,
}: {
	url: string;
	compact?: boolean;
}) {
	return navigation.map(({ label, href, icon: Icon, isActive }) => {
		const active = isActive(url);

		return (
			<Link
				key={href}
				href={href}
				aria-current={active ? 'page' : undefined}
				className={`inline-flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${compact ? 'shrink-0' : 'w-full'} ${active ? 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]' : 'text-[var(--gtg-muted)] hover:bg-[var(--gtg-surface-low)] hover:text-[var(--gtg-text)]'}`}
			>
				<Icon className="size-4" aria-hidden="true" />
				{label}
			</Link>
		);
	});
}
