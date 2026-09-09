import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { HeroSearch } from './components/hero-search';
import { LandlordCta } from './components/landlord-cta';
import { LatestListingsSection } from './components/latest-listings-section';
import { PropertyTypesSection } from './components/property-types-section';
import { QuickSearch } from './components/quick-search';

export default function Welcome() {
	const [query, setQuery] = useState('');

	return (
		<div className="gtg-theme min-h-screen bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Trọ Đây — Tìm phòng trọ phù hợp">
				<meta
					name="description"
					content="Tìm và đăng phòng trọ dài hạn với thông tin rõ ràng về giá, khu vực, chi phí và tiện ích."
				/>
				<link rel="preconnect" href="https://fonts.bunny.net" />
				<link
					href="https://fonts.bunny.net/css?family=be-vietnam-pro:400,500,600,700"
					rel="stylesheet"
				/>
			</Head>

			<a
				href="#main-content"
				className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-xl bg-[var(--gtg-primary-dark)] px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
			>
				Bỏ qua đến nội dung chính
			</a>
			<PublicHeader />
			<main id="main-content" tabIndex={-1}>
				<HeroSearch />
				<QuickSearch query={query} onSearch={setQuery} />
				<PropertyTypesSection />
				<LatestListingsSection query={query} />
				<LandlordCta />
			</main>
			<PublicFooter />
		</div>
	);
}
