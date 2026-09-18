import { preserveListingFilters } from '@/lib/listing-url';
import {
	searchLocations,
	type LocationSuggestion,
} from '@/services/location-service';
import { router } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export function HeaderLocationSearch({
	className = '',
}: {
	className?: string;
}) {
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [locations, setLocations] = useState<LocationSuggestion[]>([]);
	const [loading, setLoading] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();
	const [activeIndex, setActiveIndex] = useState(-1);

	useEffect(() => {
		if (!open) return;

		const controller = new AbortController();
		setLoading(true);
		const timeout = window.setTimeout(() => {
			searchLocations(query, controller.signal)
				.then((response) => setLocations(response.data))
				.catch(() => setLocations([]))
				.finally(() => {
					if (!controller.signal.aborted) setLoading(false);
				});
		}, 180);

		return () => {
			window.clearTimeout(timeout);
			controller.abort();
		};
	}, [open, query]);

	useEffect(() => {
		const close = (event: MouseEvent) => {
			if (!containerRef.current?.contains(event.target as Node))
				setOpen(false);
		};
		document.addEventListener('mousedown', close);
		return () => document.removeEventListener('mousedown', close);
	}, []);

	return (
		<div
			ref={containerRef}
			className={`relative w-full max-w-64 ${className}`}
		>
			<MapPin
				className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--gtg-muted)]"
				aria-hidden="true"
			/>
			<input
				type="search"
				value={query}
				ref={inputRef}
				role="combobox"
				aria-autocomplete="list"
				aria-controls={listboxId}
				aria-expanded={open}
				onFocus={() => setOpen(true)}
				onChange={(event) => {
					setQuery(event.target.value);
					setActiveIndex(-1);
					setOpen(true);
				}}
				onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
					if (event.key === 'Escape') {
						setOpen(false);
						event.currentTarget.blur();
					}
					if (event.key === 'ArrowDown') {
						event.preventDefault();
						setOpen(true);
						setActiveIndex((index) =>
							Math.min(index + 1, locations.length - 1),
						);
					}
					if (event.key === 'ArrowUp') {
						event.preventDefault();
						setActiveIndex((index) => Math.max(index - 1, 0));
					}
					if (
						event.key === 'Enter' &&
						activeIndex >= 0 &&
						locations[activeIndex]
					) {
						event.preventDefault();
						router.get(
							preserveListingFilters(
								window.location.href,
								locations[activeIndex].url,
							),
						);
					}
				}}
				placeholder="Tìm theo khu vực"
				aria-label="Tìm phòng theo khu vực"
				className="h-10 w-full rounded-full bg-[var(--gtg-surface-low)] pr-3 pl-9 text-sm text-[var(--gtg-text)] outline-none placeholder:text-[var(--gtg-muted)] focus:ring-2 focus:ring-[var(--gtg-primary-soft)]"
			/>
			{open && (
				<div
					id={listboxId}
					role="listbox"
					className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[var(--gtg-border)] bg-white p-1 shadow-lg"
				>
					{loading ? (
						<p className="px-3 py-3 text-sm text-[var(--gtg-muted)]">
							Đang tìm khu vực…
						</p>
					) : locations.length ? (
						locations.map((location) => (
							<button
								key={location.url}
								type="button"
								role="option"
								aria-selected={
									activeIndex === locations.indexOf(location)
								}
								className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm hover:bg-[var(--gtg-surface-low)] ${activeIndex === locations.indexOf(location) ? 'bg-[var(--gtg-surface-low)]' : ''}`}
								onClick={() => {
									setOpen(false);
									router.get(
										preserveListingFilters(
											window.location.href,
											location.url,
										),
									);
								}}
							>
								<MapPin
									className="size-4 shrink-0 text-[var(--gtg-primary)]"
									aria-hidden="true"
								/>
								{location.label}
							</button>
						))
					) : (
						<p className="px-3 py-3 text-sm text-[var(--gtg-muted)]">
							Không tìm thấy khu vực phù hợp.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
