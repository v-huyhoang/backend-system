import { Head, Link } from '@inertiajs/react';
import {
	ArrowRight,
	BadgeCheck,
	Check,
	ChevronRight,
	CircleAlert,
	ExternalLink,
	HeartHandshake,
	Menu,
	Play,
	Search,
	ShieldCheck,
	Sparkles,
	X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Product = {
	code: string;
	name: string;
	benefit: string;
	caution: string;
	price: string;
	category: string;
	image: string;
	slug: string;
};

const products: Product[] = [
	{
		code: 'GTG01',
		name: 'Kệ dán tường không cần khoan',
		benefit: 'Tiết kiệm diện tích',
		caution: 'Không phù hợp tường ẩm',
		price: '89.000đ',
		category: 'Sắp xếp phòng',
		image: '/images/goc-tro-gon/gtg01-wall-shelf.webp',
		slug: 'ke-dan-tuong-khong-can-khoan',
	},
	{
		code: 'GTG02',
		name: 'Hộp đựng dây điện để bàn',
		benefit: 'Giúp bàn học gọn hơn',
		caution: 'Không chứa được ổ điện quá lớn',
		price: '59.000đ',
		category: 'Góc học tập',
		image: '/images/goc-tro-gon/gtg02-cable-box.webp',
		slug: 'hop-dung-day-dien-de-ban',
	},
	{
		code: 'GTG03',
		name: 'Túi hút chân không đựng quần áo',
		benefit: 'Tiết kiệm không gian tủ',
		caution: 'Cần kiểm tra van sau thời gian dài',
		price: '79.000đ',
		category: 'Sắp xếp phòng',
		image: '/images/goc-tro-gon/gtg03-vacuum-bags.webp',
		slug: 'tui-hut-chan-khong-dung-quan-ao',
	},
];

const categories = [
	'Tất cả',
	'Góc học tập',
	'Sắp xếp phòng',
	'Bếp sinh viên',
	'Vệ sinh',
	'Đồ điện mini',
	'Dưới 100K',
];

function track(event: string, data: Record<string, string> = {}) {
	window.dispatchEvent(
		new CustomEvent('gtg:analytics', { detail: { event, ...data } }),
	);
}

function Logo() {
	return (
		<Link
			href="/"
			className="flex items-center gap-2"
			aria-label="Góc Trọ Gọn - Trang chủ"
		>
			<span className="grid size-10 place-items-center rounded-xl bg-[#3A7D44] text-white shadow-sm">
				<Sparkles className="size-5" aria-hidden="true" />
			</span>
			<span className="text-[17px] font-bold tracking-[-0.02em] text-[#285B32]">
				Góc Trọ Gọn
			</span>
		</Link>
	);
}

function ProductCard({ product }: { product: Product }) {
	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E7E4DA] bg-white shadow-[0_8px_30px_rgba(40,91,50,0.07)]">
			<Link
				href={`/p/${product.slug}`}
				className="relative block aspect-square overflow-hidden bg-[#F2EFE6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A7D44]"
				onClick={() =>
					track('product_view', {
						product_code: product.code,
						placement: 'featured_product',
					})
				}
			>
				<img
					src={product.image}
					alt={product.name}
					className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
					loading="lazy"
					width="600"
					height="600"
				/>
				<div className="absolute top-3 left-3 flex flex-wrap gap-2">
					<span className="rounded-full bg-[#285B32] px-2.5 py-1 text-sm font-bold text-white">
						{product.code}
					</span>
					<span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-semibold text-[#285B32] shadow-sm">
						<BadgeCheck className="size-4" />
						Đã review
					</span>
				</div>
			</Link>
			<div className="flex flex-1 flex-col p-5">
				<p className="mb-2 text-sm font-medium text-[#687066]">
					{product.category}
				</p>
				<h3 className="line-clamp-2 text-xl leading-snug font-bold text-[#20241F]">
					{product.name}
				</h3>
				<div className="mt-4 space-y-2 text-[15px] leading-6">
					<p className="flex gap-2 text-[#285B32]">
						<Check className="mt-1 size-4 shrink-0" />
						<span>
							<strong>Điểm cộng:</strong> {product.benefit}
						</span>
					</p>
					<p className="flex gap-2 text-[#6F5217]">
						<CircleAlert className="mt-1 size-4 shrink-0" />
						<span>
							<strong>Lưu ý:</strong> {product.caution}
						</span>
					</p>
				</div>
				<div className="mt-auto pt-5">
					<p className="text-sm text-[#687066]">
						Giá tham khảo · Cập nhật hôm nay
					</p>
					<p className="mt-1 text-2xl font-bold text-[#285B32]">
						{product.price}
					</p>
					<div className="mt-4 grid gap-2">
						<Link
							href={`/p/${product.slug}`}
							className="flex min-h-12 items-center justify-center rounded-xl border border-[#3A7D44] px-4 font-semibold text-[#285B32] hover:bg-[#F0F6F0]"
						>
							Xem review
						</Link>
						<a
							href="https://www.tiktok.com/"
							target="_blank"
							rel="nofollow sponsored noopener"
							onClick={() =>
								track('affiliate_click', {
									product_code: product.code,
									placement: 'featured_product',
								})
							}
							className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF8A3D] px-4 font-bold text-[#20241F] hover:bg-[#F47D31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285B32]"
						>
							Xem giá trên TikTok Shop{' '}
							<ExternalLink className="size-4" />
						</a>
					</div>
					<p className="mt-2 text-sm leading-5 text-[#687066]">
						Bạn sẽ sang TikTok Shop để xem giá và thanh toán.
					</p>
				</div>
			</div>
		</article>
	);
}

export default function Welcome() {
	const [query, setQuery] = useState('');
	const [submittedQuery, setSubmittedQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState('Tất cả');
	const [menuOpen, setMenuOpen] = useState(false);
	const filteredProducts = useMemo(() => {
		const needle = submittedQuery.trim().toLocaleLowerCase('vi');
		return products.filter(
			(product) =>
				(activeCategory === 'Tất cả' ||
					activeCategory === 'Dưới 100K' ||
					product.category === activeCategory) &&
				(!needle ||
					`${product.code} ${product.name} ${product.benefit} ${product.category}`
						.toLocaleLowerCase('vi')
						.includes(needle)),
		);
	}, [activeCategory, submittedQuery]);

	function submitSearch(event: React.FormEvent) {
		event.preventDefault();
		setSubmittedQuery(query);
		track('product_search', { query });
		document
			.querySelector('#products')
			?.scrollIntoView({ behavior: 'smooth' });
	}

	return (
		<div className="min-h-screen bg-[#FFF8E7] font-sans text-[#20241F] selection:bg-[#CFE5D2]">
			<Head title="Góc Trọ Gọn — Đồ hữu ích cho phòng trọ nhỏ">
				<meta
					name="description"
					content="Review thật, có ưu nhược điểm và giá tham khảo cho những món đồ giúp phòng trọ sinh viên gọn hơn."
				/>
				<link rel="preconnect" href="https://fonts.bunny.net" />
				<link
					href="https://fonts.bunny.net/css?family=be-vietnam-pro:400,500,600,700"
					rel="stylesheet"
				/>
			</Head>
			<header className="sticky top-0 z-50 border-b border-[#E7E4DA]/90 bg-[#FFF8E7]/95 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<Logo />
					<nav
						className="hidden items-center gap-8 text-[15px] font-semibold md:flex"
						aria-label="Điều hướng chính"
					>
						<a href="#products" className="hover:text-[#3A7D44]">
							Sản phẩm
						</a>
						<a href="#collections" className="hover:text-[#3A7D44]">
							Bộ sưu tập
						</a>
						<a href="#about" className="hover:text-[#3A7D44]">
							Về chúng mình
						</a>
					</nav>
					<button
						type="button"
						onClick={() => setMenuOpen(!menuOpen)}
						className="grid size-11 place-items-center rounded-xl text-[#285B32] hover:bg-[#EAF2EA] md:hidden"
						aria-expanded={menuOpen}
						aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
					>
						{menuOpen ? <X /> : <Menu />}
					</button>
				</div>
				{menuOpen && (
					<nav className="grid gap-1 border-t border-[#E7E4DA] bg-white px-4 py-3 md:hidden">
						<a
							href="#products"
							onClick={() => setMenuOpen(false)}
							className="rounded-xl px-3 py-3 font-semibold"
						>
							Sản phẩm
						</a>
						<a
							href="#collections"
							onClick={() => setMenuOpen(false)}
							className="rounded-xl px-3 py-3 font-semibold"
						>
							Bộ sưu tập
						</a>
						<a
							href="#about"
							onClick={() => setMenuOpen(false)}
							className="rounded-xl px-3 py-3 font-semibold"
						>
							Về chúng mình
						</a>
					</nav>
				)}
			</header>

			<main>
				<section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-8 pb-10 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
					<div>
						<p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E5F0E6] px-3 py-1.5 text-sm font-semibold text-[#285B32]">
							<HeartHandshake className="size-4" />
							Đồ thật · Review thật · Nói cả điểm trừ
						</p>
						<h1 className="max-w-xl text-[40px] leading-[1.12] font-bold tracking-[-0.04em] text-[#285B32] sm:text-5xl lg:text-6xl">
							Phòng nhỏ vẫn có thể sống gọn.
						</h1>
						<p className="mt-5 max-w-xl text-lg leading-8 text-[#596157]">
							Những món đồ hữu ích cho phòng trọ sinh viên — có
							review, có nhược điểm và có giá tham khảo.
						</p>
						<a
							href="#products"
							className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#3A7D44] px-5 font-bold text-white hover:bg-[#285B32]"
						>
							Khám phá sản phẩm <ArrowRight className="size-4" />
						</a>
					</div>
					<div className="relative overflow-hidden rounded-2xl bg-[#E7E4DA] shadow-[0_16px_50px_rgba(40,91,50,0.12)]">
						<img
							src="/images/goc-tro-gon/hero-room.webp"
							alt="Góc học tập gọn gàng trong một phòng trọ nhỏ"
							className="aspect-[4/3] w-full object-cover"
							width="900"
							height="600"
							fetchPriority="high"
						/>
						<div className="absolute right-3 bottom-3 left-3 rounded-xl bg-white/95 p-3 shadow-sm">
							<p className="text-sm font-semibold text-[#285B32]">
								Gọn vừa đủ, không cần mua quá nhiều.
							</p>
						</div>
					</div>
				</section>

				<section
					className="mx-auto max-w-4xl px-4 pb-8 sm:px-6"
					aria-labelledby="search-heading"
				>
					<div className="rounded-2xl border border-[#D7DDCF] bg-white p-5 shadow-[0_12px_40px_rgba(40,91,50,0.09)] sm:p-7">
						<div className="flex items-start gap-3">
							<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E5F0E6] text-[#285B32]">
								<Search className="size-5" />
							</span>
							<div>
								<h2
									id="search-heading"
									className="text-2xl font-bold tracking-[-0.02em]"
								>
									Bạn đang tìm món nào trong video?
								</h2>
								<p className="mt-1 text-[15px] leading-6 text-[#687066]">
									Mã sản phẩm được hiển thị trong video TikTok
									của Góc Trọ Gọn.
								</p>
							</div>
						</div>
						<form
							onSubmit={submitSearch}
							className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"
							role="search"
						>
							<label htmlFor="product-search" className="sr-only">
								Tìm theo mã, tên hoặc nhu cầu
							</label>
							<input
								id="product-search"
								value={query}
								onChange={(event) =>
									setQuery(event.target.value)
								}
								placeholder="Nhập mã sản phẩm, ví dụ GTG01"
								className="min-h-12 rounded-xl border border-[#C8CEC4] bg-white px-4 text-base outline-none placeholder:text-[#7A8277] focus:border-[#3A7D44] focus:ring-3 focus:ring-[#3A7D44]/15"
							/>
							<button className="min-h-12 rounded-xl bg-[#3A7D44] px-6 font-bold text-white hover:bg-[#285B32]">
								Tìm sản phẩm
							</button>
						</form>
					</div>
				</section>

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div
						className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0"
						aria-label="Danh mục sản phẩm"
					>
						{categories.map((category) => (
							<button
								key={category}
								type="button"
								onClick={() => {
									setActiveCategory(category);
									track('category_selected', { category });
								}}
								aria-pressed={activeCategory === category}
								className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${activeCategory === category ? 'border-[#3A7D44] bg-[#3A7D44] text-white' : 'border-[#D7D8CF] bg-white text-[#3F473E] hover:border-[#3A7D44]'}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				<section
					id="products"
					className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
				>
					<div className="mb-7 flex items-end justify-between gap-4">
						<div>
							<p className="text-sm font-bold tracking-[0.12em] text-[#3A7D44] uppercase">
								Đã xem và chọn lọc
							</p>
							<h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
								Mới được Góc Trọ Gọn review
							</h2>
						</div>
						<span className="hidden text-sm text-[#687066] sm:block">
							{filteredProducts.length} sản phẩm
						</span>
					</div>
					{filteredProducts.length > 0 ? (
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{filteredProducts.map((product) => (
								<ProductCard
									key={product.code}
									product={product}
								/>
							))}
						</div>
					) : (
						<div className="rounded-2xl border border-dashed border-[#C9CEC4] bg-white px-5 py-12 text-center">
							<Search className="mx-auto size-9 text-[#687066]" />
							<h3 className="mt-4 text-xl font-bold">
								Không tìm thấy “{submittedQuery}”
							</h3>
							<p className="mx-auto mt-2 max-w-lg leading-7 text-[#687066]">
								Hãy kiểm tra lại mã trong video hoặc thử tìm
								theo tên sản phẩm, ví dụ “kệ”, “dây điện”.
							</p>
							<button
								onClick={() => {
									setQuery('');
									setSubmittedQuery('');
									setActiveCategory('Tất cả');
								}}
								className="mt-5 min-h-12 rounded-xl border border-[#3A7D44] px-5 font-bold text-[#285B32]"
							>
								Xem tất cả sản phẩm
							</button>
						</div>
					)}
				</section>

				<section id="collections" className="bg-white py-14">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<p className="text-sm font-bold tracking-[0.12em] text-[#3A7D44] uppercase">
							Chọn theo nhu cầu
						</p>
						<h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
							Bắt đầu từ căn phòng của bạn
						</h2>
						<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
							{[
								[
									'Setup bàn học dưới 300K',
									'6 món dễ bắt đầu',
									'🪴',
								],
								[
									'Đồ cần có khi mới chuyển trọ',
									'9 món thiết thực',
									'📦',
								],
								[
									'Làm gọn góc bếp nhỏ',
									'7 món tiết kiệm chỗ',
									'🥣',
								],
								[
									'Dọn phòng trong 15 phút',
									'5 món đỡ tốn sức',
									'🧹',
								],
								[
									'Sản phẩm dưới 100K',
									'12 món vừa túi tiền',
									'🏷️',
								],
							].map(([title, description, icon]) => (
								<a
									key={title}
									href="#products"
									onClick={() =>
										track('collection_opened', {
											collection: title,
										})
									}
									className="group rounded-2xl border border-[#E7E4DA] bg-[#FFF8E7] p-5 hover:border-[#8AAF90]"
								>
									<span
										className="text-3xl"
										aria-hidden="true"
									>
										{icon}
									</span>
									<h3 className="mt-8 leading-6 font-bold">
										{title}
									</h3>
									<p className="mt-2 text-sm text-[#687066]">
										{description}
									</p>
									<span className="mt-4 flex items-center gap-1 text-sm font-bold text-[#285B32]">
										Xem bộ sưu tập{' '}
										<ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
									</span>
								</a>
							))}
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold tracking-[-0.03em]">
						Bạn đang vướng chuyện gì trong phòng?
					</h2>
					<div className="mt-6 flex flex-wrap gap-3">
						{[
							'Phòng thiếu chỗ chứa đồ',
							'Bàn học thường xuyên bừa bộn',
							'Bếp nhỏ khó sắp xếp',
							'Phòng dễ bám bụi',
							'Không được khoan tường',
						].map((problem) => (
							<button
								key={problem}
								className="min-h-12 rounded-xl border border-[#D7D8CF] bg-white px-4 text-left font-semibold hover:border-[#3A7D44] hover:bg-[#F0F6F0]"
							>
								{problem}{' '}
								<ArrowRight className="ml-2 inline size-4" />
							</button>
						))}
					</div>
				</section>

				<section id="about" className="bg-[#285B32] py-14 text-white">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<p className="text-sm font-bold tracking-[0.12em] text-[#CFE5D2] uppercase">
							Cam kết review
						</p>
						<h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-[-0.03em]">
							Góc Trọ Gọn chọn sản phẩm như thế nào?
						</h2>
						<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
							{[
								[ShieldCheck, 'Hợp không gian nhỏ'],
								[HeartHandshake, 'Giá hợp lý cho sinh viên'],
								[CircleAlert, 'Nói rõ cả ưu và nhược'],
								[BadgeCheck, 'Không giả kết quả sử dụng'],
								[Check, 'Kiểm tra giá và link định kỳ'],
							].map(([Icon, label]) => {
								const IconComponent = Icon as typeof Check;
								return (
									<div
										key={label as string}
										className="rounded-2xl bg-white/10 p-5"
									>
										<IconComponent className="size-6 text-[#FFB27D]" />
										<p className="mt-4 leading-6 font-semibold">
											{label as string}
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
					<p className="text-sm font-bold tracking-[0.12em] text-[#3A7D44] uppercase">
						TikTok gần đây
					</p>
					<h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
						Xem cách chúng mình dùng sản phẩm
					</h2>
					<div className="mt-7 grid gap-4 sm:grid-cols-3">
						{products.map((product, index) => (
							<a
								key={product.code}
								href="https://www.tiktok.com/"
								target="_blank"
								rel="noopener"
								onClick={() =>
									track('tiktok_video_opened', {
										product_code: product.code,
									})
								}
								className="group relative overflow-hidden rounded-2xl bg-[#20241F]"
							>
								<img
									src={product.image}
									alt=""
									loading="lazy"
									className="aspect-[4/5] w-full object-cover opacity-75 transition group-hover:scale-[1.02]"
								/>
								<span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-bold text-[#285B32]">
									Video 0{index + 1}
								</span>
								<span className="absolute inset-x-4 bottom-4 rounded-xl bg-[#20241F]/90 p-4 text-white">
									<span className="flex items-center gap-2 font-bold">
										<span className="grid size-9 place-items-center rounded-full bg-[#FF8A3D] text-[#20241F]">
											<Play className="size-4 fill-current" />
										</span>
										{product.name}
									</span>
									<span className="mt-2 block text-sm text-white/75">
										Sản phẩm {product.code}
									</span>
								</span>
							</a>
						))}
					</div>
				</section>
			</main>

			<footer className="border-t border-[#DAD8CE] bg-white">
				<div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
					<div>
						<Logo />
						<p className="mt-4 max-w-md leading-7 text-[#687066]">
							Một người bạn giúp bạn chọn ít hơn, nhưng đúng hơn
							cho căn phòng trọ nhỏ.
						</p>
					</div>
					<div>
						<h2 className="font-bold">Kết nối</h2>
						<div className="mt-3 grid gap-2 text-[#687066]">
							<a href="mailto:hello@goctrogon.vn">
								hello@goctrogon.vn
							</a>
							<a
								href="https://www.tiktok.com/"
								target="_blank"
								rel="noopener"
							>
								TikTok Góc Trọ Gọn
							</a>
							<a href="#">Chính sách quyền riêng tư</a>
						</div>
					</div>
					<div>
						<h2 className="font-bold">Minh bạch liên kết</h2>
						<p className="mt-3 text-sm leading-6 text-[#687066]">
							Một số liên kết trên trang là liên kết tiếp thị liên
							kết. Góc Trọ Gọn có thể nhận hoa hồng nếu bạn mua
							hàng qua liên kết, nhưng bạn không phải trả thêm chi
							phí.
						</p>
					</div>
				</div>
				<div className="border-t border-[#E7E4DA] px-4 py-5 text-center text-sm text-[#687066]">
					Nội dung cập nhật ngày 17/08/2026 · © Góc Trọ Gọn
				</div>
			</footer>
		</div>
	);
}
