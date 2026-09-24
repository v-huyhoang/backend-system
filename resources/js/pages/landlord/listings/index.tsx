import TablePagination from '@/components/table-pagination';
import LandlordLayout from '@/layouts/landlord-layout';
import { create, index } from '@/routes/landlord/listings';
import type {
	LandlordListingStatus,
	LandlordListingSummary,
	PaginatedLandlordListings,
} from '@/types/landlord-listings';
import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ListingRow } from './components/listing-row';
import { StatCard } from './components/stat-card';

const tabs: Array<{ label: string; value: 'all' | LandlordListingStatus }> = [
	{ label: 'Tất cả', value: 'all' },
	{ label: 'Đang hiển thị', value: 'published' },
	{ label: 'Chờ duyệt', value: 'pending_review' },
	{ label: 'Cần bổ sung', value: 'rejected' },
	{ label: 'Bản nháp', value: 'draft' },
	{ label: 'Đã ẩn', value: 'hidden' },
	{ label: 'Đã cho thuê', value: 'rented' },
	{ label: 'Đã hết hạn', value: 'expired' },
];

interface LandlordListingsPageProps {
	listings: PaginatedLandlordListings;
	summary: LandlordListingSummary;
	filters: { status?: LandlordListingStatus };
}

export default function LandlordListingsIndex({
	listings,
	summary,
	filters,
}: LandlordListingsPageProps) {
	const activeTab = filters.status ?? 'all';
	const stats = [
		{
			label: 'Tin hoạt động',
			value: String(summary.published),
			description: 'đang hiển thị',
			icon: 'home' as const,
		},
		{
			label: 'Lượt xem',
			value: String(summary.view_count),
			description: 'trên tất cả tin đăng',
			icon: 'chart' as const,
		},
		{
			label: 'Lượt liên hệ',
			value: String(summary.contact_count),
			description: 'khách đã chủ động liên hệ',
			icon: 'phone' as const,
		},
		{
			label: 'Cần xử lý',
			value: String(summary.rejected),
			description: 'tin cần bổ sung thông tin',
			icon: 'alert' as const,
		},
	];

	function filterByStatus(status: 'all' | LandlordListingStatus) {
		router.get(index.url(), status === 'all' ? {} : { status }, {
			preserveScroll: true,
			replace: true,
		});
	}

	return (
		<LandlordLayout>
			<Head title="Quản lý tin đăng | Trọ Đây" />
			<div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:py-10">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
							Khu vực chủ trọ
						</p>
						<h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--gtg-primary)] sm:text-4xl">
							Quản lý tin đăng
						</h1>
						<p className="mt-3 text-[var(--gtg-muted)]">
							Theo dõi tình trạng duyệt tin và quản lý thông tin
							phòng cho thuê.
						</p>
					</div>
					<Link
						href={create()}
						className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-5 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
					>
						<Plus className="size-5" aria-hidden="true" />
						Đăng phòng mới
					</Link>
				</div>

				<section
					className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
					aria-label="Tổng quan tin đăng"
				>
					{stats.map((stat) => (
						<StatCard key={stat.label} stat={stat} />
					))}
				</section>

				<nav
					className="mt-8 flex gap-2 overflow-x-auto rounded-xl border border-[var(--gtg-border)] bg-white p-1.5"
					aria-label="Lọc trạng thái tin đăng"
				>
					{tabs.map((tab) => {
						const count =
							tab.value === 'all'
								? Object.values(summary.status_counts).reduce(
										(total, value) => total + value,
										0,
									)
								: summary.status_counts[tab.value];
						const active = activeTab === tab.value;

						return (
							<button
								key={tab.value}
								type="button"
								onClick={() => filterByStatus(tab.value)}
								className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${active ? 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]' : 'text-[var(--gtg-muted)] hover:bg-[var(--gtg-surface-low)]'}`}
								aria-pressed={active}
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
					{listings.data.length ? (
						listings.data.map((listing) => (
							<ListingRow
								key={listing.public_id}
								listing={listing}
							/>
						))
					) : (
						<div className="rounded-xl border border-dashed border-[var(--gtg-border-strong)] bg-white p-10 text-center text-[var(--gtg-muted)]">
							Chưa có tin ở trạng thái này.
						</div>
					)}
				</section>

				{listings.total > 10 && (
					<div className="mt-6 overflow-hidden rounded-xl border border-[var(--gtg-border)]">
						<TablePagination {...listings} />
					</div>
				)}
			</div>
		</LandlordLayout>
	);
}
