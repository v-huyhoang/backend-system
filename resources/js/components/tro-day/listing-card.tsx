import { BadgeCheck, Heart, MapPin, Phone } from 'lucide-react';

export interface ListingPreview {
	id: number;
	title: string;
	price: string;
	type: string;
	location: string;
	area: string;
	occupants: string;
	highlight: string;
	publishedLabel: string;
	image: string;
	verified: boolean;
}

export function ListingCard({ listing }: { listing: ListingPreview }) {
	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--gtg-border)] bg-white transition-colors hover:border-[var(--gtg-border-strong)]">
			<div className="relative aspect-[4/3] overflow-hidden bg-[var(--gtg-surface-low)]">
				<img
					src={listing.image}
					alt={listing.title}
					className="h-full w-full object-cover"
					loading="lazy"
					width="640"
					height="480"
				/>
				{listing.verified && (
					<span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[var(--gtg-primary)] shadow-sm">
						<BadgeCheck className="size-4" aria-hidden="true" />
						Chủ trọ đã xác minh
					</span>
				)}
				<button
					type="button"
					disabled
					className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-white/95 text-[var(--gtg-muted)] opacity-60 shadow-sm"
					aria-label={`Lưu tin ${listing.title}`}
					title="Tính năng lưu tin đang được hoàn thiện"
				>
					<Heart className="size-5" aria-hidden="true" />
				</button>
				<span className="absolute right-3 bottom-3 rounded-md bg-[var(--gtg-text)]/80 px-2 py-1 text-xs font-medium text-white">
					{listing.publishedLabel}
				</span>
			</div>

			<div className="flex flex-1 flex-col p-5">
				<div className="flex items-start justify-between gap-3">
					<p className="text-xl font-bold tracking-[-0.02em] text-[var(--gtg-price)] tabular-nums">
						{listing.price}
						<span className="ml-0.5 text-sm font-normal text-[var(--gtg-muted)]">
							đ/tháng
						</span>
					</p>
					<span className="shrink-0 rounded-md bg-[var(--gtg-surface-low)] px-2 py-1 text-xs font-medium text-[var(--gtg-text)]">
						{listing.type}
					</span>
				</div>
				<h3 className="mt-2 line-clamp-2 text-[17px] leading-6 font-semibold text-[var(--gtg-text)] group-hover:text-[var(--gtg-primary)]">
					{listing.title}
				</h3>
				<p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--gtg-muted)]">
					<MapPin
						className="size-4 shrink-0 text-[var(--gtg-secondary)]"
						aria-hidden="true"
					/>
					<span className="truncate">{listing.location}</span>
				</p>

				<dl className="mt-4 grid grid-cols-3 gap-1 border-y border-[var(--gtg-border)] py-3 text-center">
					<Metric label="Diện tích" value={listing.area} />
					<Metric label="Số người" value={listing.occupants} />
					<Metric label="Điểm chính" value={listing.highlight} />
				</dl>

				<div className="mt-4 flex items-center gap-2">
					<a
						href="#phong-moi"
						className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[var(--gtg-surface-low)] px-4 text-sm font-semibold text-[var(--gtg-primary)] hover:bg-[var(--gtg-surface-high)]"
					>
						Xem chi tiết
					</a>
					<button
						type="button"
						disabled
						className="grid size-11 place-items-center rounded-xl bg-[var(--gtg-primary)] text-white opacity-50"
						aria-label={`Gọi hỏi phòng ${listing.title}`}
						title="Thông tin liên hệ sẽ có ở trang chi tiết"
					>
						<Phone className="size-4" aria-hidden="true" />
					</button>
				</div>
			</div>
		</article>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="min-w-0 px-1">
			<dt className="truncate text-[11px] text-[var(--gtg-muted)]">
				{label}
			</dt>
			<dd className="mt-0.5 truncate text-xs font-semibold text-[var(--gtg-text)]">
				{value}
			</dd>
		</div>
	);
}
