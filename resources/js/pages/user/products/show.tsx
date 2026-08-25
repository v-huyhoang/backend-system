import { BrandLogo } from '@/components/goc-tro-gon/brand-logo';
import { ShopLink } from '@/components/goc-tro-gon/shop-link';
import { trackGocTroGonEvent } from '@/lib/goc-tro-gon-analytics';
import { Head, Link } from '@inertiajs/react';
import {
	ArrowLeft,
	BadgeCheck,
	Check,
	ChevronRight,
	CircleAlert,
	Play,
	X,
} from 'lucide-react';

const alternatives = [
	{
		code: 'GTG02',
		name: 'Hộp đựng dây điện để bàn',
		note: 'Rẻ hơn · Hợp góc học tập',
		price: '59.000đ',
		image: '/images/goc-tro-gon/gtg02-cable-box.webp',
	},
	{
		code: 'GTG03',
		name: 'Túi hút chân không đựng quần áo',
		note: 'Hợp khi thiếu chỗ trong tủ',
		price: '79.000đ',
		image: '/images/goc-tro-gon/gtg03-vacuum-bags.webp',
	},
];

const productDetails = {
	'ke-dan-tuong-khong-can-khoan': {
		code: 'GTG01',
		name: 'Kệ dán tường không cần khoan',
		price: '89.000đ',
		seller: 'Home Simple Official',
		image: '/images/goc-tro-gon/gtg01-wall-shelf.webp',
		summary:
			'Thêm một khoảng chứa đồ nhỏ mà không cần khoan tường — hợp phòng trọ khô ráo và đồ nhẹ.',
		pros: [
			'Dễ lắp đặt trong vài phút',
			'Tiết kiệm diện tích bề mặt',
			'Không cần khoan tường',
		],
		cons: [
			'Không phù hợp với tường ẩm',
			'Khả năng chịu lực phụ thuộc bề mặt tường',
		],
		fit: [
			'Bạn cần thêm chỗ để đồ nhẹ',
			'Không muốn hoặc không được khoan tường',
		],
	},
	'hop-dung-day-dien-de-ban': {
		code: 'GTG02',
		name: 'Hộp đựng dây điện để bàn',
		price: '59.000đ',
		seller: 'Tiện Ích Bàn Học',
		image: '/images/goc-tro-gon/gtg02-cable-box.webp',
		summary:
			'Giấu ổ điện và dây sạc khỏi mặt bàn, phù hợp với góc học tập nhỏ có nhiều thiết bị.',
		pros: [
			'Gom dây điện vào một chỗ',
			'Có khe thoát dây hai bên',
			'Dễ mở để kiểm tra ổ cắm',
		],
		cons: [
			'Không hợp ổ điện kích thước lớn',
			'Cần chừa khoảng thoáng để tản nhiệt',
		],
		fit: [
			'Bàn học có nhiều dây sạc',
			'Bạn muốn che ổ điện nhưng vẫn dễ kiểm tra',
		],
	},
	'tui-hut-chan-khong-dung-quan-ao': {
		code: 'GTG03',
		name: 'Túi hút chân không đựng quần áo',
		price: '79.000đ',
		seller: 'Nhà Gọn Store',
		image: '/images/goc-tro-gon/gtg03-vacuum-bags.webp',
		summary:
			'Nén quần áo trái mùa để tận dụng gầm giường và khoảng tủ nhỏ trong phòng trọ.',
		pros: [
			'Nén gọn quần áo trái mùa',
			'Hạn chế bụi và ẩm bên ngoài',
			'Dễ cất dưới gầm giường',
		],
		cons: [
			'Van có thể hở sau thời gian dài',
			'Không nên nén đồ dễ mất phom',
		],
		fit: ['Tủ hoặc gầm giường còn ít chỗ', 'Bạn cần cất quần áo trái mùa'],
	},
} as const;

export default function ProductShow({
	slug,
}: {
	slug: keyof typeof productDetails;
}) {
	const product = productDetails[slug];

	return (
		<div className="gtg-theme min-h-screen bg-[var(--gtg-bg)] pb-24 text-[var(--gtg-text)] md:pb-0">
			<Head title={`${product.name} — Góc Trọ Thông Minh`}>
				<meta
					name="description"
					content={`Review ${product.name} ${product.code}: ưu nhược điểm, giá tham khảo và đối tượng phù hợp.`}
				/>
				<link rel="preconnect" href="https://fonts.bunny.net" />
				<link
					href="https://fonts.bunny.net/css?family=be-vietnam-pro:400,500,600,700"
					rel="stylesheet"
				/>
			</Head>
			<header className="sticky top-0 z-40 border-b border-[var(--gtg-border)] bg-[var(--gtg-bg)]/95 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<BrandLogo />
					<Link
						href="/#products"
						className="flex min-h-11 items-center gap-2 rounded-xl px-3 font-semibold text-[var(--gtg-primary-dark)] hover:bg-[#EAF2EA]"
					>
						<ArrowLeft className="size-4" />
						Sản phẩm
					</Link>
				</div>
			</header>

			<main>
				<div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
					<nav
						aria-label="Breadcrumb"
						className="flex items-center gap-1 text-sm text-[var(--gtg-muted)]"
					>
						<Link href="/">Trang chủ</Link>
						<ChevronRight className="size-4" />
						<Link href="/#products">Sắp xếp phòng</Link>
						<ChevronRight className="size-4" />
						<span className="truncate text-[var(--gtg-text)]">
							{product.code}
						</span>
					</nav>
				</div>

				<section className="mx-auto grid max-w-7xl gap-8 px-4 py-7 sm:px-6 md:grid-cols-2 lg:gap-14 lg:px-8 lg:py-12">
					<div>
						<div className="overflow-hidden rounded-2xl border border-[var(--gtg-border)] bg-white">
							<img
								src={product.image}
								alt={`${product.name} đang được sử dụng thực tế`}
								className="aspect-square w-full object-cover"
								width="800"
								height="800"
								fetchPriority="high"
							/>
						</div>
						<div
							className="mt-3 grid grid-cols-3 gap-3"
							aria-label="Ảnh sản phẩm"
						>
							<button className="overflow-hidden rounded-xl border-2 border-[var(--gtg-primary)]">
								<img
									src={product.image}
									alt={`Xem ảnh ${product.name}`}
									className="aspect-square object-cover"
								/>
							</button>
							<button className="grid aspect-square place-items-center rounded-xl border border-[var(--gtg-border)] bg-white text-sm font-semibold text-[var(--gtg-muted)]">
								Chi tiết keo
							</button>
							<button className="grid aspect-square place-items-center rounded-xl border border-[var(--gtg-border)] bg-white text-sm font-semibold text-[var(--gtg-muted)]">
								Kích thước
							</button>
						</div>
					</div>
					<div className="self-center">
						<div className="flex flex-wrap gap-2">
							<span className="rounded-full bg-[var(--gtg-primary-dark)] px-3 py-1 text-sm font-bold text-white">
								{product.code}
							</span>
							<span className="flex items-center gap-1 rounded-full bg-[var(--gtg-primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--gtg-primary-dark)]">
								<BadgeCheck className="size-4" />
								Đã review thực tế
							</span>
						</div>
						<h1 className="mt-5 text-4xl leading-[1.15] font-bold tracking-[-0.04em] text-[var(--gtg-text)] lg:text-5xl">
							{product.name}
						</h1>
						<p className="mt-4 text-lg leading-8 text-[var(--gtg-text-soft)]">
							{product.summary}
						</p>
						<div className="mt-7 rounded-2xl border border-[var(--gtg-border)] bg-white p-5">
							<p className="text-sm text-[var(--gtg-muted)]">
								Giá tham khảo · Kiểm tra ngày 17/08/2026
							</p>
							<p className="mt-1 text-3xl font-bold text-[var(--gtg-primary-dark)]">
								{product.price}
							</p>
							<p className="mt-2 text-sm text-[var(--gtg-muted)]">
								Seller hiện tại: {product.seller}
							</p>
							<ShopLink
								placement="product_detail"
								productCode={product.code}
								className="mt-5 w-full"
							/>
							<p className="mt-3 text-sm leading-6 text-[var(--gtg-muted)]">
								Bạn sẽ rời Góc Trọ Thông Minh và thanh toán trực
								tiếp trên TikTok Shop. Giá có thể thay đổi tại
								thời điểm bạn xem.
							</p>
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="rounded-2xl border border-[#C8D8CA] bg-white p-5 sm:p-8">
						<p className="text-sm font-bold tracking-[0.12em] text-[var(--gtg-primary)] uppercase">
							Review nhanh
						</p>
						<h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
							Có hợp với phòng của bạn không?
						</h2>
						<div className="mt-7 grid gap-4 sm:grid-cols-2">
							<div className="rounded-2xl bg-[#EEF6EF] p-5">
								<h3 className="flex items-center gap-2 font-bold text-[var(--gtg-primary-dark)]">
									<Check className="size-5" />
									Phù hợp nếu
								</h3>
								<ul className="mt-3 space-y-2 leading-7 text-[#445043]">
									{product.fit.map((item) => (
										<li key={item}>• {item}.</li>
									))}
								</ul>
							</div>
							<div className="rounded-2xl bg-[#FFF3E9] p-5">
								<h3 className="flex items-center gap-2 font-bold text-[#8A4B12]">
									<X className="size-5" />
									Không phù hợp nếu
								</h3>
								<ul className="mt-3 space-y-2 leading-7 text-[#684A31]">
									{product.cons.map((item) => (
										<li key={item}>• {item}.</li>
									))}
								</ul>
							</div>
						</div>
						<div className="mt-5 rounded-xl border-l-4 border-[var(--gtg-accent)] bg-[var(--gtg-bg)] p-4">
							<strong>Kết luận:</strong> Đáng cân nhắc nếu đúng
							nhu cầu; hãy kiểm tra kỹ các điểm lưu ý trước khi
							mua.
						</div>
					</div>
				</section>

				<section className="mx-auto grid max-w-5xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
					<div className="rounded-2xl border border-[#BFD5C2] bg-[var(--gtg-success-surface)] p-6">
						<h2 className="text-2xl font-bold text-[var(--gtg-primary-dark)]">
							Ưu điểm
						</h2>
						<ul className="mt-5 space-y-3">
							{product.pros.map((item) => (
								<li key={item} className="flex gap-3">
									<Check className="mt-0.5 size-5 shrink-0 text-[var(--gtg-success)]" />
									{item}
								</li>
							))}
						</ul>
					</div>
					<div className="rounded-2xl border border-[#E9C9A7] bg-[var(--gtg-warning-surface)] p-6">
						<h2 className="text-2xl font-bold text-[#8A4B12]">
							Điểm cần lưu ý
						</h2>
						<ul className="mt-5 space-y-3">
							{product.cons.map((item) => (
								<li key={item} className="flex gap-3">
									<CircleAlert className="mt-0.5 size-5 shrink-0 text-[var(--gtg-warning-icon)]" />
									{item}
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold tracking-[-0.03em]">
						Video review thật
					</h2>
					<a
						href="https://www.tiktok.com/"
						target="_blank"
						rel="noopener"
						onClick={() =>
							trackGocTroGonEvent('product_review_opened', {
								placement: 'product_detail',
								product_code: product.code,
							})
						}
						className="mt-5 grid overflow-hidden rounded-2xl bg-[var(--gtg-text)] sm:grid-cols-[1fr_1.1fr]"
					>
						<div className="relative">
							<img
								src={product.image}
								alt={`Thumbnail video review ${product.name}`}
								loading="lazy"
								className="aspect-video size-full object-cover opacity-75 sm:aspect-auto"
							/>
							<span className="absolute inset-0 grid place-items-center">
								<span className="grid size-14 place-items-center rounded-full bg-[var(--gtg-accent)] text-[var(--gtg-text)]">
									<Play className="size-6 fill-current" />
								</span>
							</span>
						</div>
						<div className="flex flex-col justify-center p-6 text-white">
							<p className="text-sm text-white/65">
								Video 01 · Review ngày 15/08/2026
							</p>
							<h3 className="mt-2 text-2xl font-bold">
								Review thực tế: {product.name}
							</h3>
							<p className="mt-3 leading-7 text-white/75">
								Xem cách sử dụng, tình huống phù hợp và những
								điểm cần lưu ý trước khi chọn.
							</p>
							<span className="mt-5 font-bold text-[#FFB27D]">
								Xem video review →
							</span>
						</div>
					</a>
				</section>

				<section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold tracking-[-0.03em]">
						Nếu món này chưa hợp
					</h2>
					<p className="mt-2 text-[var(--gtg-muted)]">
						Hai lựa chọn cho nhu cầu khác, không nhất thiết phải mua
						kệ.
					</p>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{alternatives.map((item) => (
							<Link
								key={item.code}
								href="/"
								className="flex gap-4 rounded-2xl border border-[var(--gtg-border)] bg-white p-3 hover:border-[#8AAF90]"
							>
								<img
									src={item.image}
									alt={item.name}
									loading="lazy"
									className="size-28 rounded-xl object-cover"
								/>
								<span className="flex flex-col py-1">
									<span className="text-sm font-bold text-[var(--gtg-primary)]">
										{item.code}
									</span>
									<strong className="mt-1 leading-6">
										{item.name}
									</strong>
									<span className="mt-1 text-sm text-[var(--gtg-muted)]">
										{item.note}
									</span>
									<span className="mt-auto font-bold text-[var(--gtg-primary-dark)]">
										{item.price}
									</span>
								</span>
							</Link>
						))}
					</div>
				</section>
			</main>

			<footer className="border-t border-[var(--gtg-border)] bg-white px-4 py-8 text-center text-sm leading-6 text-[var(--gtg-muted)]">
				Một số liên kết là liên kết tiếp thị liên kết. Bạn không phải
				trả thêm chi phí.
			</footer>
			<div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--gtg-border)] bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
				<ShopLink
					placement="sticky_mobile"
					productCode={product.code}
					className="w-full"
				/>
			</div>
		</div>
	);
}
