import type { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const benefits = [
	'Tạo và lưu bản nháp tin đăng',
	'Gửi tin để quản trị viên duyệt',
	'Theo dõi trạng thái phòng tại một nơi',
];

export function LandlordCta() {
	const { auth } = usePage<SharedData>().props;
	return (
		<section className="bg-white" aria-labelledby="chu-tro">
			<div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6 lg:py-20">
				<div className="border border-l-4 border-[var(--gtg-border-strong)] border-l-[var(--gtg-accent)] bg-[var(--gtg-surface-low)] px-6 py-10 text-[var(--gtg-text)] sm:px-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:px-14 lg:py-12">
					<div className="relative">
						<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
							Dành cho chủ trọ
						</p>
						<h2
							id="chu-tro"
							className="gtg-anchor mt-2 max-w-2xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
						>
							Đăng và quản lý phòng trọ gọn hơn.
						</h2>
						<ul className="mt-6 grid gap-3 text-sm text-[var(--gtg-muted)] sm:grid-cols-3">
							{benefits.map((benefit) => (
								<li
									key={benefit}
									className="flex items-start gap-2"
								>
									<CheckCircle2
										className="mt-0.5 size-4 shrink-0 text-[var(--gtg-primary)]"
										aria-hidden="true"
									/>
									{benefit}
								</li>
							))}
						</ul>
					</div>
					<Link
						href={
							auth.user
								? '/chu-tro/tin-dang/tao-moi'
								: '/register'
						}
						className="relative mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--gtg-primary)] px-6 font-semibold text-white hover:bg-[var(--gtg-primary-dark)] lg:mt-0"
					>
						Bắt đầu đăng phòng{' '}
						<ArrowRight className="size-5" aria-hidden="true" />
					</Link>
				</div>
			</div>
		</section>
	);
}
