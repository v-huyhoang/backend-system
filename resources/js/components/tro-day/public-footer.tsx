import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BrandLogo } from './brand-logo';

const renterLinks = [
	{ label: 'Tìm phòng mới đăng', href: '/phong-tro' },
	{ label: 'Khám phá loại hình', href: '/#loai-hinh' },
] as const;

export function PublicFooter() {
	const { auth } = usePage<SharedData>().props;
	const publishingLinks = [
		{
			label: 'Đăng phòng',
			href: auth.user ? '/landlord/listings/create' : '/register',
		},
		...(auth.user?.hasListings
			? [
					{
						label: 'Quản lý tin đăng',
						href: '/landlord/listings',
					},
				]
			: []),
	];
	return (
		<footer className="border-t border-[var(--gtg-border)] bg-[var(--gtg-surface-low)]">
			<div className="mx-auto max-w-[1200px] px-4 py-12 md:px-6">
				<div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
					<div className="max-w-md">
						<BrandLogo />
						<p className="mt-4 text-sm leading-6 text-[var(--gtg-muted)]">
							Nền tảng tìm và đăng phòng trọ dài hạn với thông tin
							rõ ràng về giá, khu vực và chi phí.
						</p>
					</div>
					<FooterLinks title="Người thuê trọ" links={renterLinks} />
					<FooterLinks
						title="Đăng tin cho thuê"
						links={publishingLinks}
					/>
				</div>
				<div className="mt-10 flex flex-col gap-2 border-t border-[var(--gtg-border)] pt-6 text-sm text-[var(--gtg-muted)] sm:flex-row sm:items-center sm:justify-between">
					<p>© {new Date().getFullYear()} Trọ Đây.</p>
					<p>Phòng phù hợp, ở ngay đây.</p>
				</div>
			</div>
		</footer>
	);
}

function FooterLinks({
	title,
	links,
}: {
	title: string;
	links: ReadonlyArray<{ label: string; href: string }>;
}) {
	return (
		<nav aria-label={title}>
			<h2 className="font-semibold text-[var(--gtg-text)]">{title}</h2>
			<ul className="mt-4 space-y-3">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className="text-sm text-[var(--gtg-muted)] hover:text-[var(--gtg-primary)] hover:underline"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
