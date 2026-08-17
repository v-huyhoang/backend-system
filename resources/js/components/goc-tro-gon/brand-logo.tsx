import { Link } from '@inertiajs/react';

const iconSrc = '/images/goc-tro-gon/goc-tro-thong-minh-icon.webp';

export function BrandLogo({ className = '' }: { className?: string }) {
	return (
		<Link
			href="/"
			className={`inline-flex shrink-0 items-center gap-2 ${className}`}
			aria-label="Góc Trọ Thông Minh - Trang chủ"
		>
			<img
				src={iconSrc}
				alt=""
				className="size-10 rounded-xl object-contain shadow-sm"
				width="40"
				height="40"
			/>
			<span className="text-sm font-bold tracking-[-0.02em] whitespace-nowrap text-[var(--gtg-primary-dark)] sm:text-[17px]">
				Góc Trọ Thông Minh
			</span>
		</Link>
	);
}
