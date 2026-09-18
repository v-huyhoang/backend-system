import { mergeListingUrl } from '@/lib/listing-url';
import {
	getPropertyTypes,
	type PropertyType,
} from '@/services/rental-master-data-service';
import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Plus, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrandLogo } from './brand-logo';
import { HeaderLocationSearch } from './header-location-search';
import { PublicAccountMenu } from './public-account-menu';

const navigation = [
	{ label: 'Tìm phòng', href: '/phong-tro' },
	{ label: 'Loại hình', href: '/#loai-hinh' },
] as const;

export function PublicHeader() {
	const page = usePage<SharedData>();
	const { auth } = page.props;
	const createListingHref = auth.user
		? '/landlord/listings/create'
		: '/register';
	const [menuOpen, setMenuOpen] = useState(false);
	const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
	const currentType = new URL(page.url, 'http://localhost').searchParams.get(
		'loai-hinh',
	);
	const typeUrl = (slug: string | null) =>
		mergeListingUrl(page.url, { 'loai-hinh': slug });
	useEffect(() => {
		const controller = new AbortController();
		getPropertyTypes(controller.signal)
			.then((response) => setPropertyTypes(response.data))
			.catch(() => setPropertyTypes([]));
		return () => controller.abort();
	}, []);
	const isActiveNavigation = (href: string) =>
		href === '/phong-tro' && page.url.startsWith('/phong-tro');

	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--gtg-border)] bg-white/95 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 md:px-6">
				<div className="flex min-w-0 flex-1 items-center gap-3 xl:gap-6">
					<BrandLogo />
					<HeaderLocationSearch className="hidden min-w-0 flex-1 md:block" />
					<nav
						className="hidden shrink-0 items-center gap-1 xl:flex"
						aria-label="Điều hướng chính"
					>
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								aria-current={
									isActiveNavigation(item.href)
										? 'page'
										: undefined
								}
								className={`inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] font-semibold transition-colors ${
									isActiveNavigation(item.href)
										? 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary)]'
										: 'text-[var(--gtg-muted)] hover:bg-[var(--gtg-surface-low)] hover:text-[var(--gtg-text)]'
								}`}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex shrink-0 items-center gap-2">
					<Link
						href={createListingHref}
						className="hidden min-h-11 items-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-4 text-[15px] font-semibold whitespace-nowrap text-white shadow-sm hover:bg-[var(--gtg-primary-dark)] lg:inline-flex"
					>
						<Plus className="size-4" aria-hidden="true" />
						Đăng phòng
					</Link>

					{auth.user ? (
						<PublicAccountMenu user={auth.user} />
					) : (
						<Link
							href="/login"
							className="hidden min-h-11 items-center px-3 text-[15px] font-semibold whitespace-nowrap text-[var(--gtg-primary)] hover:underline lg:inline-flex"
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
			<nav
				className="hidden border-t border-[var(--gtg-border)] lg:block"
				aria-label="Loại hình phòng"
			>
				<div className="mx-auto flex h-10 max-w-[1200px] items-center gap-6 px-6">
					<Link
						href={typeUrl(null)}
						aria-current={!currentType ? 'page' : undefined}
						className={`shrink-0 text-sm font-semibold ${!currentType ? 'text-[var(--gtg-primary)]' : 'text-[var(--gtg-text)] hover:text-[var(--gtg-primary)]'}`}
					>
						Tất cả phòng
					</Link>
					{propertyTypes.map((propertyType) => (
						<Link
							key={propertyType.slug}
							href={typeUrl(propertyType.slug)}
							aria-current={
								currentType === propertyType.slug
									? 'page'
									: undefined
							}
							className={`shrink-0 text-sm ${currentType === propertyType.slug ? 'font-semibold text-[var(--gtg-primary)]' : 'text-[var(--gtg-text)] hover:text-[var(--gtg-primary)]'}`}
						>
							{propertyType.name}
						</Link>
					))}
				</div>
			</nav>

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
							aria-current={
								isActiveNavigation(item.href)
									? 'page'
									: undefined
							}
							className={`flex min-h-11 items-center rounded-lg px-3 font-semibold transition-colors ${
								isActiveNavigation(item.href)
									? 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary)]'
									: 'text-[var(--gtg-text)] hover:bg-[var(--gtg-surface-low)]'
							}`}
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
							href={
								auth.user
									? auth.user.hasListings
										? '/landlord/listings'
										: '/settings/profile'
									: '/login'
							}
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-surface-low)] px-3 font-semibold text-[var(--gtg-primary)]"
						>
							<UserRound className="size-4" aria-hidden="true" />
							{auth.user?.hasListings
								? 'Tin đăng của tôi'
								: auth.user
									? 'Tài khoản'
									: 'Đăng nhập'}
						</Link>
					</div>
				</nav>
			)}
		</header>
	);
}
