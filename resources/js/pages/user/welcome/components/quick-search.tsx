import {
	SearchableSelect,
	type SearchableSelectOption,
} from '@/components/tro-day/searchable-select';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	getProvinces,
	getWards,
	searchLocations,
	type LocationSuggestion,
} from '@/services/location-service';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';

interface QuickSearchProps {
	query: string;
	locationUrl?: string;
	province?: LocationSuggestion;
	minPrice?: number | null;
	maxPrice?: number | null;
	onSearch: (url: string) => void;
}

const priceRanges = [
	{ label: 'Tất cả mức giá', value: '' },
	{ label: 'Dưới 2 triệu', value: '0-2000000' },
	{ label: '2 – 3 triệu', value: '2000000-3000000' },
	{ label: '3 – 5 triệu', value: '3000000-5000000' },
	{ label: '5 – 7 triệu', value: '5000000-7000000' },
	{ label: 'Trên 7 triệu', value: '7000000-' },
] as const;

function priceRangeValue(minPrice?: number | null, maxPrice?: number | null) {
	return `${minPrice ?? ''}-${maxPrice ?? ''}`;
}

function provinceSlug(suggestion: LocationSuggestion) {
	return new URL(suggestion.url, window.location.origin).pathname
		.split('/')
		.at(-1);
}

export function QuickSearch({
	query,
	locationUrl,
	province,
	minPrice,
	maxPrice,
	onSearch,
}: QuickSearchProps) {
	const [popularProvinces, setPopularProvinces] = useState<
		LocationSuggestion[]
	>([]);
	const [allProvinces, setAllProvinces] = useState<LocationSuggestion[]>([]);
	const [isProvinceDialogOpen, setIsProvinceDialogOpen] = useState(false);
	const [selectedProvince, setSelectedProvince] =
		useState<LocationSuggestion | null>(province ?? null);
	const [selectedLocation, setSelectedLocation] =
		useState<LocationSuggestion | null>(
			locationUrl ? { label: query, url: locationUrl, type: '' } : null,
		);
	const [wards, setWards] = useState<LocationSuggestion[]>([]);
	const [isLoadingWards, setIsLoadingWards] = useState(false);
	const [wardQuery, setWardQuery] = useState('');
	const [isPriceMenuOpen, setIsPriceMenuOpen] = useState(false);
	const [priceRange, setPriceRange] = useState(
		priceRangeValue(minPrice, maxPrice),
	);
	const wardInputRef = useRef<HTMLInputElement>(null);
	const priceSelectContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function loadPopularProvinces() {
			try {
				const payload = await searchLocations('', controller.signal);
				setPopularProvinces(payload.data);
			} catch (exception) {
				if (
					!(
						exception instanceof DOMException &&
						exception.name === 'AbortError'
					)
				) {
					setPopularProvinces([]);
				}
			}
		}

		void loadPopularProvinces();

		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (!isProvinceDialogOpen || allProvinces.length > 0) return;

		const controller = new AbortController();

		async function loadAllProvinces() {
			try {
				const payload = await getProvinces(controller.signal);
				setAllProvinces(payload.data);
			} catch (exception) {
				if (
					!(
						exception instanceof DOMException &&
						exception.name === 'AbortError'
					)
				) {
					setAllProvinces([]);
				}
			}
		}

		void loadAllProvinces();

		return () => controller.abort();
	}, [allProvinces.length, isProvinceDialogOpen]);

	useEffect(() => {
		setSelectedLocation(
			locationUrl ? { label: query, url: locationUrl, type: '' } : null,
		);
	}, [locationUrl, query]);

	useEffect(() => {
		setSelectedProvince(province ?? null);
	}, [province]);

	useEffect(() => {
		setPriceRange(priceRangeValue(minPrice, maxPrice));
	}, [minPrice, maxPrice]);

	useEffect(() => {
		function closeMenus(event: MouseEvent) {
			if (
				priceSelectContainerRef.current &&
				!priceSelectContainerRef.current.contains(event.target as Node)
			) {
				setIsPriceMenuOpen(false);
			}
		}

		document.addEventListener('mousedown', closeMenus);

		return () => document.removeEventListener('mousedown', closeMenus);
	}, []);

	useEffect(() => {
		if (!selectedProvince) {
			setWards([]);
			setWardQuery('');
			return;
		}

		setWardQuery('');

		const controller = new AbortController();
		const slug = provinceSlug(selectedProvince);

		if (!slug) return;

		async function loadWards() {
			setIsLoadingWards(true);

			try {
				const payload = await getWards(slug, controller.signal);
				setWards(payload.data);
				setWardQuery(locationUrl?.includes('/phuong-xa/') ? query : '');
			} catch (exception) {
				if (
					!(
						exception instanceof DOMException &&
						exception.name === 'AbortError'
					)
				) {
					setWards([]);
				}
			} finally {
				if (!controller.signal.aborted) {
					setIsLoadingWards(false);
					wardInputRef.current?.focus();
				}
			}
		}

		void loadWards();

		return () => controller.abort();
	}, [locationUrl, query, selectedProvince]);

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const url = new URL(
			selectedLocation?.url ?? '/phong-tro',
			window.location.origin,
		);
		const [min, max] = priceRange.split('-');

		if (min) url.searchParams.set('gia-tu', min);
		if (max) url.searchParams.set('gia-den', max);

		onSearch(`${url.pathname}${url.search}`);
	}

	return (
		<section
			className="border-b border-[var(--gtg-border)] bg-white"
			aria-labelledby="tim-phong"
		>
			<div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 lg:py-20">
				<div className="max-w-5xl">
					<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
						Tìm nhanh
					</p>
					<h2
						id="tim-phong"
						className="gtg-anchor mt-1 text-2xl font-bold tracking-[-0.03em]"
					>
						Chọn khu vực, tìm phòng phù hợp
					</h2>

					<div className="mt-5">
						<p className="text-sm font-bold text-[var(--gtg-text)] uppercase">
							Tỉnh/thành
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{popularProvinces.slice(0, 4).map((province) => {
								const isSelected =
									selectedProvince?.url === province.url;

								return (
									<button
										key={province.url}
										type="button"
										onClick={() => {
											setSelectedProvince(province);
											setSelectedLocation(province);
										}}
										className={`min-h-[70px] rounded-xl border px-4 py-3 text-left shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gtg-primary)] ${
											isSelected
												? 'border-[var(--gtg-primary)] bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]'
												: 'border-[var(--gtg-border)] bg-white text-[var(--gtg-text)] hover:border-[var(--gtg-primary)] hover:bg-[var(--gtg-surface-low)]'
										}`}
									>
										<span className="block text-xs font-medium text-[var(--gtg-muted)]">
											Phòng trọ
										</span>
										<span className="mt-1 block text-base font-semibold">
											{province.label}
										</span>
									</button>
								);
							})}
							<button
								type="button"
								onClick={() => setIsProvinceDialogOpen(true)}
								className="inline-flex min-h-[70px] items-center rounded-xl border border-[var(--gtg-border)] bg-white px-4 text-sm font-semibold text-[var(--gtg-primary)] shadow-sm hover:border-[var(--gtg-primary)] hover:bg-[var(--gtg-surface-low)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gtg-primary)]"
							>
								Tất cả →
							</button>
						</div>
					</div>

					<form
						onSubmit={submit}
						className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto]"
					>
						<div>
							<label htmlFor="ward-search" className="sr-only">
								Khu vực hoặc phường xã
							</label>
							<SearchableSelect
								inputRef={wardInputRef}
								id="ward-search"
								value={wardQuery}
								options={wards.map((ward) => ({
									label: ward.label,
									value: ward.url,
								}))}
								disabled={!selectedProvince || isLoadingWards}
								onValueChange={(value) => {
									setWardQuery(value);
									setSelectedLocation(selectedProvince);
								}}
								onSelect={(option: SearchableSelectOption) => {
									const ward = wards.find(
										(item) => item.url === option.value,
									);

									if (!ward) return;

									setSelectedLocation(ward);
									setWardQuery(ward.label);
								}}
								placeholder={
									selectedProvince
										? `Tìm phường/xã tại ${selectedProvince.label}`
										: 'Chọn tỉnh/thành trước'
								}
							/>
						</div>
						<div
							ref={priceSelectContainerRef}
							className="relative sm:w-[220px]"
						>
							<button
								type="button"
								onClick={() =>
									setIsPriceMenuOpen((open) => !open)
								}
								className="inline-flex min-h-12 w-full items-center justify-between rounded-[10px] border border-[var(--gtg-border-strong)] bg-white px-4 text-left text-base text-[var(--gtg-text)] focus:border-[var(--gtg-primary)] focus:ring-2 focus:ring-[var(--gtg-primary-soft)] focus:outline-none"
								aria-label="Mức giá mỗi tháng"
								aria-expanded={isPriceMenuOpen}
							>
								{priceRanges.find(
									(range) => range.value === priceRange,
								)?.label ?? 'Tất cả mức giá'}
								<ChevronDown
									className="size-5 text-[var(--gtg-muted)]"
									aria-hidden="true"
								/>
							</button>
							{isPriceMenuOpen && (
								<div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[var(--gtg-border)] bg-white p-1 shadow-lg">
									{priceRanges.map((range) => (
										<button
											key={range.value}
											type="button"
											onClick={() => {
												setPriceRange(range.value);
												setIsPriceMenuOpen(false);
											}}
											className={`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium focus-visible:outline-none ${
												range.value === priceRange
													? 'bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]'
													: 'text-[var(--gtg-text)] hover:bg-[var(--gtg-surface-low)]'
											}`}
										>
											{range.label}
										</button>
									))}
								</div>
							)}
						</div>
						<button
							type="submit"
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--gtg-primary)] px-6 font-semibold text-white hover:bg-[var(--gtg-primary-dark)] focus-visible:ring-2 focus-visible:ring-[var(--gtg-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							<Search className="size-5" aria-hidden="true" />
							Xem phòng
						</button>
					</form>

					<Dialog
						open={isProvinceDialogOpen}
						onOpenChange={setIsProvinceDialogOpen}
					>
						<DialogContent className="max-h-[calc(100dvh-2rem)] max-w-3xl overflow-y-auto border-[var(--gtg-border)] bg-white p-5 sm:p-6">
							<DialogHeader>
								<DialogTitle className="text-xl text-[var(--gtg-text)]">
									Chọn tỉnh/thành
								</DialogTitle>
								<DialogDescription className="text-[var(--gtg-muted)]">
									Chọn nơi bạn muốn tìm phòng. Sau đó bạn có
									thể chọn thêm phường/xã.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
								{allProvinces.map((province) => (
									<button
										key={province.url}
										type="button"
										onClick={() => {
											setSelectedProvince(province);
											setSelectedLocation(province);
											setIsProvinceDialogOpen(false);
										}}
										className="min-h-12 rounded-lg border border-[var(--gtg-border)] px-3 text-left text-sm font-semibold text-[var(--gtg-text)] hover:border-[var(--gtg-primary)] hover:bg-[var(--gtg-primary-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gtg-primary)]"
									>
										{province.label}
									</button>
								))}
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</section>
	);
}
