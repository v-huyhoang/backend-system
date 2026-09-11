import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import { Head, router } from '@inertiajs/react';
import { LatestListingsSection } from '../welcome/components/latest-listings-section';
import { QuickSearch } from '../welcome/components/quick-search';

interface ListingsIndexProps {
	filters: {
		location: string;
	};
}

export default function ListingsIndex({ filters }: ListingsIndexProps) {
	const title = filters.location
		? `Phòng trọ tại ${filters.location}`
		: 'Tìm phòng trọ';

	return (
		<div className="gtg-theme min-h-screen bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title={`${title} | Trọ Đây`}>
				<meta
					name="description"
					content="Tìm phòng trọ theo khu vực, ngân sách và nhu cầu tại Trọ Đây."
				/>
			</Head>

			<a
				href="#main-content"
				className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-xl bg-[var(--gtg-primary-dark)] px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
			>
				Bỏ qua đến nội dung chính
			</a>
			<PublicHeader />
			<main id="main-content" className="pt-16" tabIndex={-1}>
				<QuickSearch
					query={filters.location}
					onSearch={(location) =>
						router.get(
							'/phong-tro',
							{ location },
							{ preserveScroll: true },
						)
					}
				/>
				<LatestListingsSection query={filters.location} />
			</main>
			<PublicFooter />
		</div>
	);
}
