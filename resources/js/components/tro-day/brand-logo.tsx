import { Link } from '@inertiajs/react';

const logoSrc = '/images/tro-day/brand/logo-horizontal.png';

export function BrandLogo({ className = '' }: { className?: string }) {
	return (
		<Link
			href="/"
			className={`inline-flex shrink-0 items-center gap-2 ${className}`}
			aria-label="Trọ Đây - Trang chủ"
		>
			<img
				src={logoSrc}
				alt=""
				className="h-9 w-auto object-contain sm:h-10"
				width="171"
				height="40"
			/>
		</Link>
	);
}
