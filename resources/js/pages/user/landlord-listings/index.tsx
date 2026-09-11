import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import type { LandlordListingStatus } from '@/types/landlord-listings';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ListingRow } from './components/listing-row';
import { StatCard } from './components/stat-card';
import { landlordListings, landlordListingStats } from './data';

const tabs: Array<{ label: string; value: 'all' | LandlordListingStatus }> = [
	{ label: 'Tất cả', value: 'all' },
	{ label: 'Đang hiển thị', value: 'published' },
	{ label: 'Chờ duyệt', value: 'pending_review' },
	{ label: 'Cần bổ sung', value: 'rejected' },
	{ label: 'Đã cho thuê', value: 'rented' },
	{ label: 'Bản nháp', value: 'draft' },
];

export default function LandlordListingsIndex() {
	const [activeTab, setActiveTab] =
		useState<(typeof tabs)[number]['value']>('all');
	const listings = useMemo(
		() =>
			activeTab === 'all'
				? landlordListings
				: landlordListings.filter(
						(listing) => listing.status === activeTab,
					),
		[activeTab],
	);
	return (
		<div className="gtg-theme flex min-h-screen flex-col bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Tin phòng của tôi | Trọ Đây" />
			<PublicHeader />
			<main id="main-content" className="flex-1 pt-16">
				<div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 lg:py-10">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{landlordListingStats.map((stat) => (
							<StatCard key={stat.label} stat={stat} />
						))}
					</div>
					<div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
								Khu vực quản lý chủ trọ
							</p>
							<h1 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
								Tin phòng của tôi
							</h1>
							<p className="mt-2 text-[var(--gtg-muted)]">
								Theo dõi tình trạng duyệt tin và quản lý thông
								tin phòng cho thuê.
							</p>
						</div>
						<Link
							href="/chu-tro/tin-dang/tao-moi"
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-5 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
						>
							<Plus className="size-5" aria-hidden="true" />
							Đăng phòng mới
						</Link>
					</div>
					<nav
						className="mt-6 flex gap-2 overflow-x-auto rounded-xl border border-[var(--gtg-border)] bg-white p-1.5"
						aria-label="Lọc trạng thái tin đăng"
					>
						{tabs.map((tab) => {
							const count =
								tab.value === 'all'
									? landlordListings.length
									: landlordListings.filter(
											(listing) =>
												listing.status === tab.value,
										).length;
							const active = activeTab === tab.value;
							return (
								<button
									key={tab.value}
									type="button"
									onClick={() => setActiveTab(tab.value)}
									className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${active ? 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]' : 'text-[var(--gtg-muted)] hover:bg-[var(--gtg-surface-low)]'}`}
								>
									{tab.label}
									<span className="rounded-full bg-white px-1.5 py-0.5 text-xs tabular-nums">
										{count}
									</span>
								</button>
							);
						})}
					</nav>
					<section className="mt-6 space-y-4" aria-live="polite">
						{listings.length ? (
							listings.map((listing) => (
								<ListingRow
									key={listing.publicId}
									listing={listing}
								/>
							))
						) : (
							<div className="rounded-xl border border-dashed border-[var(--gtg-border-strong)] bg-white p-10 text-center text-[var(--gtg-muted)]">
								Chưa có tin ở trạng thái này.
							</div>
						)}
					</section>
				</div>
			</main>
			<PublicFooter />
		</div>
	);
}
