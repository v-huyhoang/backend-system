import { ArrowDown } from 'lucide-react';

export function HeroSearch() {
	return (
		<section className="overflow-hidden border-b border-[var(--gtg-border)] bg-[var(--gtg-page-bg)] pt-16">
			<div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-12 md:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
				<div className="relative z-10">
					<p className="flex items-center gap-3 text-sm font-bold tracking-[0.12em] text-[var(--gtg-primary)] uppercase">
						<span
							className="h-px w-8 bg-[var(--gtg-primary)]"
							aria-hidden="true"
						/>
						Phòng phù hợp, ở ngay đây
					</p>
					<h1 className="mt-5 max-w-3xl text-4xl leading-[1.12] font-bold tracking-[-0.04em] text-[var(--gtg-text)] sm:text-5xl lg:text-[3.5rem]">
						Căn phòng phù hợp đang ở gần bạn hơn bạn nghĩ.
					</h1>
					<p className="mt-5 max-w-2xl text-base leading-7 text-[var(--gtg-muted)] sm:text-lg">
						Khám phá phòng trọ theo đúng khu vực, ngân sách và nhu
						cầu. Giá thuê, chi phí và tiện ích được trình bày gọn
						gàng để bạn dễ so sánh.
					</p>
					<a
						href="#tim-phong"
						className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[var(--gtg-primary)] px-6 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
					>
						Tìm phòng theo khu vực
						<ArrowDown className="size-5" aria-hidden="true" />
					</a>
				</div>
				<div className="relative mx-auto w-full max-w-xl border border-[var(--gtg-border-strong)] bg-white p-2 lg:max-w-none">
					<img
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGHY8HX2JYLcb6qoE_8IVjyJH08UhUEmnmRhQ5rS1bdtAGUTgVhXPVlCCnu6Xjrk4znUrLgDjx80f1Zr1tprjJh1xeaodwpXUtokVA58VGPSaiQlP6_vpUu7OpYMmQqNz8etUzZz0prPLwhZN6OaoDcmyILZNbjwiZU6nd9rRoCFhuUvczfEz9Dp-ZW_wOneKKuNoFzXHh2_7mgO5zbF2AmMO510dpHMlo5GsYYLgztQ-zEvwYeH6I"
						alt="Phòng trọ sáng sủa với nội thất gọn gàng"
						className="aspect-[4/3] w-full object-cover"
						width="800"
						height="600"
						fetchPriority="high"
					/>
				</div>
			</div>
		</section>
	);
}
