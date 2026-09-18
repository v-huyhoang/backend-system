import type { LandlordListingStat } from '@/types/landlord-listings';
import {
	ChartNoAxesColumnIncreasing,
	House,
	PhoneCall,
	TriangleAlert,
} from 'lucide-react';

const icons = {
	home: House,
	chart: ChartNoAxesColumnIncreasing,
	phone: PhoneCall,
	alert: TriangleAlert,
} as const;
export function StatCard({ stat }: { stat: LandlordListingStat }) {
	const Icon = icons[stat.icon];
	return (
		<article className="flex items-center justify-between rounded-xl border border-[var(--gtg-border)] bg-white p-4 shadow-sm">
			<div>
				<p className="text-xs font-semibold tracking-wide text-[var(--gtg-muted)] uppercase">
					{stat.label}
				</p>
				<p className="mt-1 text-2xl font-bold text-[var(--gtg-primary)] tabular-nums">
					{stat.value}
				</p>
				<p className="mt-1 text-xs text-[var(--gtg-muted)]">
					{stat.description}
				</p>
			</div>
			<div className="grid size-11 place-items-center rounded-xl bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary)]">
				<Icon className="size-5" aria-hidden="true" />
			</div>
		</article>
	);
}
