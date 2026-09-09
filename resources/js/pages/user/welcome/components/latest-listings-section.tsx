import { ListingCard } from '@/components/tro-day/listing-card';
import { latestListings } from '../data';

export function LatestListingsSection({ query }: { query: string }) {
	const filteredListings = query
		? latestListings.filter((listing) =>
				listing.location
					.toLocaleLowerCase('vi-VN')
					.includes(query.toLocaleLowerCase('vi-VN')),
			)
		: latestListings;
	const heading = query ? `Phòng tại ${query}` : 'Phòng mới đăng';
	return (
		<section
			className="bg-[var(--gtg-page-bg)]"
			aria-labelledby="phong-moi"
		>
			<div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 lg:py-20">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm font-bold tracking-wider text-[var(--gtg-secondary)] uppercase">
							Cập nhật gần đây
						</p>
						<h2
							id="phong-moi"
							className="gtg-anchor mt-2 text-3xl font-bold tracking-[-0.03em]"
						>
							{heading}
						</h2>
						<p className="mt-3 max-w-2xl text-[var(--gtg-muted)]">
							{query
								? 'Kết quả được lọc theo khu vực bạn vừa chọn.'
								: 'Một vài lựa chọn để bạn hình dung cách thông tin phòng sẽ được trình bày.'}
						</p>
					</div>
				</div>
				{filteredListings.length > 0 ? (
					<div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
						{filteredListings.map((listing) => (
							<ListingCard key={listing.id} listing={listing} />
						))}
					</div>
				) : (
					<p className="mt-8 border border-dashed border-[var(--gtg-border-strong)] bg-white p-6 text-[var(--gtg-muted)]">
						Chưa có phòng mẫu tại {query}. Hãy thử TP. Hồ Chí Minh
						hoặc Hà Nội.
					</p>
				)}
			</div>
		</section>
	);
}
