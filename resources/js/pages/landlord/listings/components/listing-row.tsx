import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	duplicate as duplicateListing,
	edit as editListing,
	hide as hideListing,
	rented as markListingRented,
	renew as renewListing,
	submit as submitListing,
} from '@/routes/landlord/listings';
import type { LandlordListing } from '@/types/landlord-listings';
import { Link, router } from '@inertiajs/react';
import {
	Copy,
	Edit3,
	Eye,
	EyeOff,
	ImageOff,
	MapPin,
	RefreshCw,
	Send,
} from 'lucide-react';
import { useState } from 'react';

const statusClasses = {
	published: 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]',
	pending_review: 'bg-amber-50 text-amber-800',
	rejected: 'bg-red-50 text-red-700',
	draft: 'bg-[var(--gtg-surface-low)] text-[var(--gtg-muted)]',
	hidden: 'bg-[var(--gtg-surface-low)] text-[var(--gtg-muted)]',
	rented: 'bg-[var(--gtg-surface-low)] text-[var(--gtg-muted)]',
	expired: 'bg-[var(--gtg-surface-low)] text-[var(--gtg-muted)]',
} as const;

function formatCurrency(value: number | string): string {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(Number(value));
}

function formatArea(value: number | string): string {
	return `${Number(value)} m²`;
}

function formatExpiry(expiresAt: string | null): string | null {
	if (!expiresAt) {
		return null;
	}

	return `Hết hạn: ${new Intl.DateTimeFormat('vi-VN').format(new Date(expiresAt))}`;
}

export function ListingRow({ listing }: { listing: LandlordListing }) {
	const expiresLabel = formatExpiry(listing.expires_at);
	const [selectedImage, setSelectedImage] = useState(0);
	const runLifecycleAction = (label: string, url: string) => {
		if (confirm(`Bạn có chắc muốn ${label.toLowerCase()}?`)) {
			router.post(url, {}, { preserveScroll: true });
		}
	};

	return (
		<article className="rounded-xl border border-[var(--gtg-border)] bg-white p-4 shadow-sm">
			<div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex min-w-0 flex-col gap-4 sm:flex-row">
					<div className="group relative grid h-32 w-full shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--gtg-surface-low)] sm:w-44">
						{listing.primary_image ? (
							<Dialog>
								<DialogTrigger asChild>
									<button
										type="button"
										onClick={() => setSelectedImage(0)}
										className="h-full w-full"
										aria-label={`Xem toàn bộ ảnh của ${listing.title}`}
									>
										<img
											src={listing.primary_image.path}
											alt={
												listing.primary_image
													.alt_text ?? listing.title
											}
											className="h-full w-full object-cover"
										/>
										<span className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
											Xem toàn bộ ảnh
										</span>
									</button>
								</DialogTrigger>
								<DialogContent className="max-w-4xl">
									<DialogHeader>
										<DialogTitle>
											{listing.title}
										</DialogTitle>
									</DialogHeader>
									<img
										src={
											listing.images[selectedImage]
												?.path ??
											listing.primary_image.path
										}
										alt={
											listing.images[selectedImage]
												?.alt_text ?? listing.title
										}
										className="max-h-[70vh] w-full rounded-lg object-contain"
									/>
									<div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
										{listing.images.map((image, index) => (
											<button
												type="button"
												key={image.path}
												onClick={() =>
													setSelectedImage(index)
												}
												className={`aspect-[4/3] overflow-hidden rounded border ${selectedImage === index ? 'border-[var(--gtg-primary)] ring-2 ring-[var(--gtg-primary-soft)]' : 'border-transparent'}`}
												aria-label={`Xem ảnh ${index + 1}`}
											>
												<img
													src={image.path}
													alt=""
													className="h-full w-full object-cover"
												/>
											</button>
										))}
									</div>
								</DialogContent>
							</Dialog>
						) : (
							<ImageOff
								className="size-7 text-[var(--gtg-muted)]"
								aria-label="Tin đăng chưa có ảnh"
							/>
						)}
					</div>
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<span
								className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[listing.status]}`}
							>
								{listing.status_label}
							</span>
							{expiresLabel && (
								<span className="text-xs text-[var(--gtg-muted)]">
									{expiresLabel}
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
							{formatArea(listing.area_sqm)}
						</p>
					</div>
				</div>
				<div className="shrink-0 lg:text-right">
					<p className="text-xl font-bold text-[var(--gtg-primary)] tabular-nums">
						{formatCurrency(listing.monthly_rent)}
						<span className="ml-1 text-sm font-normal text-[var(--gtg-muted)]">
							/tháng
						</span>
					</p>
					<div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
						<Link
							href={editListing(listing.public_id)}
							className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
						>
							<Edit3 className="size-4" aria-hidden="true" />
							Chỉnh sửa
						</Link>
						<button
							type="button"
							className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
						>
							<Eye className="size-4" aria-hidden="true" />
							Xem tin
						</button>
						{listing.status === 'draft' && (
							<button
								type="button"
								onClick={() =>
									runLifecycleAction(
										'Gửi duyệt tin đăng',
										submitListing(listing.public_id).url,
									)
								}
								className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--gtg-primary)] px-3 text-sm font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
							>
								<Send className="size-4" aria-hidden="true" />
								Gửi duyệt
							</button>
						)}
						{listing.status === 'published' && (
							<>
								<button
									type="button"
									onClick={() =>
										runLifecycleAction(
											'ẩn tin đăng',
											hideListing(listing.public_id).url,
										)
									}
									className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
								>
									<EyeOff
										className="size-4"
										aria-hidden="true"
									/>
									Ẩn tin
								</button>
								<button
									type="button"
									onClick={() =>
										runLifecycleAction(
											'đánh dấu đã cho thuê',
											markListingRented(listing.public_id)
												.url,
										)
									}
									className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
								>
									Đã cho thuê
								</button>
							</>
						)}
						{listing.status === 'expired' && (
							<button
								type="button"
								onClick={() =>
									runLifecycleAction(
										'gia hạn tin đăng',
										renewListing(listing.public_id).url,
									)
								}
								className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
							>
								<RefreshCw
									className="size-4"
									aria-hidden="true"
								/>
								Gia hạn
							</button>
						)}
						<button
							type="button"
							onClick={() =>
								runLifecycleAction(
									'nhân bản tin đăng',
									duplicateListing(listing.public_id).url,
								)
							}
							className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--gtg-border)] px-3 text-sm font-semibold hover:bg-[var(--gtg-surface-low)]"
						>
							<Copy className="size-4" aria-hidden="true" />
							Nhân bản
						</button>
					</div>
				</div>
			</div>
			{listing.rejection_reason && (
				<div className="mt-4 border-t border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
					<strong>Lý do cần bổ sung: </strong>
					{listing.rejection_reason}
				</div>
			)}
		</article>
	);
}
