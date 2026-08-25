import { ArrowRight, Boxes, HeartHandshake } from 'lucide-react';

export function HeroSection() {
	return (
		<section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-8 pb-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-16 lg:gap-14 lg:px-8">
			<div>
				<p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--gtg-primary-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--gtg-primary-dark)]">
					<HeartHandshake className="size-4" aria-hidden="true" />
					Đồ thật · Review thật · Nói cả điểm trừ
				</p>
				<h1 className="max-w-xl text-[40px] leading-[1.2] font-bold tracking-[-0.04em] text-[var(--gtg-primary-dark)] sm:text-5xl lg:text-6xl">
					Phòng nhỏ vẫn có thể sống gọn.
				</h1>
				<p className="mt-5 max-w-xl text-lg leading-8 text-[var(--gtg-text-soft)]">
					Những món đồ hữu ích cho phòng trọ sinh viên — có review, có
					nhược điểm và có giá tham khảo.
				</p>
				<a
					href="#products"
					className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-5 font-bold text-white hover:bg-[var(--gtg-primary-dark)]"
				>
					Khám phá sản phẩm{' '}
					<ArrowRight className="size-4" aria-hidden="true" />
				</a>
				<div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--gtg-border)] pt-5 text-sm text-[var(--gtg-muted)]">
					<span className="flex items-center gap-2">
						<Boxes
							className="size-4 text-[var(--gtg-primary)]"
							aria-hidden="true"
						/>
						<strong className="text-[var(--gtg-text)]">
							12–25m²
						</strong>{' '}
						phòng nhỏ
					</span>
					<span>
						<strong className="text-[var(--gtg-text)]">
							30K–500K
						</strong>{' '}
						vừa ngân sách
					</span>
				</div>
			</div>
			<div className="relative overflow-hidden rounded-2xl bg-[var(--gtg-border)] shadow-[0_16px_50px_rgba(40,91,50,0.12)]">
				<img
					src="/images/goc-tro-gon/hero-room.webp"
					alt="Góc học tập gọn gàng trong một phòng trọ nhỏ"
					className="aspect-[4/3] w-full object-cover"
					width="900"
					height="600"
					fetchPriority="high"
				/>
				<div className="absolute right-3 bottom-3 left-3 rounded-xl bg-white/95 p-3 shadow-sm">
					<p className="text-sm font-semibold text-[var(--gtg-primary-dark)]">
						Gọn vừa đủ, không cần mua quá nhiều.
					</p>
				</div>
			</div>
		</section>
	);
}
