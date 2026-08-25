import type { ProductSummary } from '@/components/goc-tro-gon/product-card';
import {
	BookOpen,
	CookingPot,
	PackageOpen,
	SprayCan,
	Tags,
} from 'lucide-react';

export const products: ProductSummary[] = [
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

export const categories = [
	'Tất cả',
	'Góc học tập',
	'Sắp xếp phòng',
	'Bếp sinh viên',
	'Vệ sinh',
	'Đồ điện mini',
	'Dưới 100K',
];

export const collections = [
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
