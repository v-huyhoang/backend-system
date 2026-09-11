import { Link } from '@inertiajs/react';

interface PriceQuickFiltersProps {
	minPrice: number | null;
	maxPrice: number | null;
	path: string;
}

const ranges = [
	{ label: 'Tất cả', min: null, max: null },
	{ label: 'Dưới 2 triệu', min: null, max: 2_000_000 },
	{ label: '2 – 3 triệu', min: 2_000_000, max: 3_000_000 },
	{ label: '3 – 5 triệu', min: 3_000_000, max: 5_000_000 },
	{ label: '5 – 7 triệu', min: 5_000_000, max: 7_000_000 },
	{ label: 'Trên 7 triệu', min: 7_000_000, max: null },
] as const;

function urlFor(path: string, min: number | null, max: number | null) {
	const url = new URL(path, window.location.origin);

	if (min !== null) url.searchParams.set('gia-tu', String(min));
	if (max !== null) url.searchParams.set('gia-den', String(max));

	return `${url.pathname}${url.search}`;
}

export function PriceQuickFilters({
	minPrice,
	maxPrice,
	path,
}: PriceQuickFiltersProps) {
	return (
		<nav
			className="border-b border-[var(--gtg-border)] bg-[var(--gtg-page-bg)]"
			aria-label="Lọc nhanh theo khoảng giá"
		>
			<div className="mx-auto flex max-w-[1200px] items-center gap-2 overflow-x-auto px-4 py-3 md:px-6">
				<span className="shrink-0 text-sm font-semibold text-[var(--gtg-text)]">
					Khoảng giá:
				</span>
				{ranges.map((range) => {
					const isActive =
						range.min === minPrice && range.max === maxPrice;

					return (
						<Link
							key={range.label}
							href={urlFor(path, range.min, range.max)}
							className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 text-sm font-medium transition-colors ${
								isActive
									? 'border-[var(--gtg-primary)] bg-[var(--gtg-primary)] text-white'
									: 'border-[var(--gtg-border-strong)] bg-white text-[var(--gtg-text)] hover:border-[var(--gtg-primary)] hover:text-[var(--gtg-primary)]'
							}`}
						>
							{range.label}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
