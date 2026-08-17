import { BrandLogo } from '@/components/goc-tro-gon/brand-logo';
import {
	ProductCard,
	type ProductSummary,
} from '@/components/goc-tro-gon/product-card';
import { trackGocTroGonEvent } from '@/lib/goc-tro-gon-analytics';
import { Head } from '@inertiajs/react';
import {
	ArrowRight,
	BadgeCheck,
	BookOpen,
	Boxes,
	Check,
	ChevronRight,
	CircleAlert,
	CookingPot,
	HeartHandshake,
	Menu,
	PackageOpen,
	Play,
	Search,
	ShieldCheck,
	SprayCan,
	Tags,
	X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const products: ProductSummary[] = [
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

const collections = [
	{
		title: 'Setup bàn học dưới 300K',
		description: '6 món dễ bắt đầu',
		icon: BookOpen,
		tone: 'bg-[var(--gtg-collection-study)]',
	},
	{
		title: 'Đồ cần có khi mới chuyển trọ',
		description: '9 món thiết thực',
		icon: PackageOpen,
		tone: 'bg-[var(--gtg-collection-move)]',
	},
	{
		title: 'Làm gọn góc bếp nhỏ',
		description: '7 món tiết kiệm chỗ',
		icon: CookingPot,
		tone: 'bg-[var(--gtg-collection-kitchen)]',
	},
	{
		title: 'Dọn phòng trong 15 phút',
		description: '5 món đỡ tốn sức',
		icon: SprayCan,
		tone: 'bg-[var(--gtg-collection-clean)]',
	},
	{
		title: 'Sản phẩm dưới 100K',
		description: '12 món vừa túi tiền',
		icon: Tags,
		tone: 'bg-[var(--gtg-collection-budget)]',
	},
];

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
	const suggestions = useMemo(() => {
		const needle = query.trim().toLocaleLowerCase('vi');
		if (!needle || query === submittedQuery) return [];

		return products
			.filter((product) =>
				`${product.code} ${product.name} ${product.benefit}`
					.toLocaleLowerCase('vi')
					.includes(needle),
			)
			.slice(0, 3);
	}, [query, submittedQuery]);

	function submitSearch(event: React.FormEvent) {
		event.preventDefault();
		setSubmittedQuery(query);
		trackGocTroGonEvent('product_search', { query });
		document
			.querySelector('#products')
			?.scrollIntoView({ behavior: 'smooth' });
	}

	return (
		<div className="gtg-theme min-h-screen bg-[var(--gtg-bg)] text-[var(--gtg-text)] selection:bg-[var(--gtg-selection)]">
			<a
				href="#main-content"
				className="fixed top-2 left-2 z-[100] -translate-y-20 rounded-lg bg-[var(--gtg-primary-dark)] px-4 py-3 font-bold text-white transition-transform focus:translate-y-0"
			>
				Bỏ qua đến nội dung chính
			</a>
			<Head title="Góc Trọ Thông Minh — Đồ hữu ích cho phòng trọ nhỏ">
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
			<header className="sticky top-0 z-50 border-b border-[var(--gtg-border)]/90 bg-[var(--gtg-bg)]/95 backdrop-blur-sm">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<BrandLogo />
					<nav
						className="hidden items-center gap-8 text-[15px] font-semibold md:flex"
						aria-label="Điều hướng chính"
					>
						<a
							href="#products"
							className="hover:text-[var(--gtg-primary)]"
						>
							Sản phẩm
						</a>
						<a
							href="#collections"
							className="hover:text-[var(--gtg-primary)]"
						>
							Bộ sưu tập
						</a>
						<a
							href="#about"
							className="hover:text-[var(--gtg-primary)]"
						>
							Về chúng mình
						</a>
					</nav>
					<button
						type="button"
						onClick={() => setMenuOpen(!menuOpen)}
						className="grid size-11 place-items-center rounded-xl text-[var(--gtg-primary-dark)] hover:bg-[#EAF2EA] md:hidden"
						aria-expanded={menuOpen}
						aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
					>
						{menuOpen ? <X /> : <Menu />}
					</button>
				</div>
				{menuOpen && (
					<nav className="grid gap-1 border-t border-[var(--gtg-border)] bg-white px-4 py-3 md:hidden">
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

			<main id="main-content" className="gtg-anchor" tabIndex={-1}>
				<section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pt-8 pb-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:py-16 lg:gap-14 lg:px-8">
					<div>
						<p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--gtg-primary-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--gtg-primary-dark)]">
							<HeartHandshake
								className="size-4"
								aria-hidden="true"
							/>
							Đồ thật · Review thật · Nói cả điểm trừ
						</p>
						<h1 className="max-w-xl text-[40px] leading-[1.2] font-bold tracking-[-0.04em] text-[var(--gtg-primary-dark)] sm:text-5xl lg:text-6xl">
							Phòng nhỏ vẫn có thể sống gọn.
						</h1>
						<p className="mt-5 max-w-xl text-lg leading-8 text-[var(--gtg-text-soft)]">
							Những món đồ hữu ích cho phòng trọ sinh viên — có
							review, có nhược điểm và có giá tham khảo.
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

				<section
					className="mx-auto max-w-4xl px-4 pb-8 sm:px-6"
					aria-labelledby="search-heading"
				>
					<div className="rounded-2xl border border-[var(--gtg-border)] bg-white p-5 shadow-[0_12px_40px_rgba(40,91,50,0.09)] sm:p-7">
						<div className="flex items-start gap-3">
							<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]">
								<Search className="size-5" aria-hidden="true" />
							</span>
							<div>
								<h2
									id="search-heading"
									className="text-2xl font-bold tracking-[-0.02em]"
								>
									Bạn đang tìm món nào trong video?
								</h2>
								<p className="mt-1 text-[15px] leading-6 text-[var(--gtg-muted)]">
									Mã sản phẩm được hiển thị trong video TikTok
									của Góc Trọ Thông Minh.
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
							<div className="relative">
								<input
									id="product-search"
									value={query}
									onChange={(event) =>
										setQuery(event.target.value)
									}
									placeholder="Nhập mã sản phẩm, ví dụ GTG01"
									autoComplete="off"
									aria-controls="product-suggestions"
									aria-expanded={suggestions.length > 0}
									className="min-h-12 w-full rounded-xl border border-[var(--gtg-border-strong)] bg-white px-4 text-base outline-none placeholder:text-[#7A8277] focus:border-[var(--gtg-primary)] focus:ring-3 focus:ring-[var(--gtg-primary)]/15"
								/>
								{suggestions.length > 0 && (
									<ul
										id="product-suggestions"
										className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-20 overflow-hidden rounded-xl border border-[var(--gtg-border)] bg-white p-1 shadow-[var(--gtg-shadow-md)]"
									>
										{suggestions.map((product) => (
											<li key={product.code}>
												<button
													type="button"
													onClick={() => {
														setQuery(product.code);
														setSubmittedQuery(
															product.code,
														);
														trackGocTroGonEvent(
															'product_search',
															{
																query: product.code,
															},
														);
														document
															.querySelector(
																'#products',
															)
															?.scrollIntoView({
																behavior:
																	'smooth',
															});
													}}
													className="flex min-h-12 w-full items-center gap-3 rounded-lg px-3 text-left hover:bg-[var(--gtg-primary-soft)]"
												>
													<span className="rounded-md bg-[var(--gtg-primary-dark)] px-2 py-1 text-xs font-bold text-white">
														{product.code}
													</span>
													<span className="text-sm font-semibold">
														{product.name}
													</span>
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
							<button className="min-h-12 rounded-xl bg-[var(--gtg-primary)] px-6 font-bold text-white hover:bg-[var(--gtg-primary-dark)]">
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
									trackGocTroGonEvent('category_selected', {
										category,
									});
								}}
								aria-pressed={activeCategory === category}
								className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${activeCategory === category ? 'border-[var(--gtg-primary)] bg-[var(--gtg-primary)] text-white' : 'border-[var(--gtg-border)] bg-white text-[#3F473E] hover:border-[var(--gtg-primary)]'}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
					<div className="mb-7 flex items-end justify-between gap-4">
						<div id="products" className="gtg-anchor">
							<p className="text-sm font-bold tracking-[0.12em] text-[var(--gtg-primary)] uppercase">
								Đã xem và chọn lọc
							</p>
							<h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
								Mới được Góc Trọ Thông Minh review
							</h2>
						</div>
						<span className="hidden text-sm text-[var(--gtg-muted)] sm:block">
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
						<div className="rounded-2xl border border-dashed border-[var(--gtg-border-strong)] bg-white px-5 py-12 text-center">
							<Search className="mx-auto size-9 text-[var(--gtg-muted)]" />
							<h3 className="mt-4 text-xl font-bold">
								Không tìm thấy “{submittedQuery}”
							</h3>
							<p className="mx-auto mt-2 max-w-lg leading-7 text-[var(--gtg-muted)]">
								Hãy kiểm tra lại mã trong video hoặc thử tìm
								theo tên sản phẩm, ví dụ “kệ”, “dây điện”.
							</p>
							<button
								onClick={() => {
									setQuery('');
									setSubmittedQuery('');
									setActiveCategory('Tất cả');
								}}
								className="mt-5 min-h-12 rounded-xl border border-[var(--gtg-primary)] px-5 font-bold text-[var(--gtg-primary-dark)]"
							>
								Xem tất cả sản phẩm
							</button>
						</div>
					)}
				</section>

				<section className="bg-white py-14">
					<div
						id="collections"
						className="gtg-anchor mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
					>
						<p className="text-sm font-bold tracking-[0.12em] text-[var(--gtg-primary)] uppercase">
							Chọn theo nhu cầu
						</p>
						<h2 className="mt-2 text-3xl font-bold tracking-[-0.03em]">
							Bắt đầu từ căn phòng của bạn
						</h2>
						<div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
							{collections.map(
								(
									{ title, description, icon: Icon, tone },
									index,
								) => (
									<a
										key={title}
										href="#products"
										onClick={() =>
											trackGocTroGonEvent(
												'collection_opened',
												{
													collection: title,
												},
											)
										}
										className={`group rounded-2xl border border-[var(--gtg-border)] p-5 transition-colors hover:border-[#8AAF90] ${tone} ${index < 2 ? 'lg:col-span-2' : index === 2 ? 'lg:col-span-2' : 'lg:col-span-3'}`}
									>
										<span className="grid size-11 place-items-center rounded-xl bg-white text-[var(--gtg-primary-dark)] shadow-sm">
											<Icon
												className="size-5"
												aria-hidden="true"
											/>
										</span>
										<h3 className="mt-7 text-lg leading-7 font-bold">
											{title}
										</h3>
										<p className="mt-2 text-sm text-[var(--gtg-muted)]">
											{description}
										</p>
										<span className="mt-4 flex items-center gap-1 text-sm font-bold text-[var(--gtg-primary-dark)]">
											Xem bộ sưu tập{' '}
											<ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
										</span>
									</a>
								),
							)}
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
								className="min-h-12 rounded-xl border border-[var(--gtg-border)] bg-white px-4 text-left font-semibold hover:border-[var(--gtg-primary)] hover:bg-[var(--gtg-hover)]"
							>
								{problem}{' '}
								<ArrowRight className="ml-2 inline size-4" />
							</button>
						))}
					</div>
				</section>

				<section className="bg-[var(--gtg-primary-dark)] py-14 text-white">
					<div
						id="about"
						className="gtg-anchor mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
					>
						<p className="text-sm font-bold tracking-[0.12em] text-[var(--gtg-selection)] uppercase">
							Cam kết review
						</p>
						<h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-[-0.03em]">
							Góc Trọ Thông Minh chọn sản phẩm như thế nào?
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
					<p className="text-sm font-bold tracking-[0.12em] text-[var(--gtg-primary)] uppercase">
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
									trackGocTroGonEvent('tiktok_video_opened', {
										product_code: product.code,
									})
								}
								className="group relative overflow-hidden rounded-2xl bg-[var(--gtg-text)]"
							>
								<img
									src={product.image}
									alt=""
									loading="lazy"
									className="aspect-[4/5] w-full object-cover opacity-75 transition group-hover:scale-[1.02]"
								/>
								<span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-bold text-[var(--gtg-primary-dark)]">
									Video 0{index + 1}
								</span>
								<span className="absolute inset-x-4 bottom-4 rounded-xl bg-[var(--gtg-text)]/90 p-4 text-white">
									<span className="flex items-center gap-2 font-bold">
										<span className="grid size-9 place-items-center rounded-full bg-[var(--gtg-accent)] text-[var(--gtg-text)]">
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

			<footer className="border-t border-[var(--gtg-border)] bg-white">
				<div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
					<div>
						<BrandLogo />
						<p className="mt-4 max-w-md leading-7 text-[var(--gtg-muted)]">
							Một người bạn giúp bạn chọn ít hơn, nhưng đúng hơn
							cho căn phòng trọ nhỏ.
						</p>
					</div>
					<div>
						<h2 className="font-bold">Kết nối</h2>
						<div className="mt-3 grid gap-2 text-[var(--gtg-muted)]">
							<a href="mailto:hello@goctrogon.vn">
								hello@goctrogon.vn
							</a>
							<a
								href="https://www.tiktok.com/"
								target="_blank"
								rel="noopener"
							>
								TikTok Góc Trọ Thông Minh
							</a>
							<a href="#">Chính sách quyền riêng tư</a>
						</div>
					</div>
					<div>
						<h2 className="font-bold">Minh bạch liên kết</h2>
						<p className="mt-3 text-sm leading-6 text-[var(--gtg-muted)]">
							Một số liên kết trên trang là liên kết tiếp thị liên
							kết. Góc Trọ Thông Minh có thể nhận hoa hồng nếu bạn
							mua hàng qua liên kết, nhưng bạn không phải trả thêm
							chi phí.
						</p>
					</div>
				</div>
				<div className="border-t border-[var(--gtg-border)] px-4 py-5 text-center text-sm text-[var(--gtg-muted)]">
					Nội dung cập nhật ngày 17/08/2026 · © Góc Trọ Thông Minh
				</div>
			</footer>
		</div>
	);
}
