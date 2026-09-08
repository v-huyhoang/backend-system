import { BrandLogo } from '@/components/goc-tro-gon/brand-logo';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Home, MapPin, Search } from 'lucide-react';

const benefits = [
	{
		icon: MapPin,
		title: 'Tìm đúng khu vực',
		description:
			'Lọc phòng theo tỉnh, phường, mức giá và nhu cầu sinh hoạt.',
	},
	{
		icon: BadgeCheck,
		title: 'Tin đăng rõ ràng',
		description:
			'Thông tin phòng, chi phí và tiện ích được trình bày minh bạch.',
	},
	{
		icon: Home,
		title: 'Đăng tin thuận tiện',
		description:
			'Chủ trọ quản lý tin và cập nhật trạng thái phòng tại một nơi.',
	},
] as const;

export default function Welcome() {
	return (
		<div className="gtg-theme min-h-screen bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Góc Trọ Gọn — Tìm phòng trọ phù hợp">
				<meta
					name="description"
					content="Nền tảng tìm và đăng tin phòng trọ với thông tin rõ ràng, dễ tra cứu."
				/>
				<link rel="preconnect" href="https://fonts.bunny.net" />
				<link
					href="https://fonts.bunny.net/css?family=be-vietnam-pro:400,500,600,700"
					rel="stylesheet"
				/>
			</Head>

			<a
				href="#main-content"
				className="fixed top-2 left-2 z-50 -translate-y-20 rounded-xl bg-[var(--gtg-primary-dark)] px-4 py-3 font-semibold text-white transition-transform focus:translate-y-0"
			>
				Bỏ qua đến nội dung chính
			</a>

			<header className="border-b border-[var(--gtg-border)] bg-white/95 backdrop-blur-sm">
				<div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
					<BrandLogo />
					<nav
						className="flex items-center gap-2"
						aria-label="Tài khoản"
					>
						<Link
							href="/login"
							className="inline-flex min-h-11 items-center rounded-xl px-4 font-semibold text-[var(--gtg-primary-dark)] hover:bg-[var(--gtg-primary-soft)]"
						>
							Đăng nhập
						</Link>
						<Link
							href="/register"
							className="hidden min-h-11 items-center rounded-xl bg-[var(--gtg-primary)] px-4 font-semibold text-white hover:bg-[var(--gtg-primary-dark)] sm:inline-flex"
						>
							Đăng tin
						</Link>
					</nav>
				</div>
			</header>

			<main id="main-content" tabIndex={-1}>
				<section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
					<div>
						<p className="mb-4 inline-flex items-center rounded-full bg-[var(--gtg-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--gtg-primary-dark)]">
							Nền tảng đang được hoàn thiện
						</p>
						<h1 className="max-w-3xl text-4xl leading-tight font-bold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
							Tìm một căn phòng vừa vặn với cuộc sống của bạn.
						</h1>
						<p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--gtg-muted)]">
							Góc Trọ Gọn kết nối người cần thuê với chủ trọ qua
							các tin đăng rõ ràng về vị trí, giá, chi phí và tiện
							ích.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<a
								href="#features"
								className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-6 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
							>
								<Search className="size-5" aria-hidden="true" />
								Khám phá nền tảng
							</a>
							<Link
								href="/register"
								className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--gtg-border-strong)] bg-white px-6 font-semibold text-[var(--gtg-primary-dark)] hover:bg-[var(--gtg-hover)]"
							>
								Tạo tài khoản
								<ArrowRight
									className="size-5"
									aria-hidden="true"
								/>
							</Link>
						</div>
					</div>

					<div className="overflow-hidden rounded-3xl border border-[var(--gtg-border)] bg-white p-3 shadow-[var(--gtg-shadow-md)]">
						<img
							src="/images/goc-tro-gon/hero-room.webp"
							alt="Không gian phòng trọ gọn gàng và đủ ánh sáng"
							className="aspect-[4/3] w-full rounded-2xl object-cover"
							width="800"
							height="600"
						/>
					</div>
				</section>

				<section
					id="features"
					className="border-y border-[var(--gtg-border)] bg-white"
					aria-labelledby="features-heading"
				>
					<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
						<div className="max-w-2xl">
							<h2
								id="features-heading"
								className="text-3xl font-bold tracking-[-0.025em]"
							>
								Một nơi đơn giản để tìm và đăng phòng
							</h2>
							<p className="mt-3 leading-7 text-[var(--gtg-muted)]">
								Những tính năng cốt lõi đang được xây dựng cho
								phiên bản đầu tiên.
							</p>
						</div>
						<div className="mt-10 grid gap-5 md:grid-cols-3">
							{benefits.map(
								({ icon: Icon, title, description }) => (
									<article
										key={title}
										className="rounded-2xl border border-[var(--gtg-border)] bg-[var(--gtg-bg)] p-6"
									>
										<span className="grid size-11 place-items-center rounded-xl bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]">
											<Icon
												className="size-5"
												aria-hidden="true"
											/>
										</span>
										<h3 className="mt-5 text-xl font-bold">
											{title}
										</h3>
										<p className="mt-2 leading-7 text-[var(--gtg-muted)]">
											{description}
										</p>
									</article>
								),
							)}
						</div>
					</div>
				</section>
			</main>

			<footer className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-[var(--gtg-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
				<p>© {new Date().getFullYear()} Góc Trọ Gọn.</p>
				<p>Tìm trọ rõ ràng, sống nhẹ nhàng.</p>
			</footer>
		</div>
	);
}
