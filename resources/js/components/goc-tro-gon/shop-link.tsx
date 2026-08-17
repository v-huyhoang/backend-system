import { trackGocTroGonEvent } from '@/lib/goc-tro-gon-analytics';
import { ExternalLink } from 'lucide-react';

type ShopLinkProps = {
	placement: string;
	productCode: string;
	className?: string;
	compact?: boolean;
};

export function ShopLink({
	placement,
	productCode,
	className = '',
	compact = false,
}: ShopLinkProps) {
	return (
		<a
			href="https://www.tiktok.com/"
			target="_blank"
			rel="nofollow sponsored noopener"
			onClick={() =>
				trackGocTroGonEvent('affiliate_click', {
					product_code: productCode,
					placement,
				})
			}
			className={`flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-accent)] px-5 font-bold text-[var(--gtg-text)] hover:bg-[var(--gtg-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gtg-primary-dark)] ${className}`}
		>
			{compact ? 'Xem giá trên TikTok Shop' : 'Xem giá trên TikTok Shop'}
			<ExternalLink className="size-4" aria-hidden="true" />
		</a>
	);
}
