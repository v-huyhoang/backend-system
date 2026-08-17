import { ShopLink } from '@/components/goc-tro-gon/shop-link';
import { trackGocTroGonEvent } from '@/lib/goc-tro-gon-analytics';
import { Link } from '@inertiajs/react';
import { BadgeCheck, Check, CircleAlert } from 'lucide-react';

export type ProductSummary = {
	code: string;
	name: string;
	benefit: string;
	caution: string;
	price: string;
	category: string;
	image: string;
	slug: string;
};

export function ProductCard({ product }: { product: ProductSummary }) {
	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--gtg-border)] bg-white shadow-[var(--gtg-shadow-sm)]">
			<Link
				href={`/p/${product.slug}`}
				className="relative block aspect-square overflow-hidden bg-[var(--gtg-collection-kitchen)]"
				onClick={() =>
					trackGocTroGonEvent('product_view', {
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
					<span className="rounded-full bg-[var(--gtg-primary-dark)] px-2.5 py-1 text-sm font-bold text-white">
						{product.code}
					</span>
					<span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-semibold text-[var(--gtg-primary-dark)] shadow-sm">
						<BadgeCheck className="size-4" aria-hidden="true" />
						Đã review
					</span>
				</div>
			</Link>
			<div className="flex flex-1 flex-col p-5">
				<p className="mb-2 text-sm font-medium text-[var(--gtg-muted)]">
					{product.category}
				</p>
				<h3 className="line-clamp-2 text-xl leading-snug font-bold">
					{product.name}
				</h3>
				<div className="mt-4 space-y-2 text-[15px] leading-6">
					<p className="flex gap-2 text-[var(--gtg-primary-dark)]">
						<Check
							className="mt-1 size-4 shrink-0"
							aria-hidden="true"
						/>
						<span>
							<strong>Điểm cộng:</strong> {product.benefit}
						</span>
					</p>
					<p className="flex gap-2 text-[var(--gtg-warning-text)]">
						<CircleAlert
							className="mt-1 size-4 shrink-0"
							aria-hidden="true"
						/>
						<span>
							<strong>Lưu ý:</strong> {product.caution}
						</span>
					</p>
				</div>
				<div className="mt-auto pt-5">
					<p className="text-sm text-[var(--gtg-muted)]">
						Giá tham khảo · Cập nhật hôm nay
					</p>
					<p className="mt-1 text-2xl font-bold text-[var(--gtg-primary-dark)]">
						{product.price}
					</p>
					<div className="mt-4 grid gap-2">
						<Link
							href={`/p/${product.slug}`}
							className="flex min-h-12 items-center justify-center rounded-xl border border-[var(--gtg-primary)] px-4 font-semibold text-[var(--gtg-primary-dark)] hover:bg-[var(--gtg-hover)]"
						>
							Xem review
						</Link>
						<ShopLink
							placement="featured_product"
							productCode={product.code}
						/>
					</div>
					<p className="mt-2 text-sm leading-5 text-[var(--gtg-muted)]">
						Bạn sẽ sang TikTok Shop để xem giá và thanh toán.
					</p>
				</div>
			</div>
		</article>
	);
}
