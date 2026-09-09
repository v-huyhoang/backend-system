import { MapPin, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const suggestedLocations = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'] as const;

interface QuickSearchProps {
	query: string;
	onSearch: (location: string) => void;
}

export function QuickSearch({ query, onSearch }: QuickSearchProps) {
	const [location, setLocation] = useState(query);
	const [error, setError] = useState('');

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const trimmedLocation = location.trim();

		if (!trimmedLocation) {
			setError('Hãy nhập khu vực bạn muốn tìm phòng.');
			return;
		}

		setError('');
		onSearch(trimmedLocation);
		document
			.querySelector('#phong-moi')
			?.scrollIntoView({ behavior: 'smooth' });
	}

	return (
		<section
			className="border-b border-[var(--gtg-border)] bg-white"
			aria-labelledby="tim-phong"
		>
			<div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6 lg:py-12">
				<div className="mx-auto max-w-4xl">
					<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
						Bắt đầu từ khu vực
					</p>
					<h2
						id="tim-phong"
						className="gtg-anchor mt-2 text-3xl font-bold tracking-[-0.03em]"
					>
						Bạn muốn thuê ở đâu?
					</h2>
					<p className="mt-2 text-[var(--gtg-muted)]">
						Nhập tỉnh, thành phố hoặc khu vực bạn muốn ở.
					</p>

					<form
						onSubmit={submit}
						className="mt-6 flex flex-col gap-3 sm:flex-row"
						noValidate
					>
						<label className="relative min-w-0 flex-1">
							<span className="sr-only">
								Khu vực muốn tìm phòng
							</span>
							<MapPin
								className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[var(--gtg-primary)]"
								aria-hidden="true"
							/>
							<input
								type="search"
								value={location}
								onChange={(event) => {
									setLocation(event.target.value);
									setError('');
								}}
								placeholder="Ví dụ: TP. Hồ Chí Minh, Cầu Giấy..."
								className="min-h-12 w-full border border-[var(--gtg-border-strong)] bg-white py-3 pr-4 pl-12 text-base text-[var(--gtg-text)] placeholder:text-[var(--gtg-muted)]"
								aria-invalid={Boolean(error)}
								aria-describedby={
									error ? 'location-search-error' : undefined
								}
							/>
						</label>
						<button
							type="submit"
							className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--gtg-primary)] px-6 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
						>
							<Search className="size-5" aria-hidden="true" />
							Tìm phòng
						</button>
					</form>
					{error && (
						<p
							id="location-search-error"
							className="mt-2 text-sm text-red-700"
							role="alert"
						>
							{error}
						</p>
					)}

					<div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
						<span className="text-[var(--gtg-muted)]">Gợi ý:</span>
						{suggestedLocations.map((suggestion) => (
							<button
								key={suggestion}
								type="button"
								onClick={() => {
									setLocation(suggestion);
									setError('');
								}}
								className="min-h-11 border border-[var(--gtg-border)] bg-[var(--gtg-surface-low)] px-3 font-semibold text-[var(--gtg-text)] hover:border-[var(--gtg-primary)] hover:bg-[var(--gtg-primary-soft)]"
							>
								{suggestion}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
