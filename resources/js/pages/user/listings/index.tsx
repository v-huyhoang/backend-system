import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import { Head, router } from '@inertiajs/react';
import { LatestListingsSection } from '../welcome/components/latest-listings-section';
import { QuickSearch } from '../welcome/components/quick-search';
import { PriceQuickFilters } from './components/price-quick-filters';

interface ListingsIndexProps {
	filters: {
		location: string;
		'tinh-thanh': string | null;
		'tinh-thanh-label': string | null;
		'phuong-xa': string | null;
		'gia-tu': number | null;
		'gia-den': number | null;
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
					locationUrl={
						filters['phuong-xa'] && filters['tinh-thanh']
							? `/phong-tro/tinh-thanh/${filters['tinh-thanh']}/phuong-xa/${filters['phuong-xa']}`
							: filters['tinh-thanh']
								? `/phong-tro/tinh-thanh/${filters['tinh-thanh']}`
								: undefined
					}
					province={
						filters['tinh-thanh']
							? {
									label: filters['tinh-thanh-label'] ?? '',
									url: `/phong-tro/tinh-thanh/${filters['tinh-thanh']}`,
									type: 'Tỉnh/thành',
								}
							: undefined
					}
					minPrice={filters['gia-tu']}
					maxPrice={filters['gia-den']}
					onSearch={(url) => {
						router.get(
							url,
							{},
							{
								preserveScroll: true,
							},
						);
					}}
				/>
				<PriceQuickFilters
					minPrice={filters['gia-tu']}
					maxPrice={filters['gia-den']}
					path={
						filters['phuong-xa'] && filters['tinh-thanh']
							? `/phong-tro/tinh-thanh/${filters['tinh-thanh']}/phuong-xa/${filters['phuong-xa']}`
							: filters['tinh-thanh']
								? `/phong-tro/tinh-thanh/${filters['tinh-thanh']}`
								: '/phong-tro'
					}
				/>
				<LatestListingsSection query={filters.location} />
			</main>
			<PublicFooter />
		</div>
	);
}
