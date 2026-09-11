import type { LandlordListing } from '@/types/landlord-listings';
import { Edit3, Eye, MapPin, MoreHorizontal } from 'lucide-react';

const statusClasses = {
	published: 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]',
	pending_review: 'bg-amber-50 text-amber-800',
	rejected: 'bg-red-50 text-red-700',
	draft: 'bg-[var(--gtg-surface-low)] text-[var(--gtg-muted)]',
	rented: 'bg-[var(--gtg-surface-low)] text-[var(--gtg-muted)]',
} as const;
export function ListingRow({ listing }: { listing: LandlordListing }) {
	return (
		<article className="rounded-xl border border-[var(--gtg-border)] bg-white p-4 shadow-sm">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-col gap-4 sm:flex-row">
					<div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-[var(--gtg-surface-low)] sm:w-44">
						<img
							src={listing.image}
							alt=""
							className="h-full w-full object-cover"
						/>
						<span className="absolute top-2 left-2 rounded bg-[var(--gtg-text)]/85 px-2 py-1 text-xs font-semibold text-white">
							{listing.publicId}
						</span>
					</div>
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<span
								className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[listing.status]}`}
							>
								{listing.statusLabel}
							</span>
							{listing.expiresLabel && (
								<span className="text-xs text-[var(--gtg-muted)]">
									{listing.expiresLabel}
								</span>
							)}
						</div>
						<h2 className="mt-2 text-lg font-semibold text-[var(--gtg-text)]">
							{listing.title}
						</h2>
						<p className="mt-2 flex gap-1.5 text-sm text-[var(--gtg-muted)]">
							<MapPin
								className="mt-0.5 size-4 shrink-0 text-[var(--gtg-primary)]"
								aria-hidden="true"
							/>
							{listing.address}
						</p>
						<p className="mt-3 text-sm text-[var(--gtg-muted)]">
							{listing.area} · {listing.meta}
						</p>
					</div>
				</div>
				<div className="shrink-0 lg:text-right">
					<p className="text-xl font-bold text-[var(--gtg-primary)] tabular-nums">
						{listing.monthlyRent}
						<span className="ml-1 text-sm font-normal text-[var(--gtg-muted)]">
							/tháng
						</span>
					</p>
					<div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
						<button
							type="button"
							className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
						>
							<Edit3 className="size-4" aria-hidden="true" />
							Chỉnh sửa
						</button>
						<button
							type="button"
							className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
						>
							<Eye className="size-4" aria-hidden="true" />
							Xem tin
						</button>
						<button
							type="button"
							className="grid size-11 place-items-center rounded-lg border border-[var(--gtg-border)]"
							aria-label={`Thao tác khác với ${listing.title}`}
						>
							<MoreHorizontal
								className="size-5"
								aria-hidden="true"
							/>
						</button>
					</div>
				</div>
			</div>
			{listing.rejectionReason && (
				<div className="mt-4 border-t border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
					<strong>Lý do cần bổ sung: </strong>
					{listing.rejectionReason}
				</div>
			)}
		</article>
	);
}
