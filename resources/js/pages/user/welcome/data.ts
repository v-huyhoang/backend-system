import type { ListingPreview } from '@/components/tro-day/listing-card';
import {
	BedDouble,
	Building2,
	House,
	Layers3,
	UsersRound,
	type LucideIcon,
} from 'lucide-react';

export interface PropertyTypePreview {
	name: string;
	description: string;
	icon: LucideIcon;
}

export const propertyTypes: PropertyTypePreview[] = [
	{
		name: 'Phòng trọ',
		description: 'Gọn gàng, vừa ngân sách',
		icon: Building2,
	},
	{
		name: 'Căn hộ mini',
		description: 'Riêng tư, đủ tiện nghi',
		icon: Layers3,
	},
	{
		name: 'Phòng có gác',
		description: 'Thêm không gian sinh hoạt',
		icon: BedDouble,
	},
	{
		name: 'Nhà nguyên căn',
		description: 'Phù hợp nhóm bạn',
		icon: House,
	},
	{
		name: 'Ký túc xá, ở ghép',
		description: 'Tối ưu chi phí',
		icon: UsersRound,
	},
];

export const latestListings: ListingPreview[] = [
	{
		id: 1,
		title: 'Phòng có gác lửng, cửa sổ thoáng gần khu đại học',
		price: '3.200.000',
		type: 'Phòng có gác',
		location: 'Phường Linh Xuân, TP. Hồ Chí Minh',
		area: '24 m²',
		occupants: 'Tối đa 2',
		highlight: 'Giờ giấc tự do',
		publishedLabel: 'Hôm nay',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGHY8HX2JYLcb6qoE_8IVjyJH08UhUEmnmRhQ5rS1bdtAGUTgVhXPVlCCnu6Xjrk4znUrLgDjx80f1Zr1tprjJh1xeaodwpXUtokVA58VGPSaiQlP6_vpUu7OpYMmQqNz8etUzZz0prPLwhZN6OaoDcmyILZNbjwiZU6nd9rRoCFhuUvczfEz9Dp-ZW_wOneKKuNoFzXHh2_7mgO5zbF2AmMO510dpHMlo5GsYYLgztQ-zEvwYeH6I',
		verified: true,
	},
	{
		id: 2,
		title: 'Studio mini khép kín, ban công cây xanh thoáng mát',
		price: '4.500.000',
		type: 'Căn hộ mini',
		location: 'Phường Cầu Giấy, Hà Nội',
		area: '28 m²',
		occupants: 'Tối đa 2',
		highlight: 'Bếp riêng',
		publishedLabel: 'Hôm qua',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTDHv6p9Nc0wijD4psdQjryFujrW9kCbY4PFMiy5zFCrD0eL48OPV_cKjWlp-wShvdO_NLJCcdkxP6GxTHQp91PajXqbuTQB9VDOqQCH115bf1ExW_kjqBaReKUF-6s2jC9Jhxq9PgaGnOwNhObp6rWPhS289Q5tdzl2sz4lQZ45jAfs8uUme-ZULaiH5clqkoe8vUNfXOl5UaZP42cFJqKqJVNM08sK-0dGiAAhnnCkG5U_I0MWvH',
		verified: true,
	},
	{
		id: 3,
		title: 'Phòng sàn gỗ có cửa sổ lớn và khu bếp riêng',
		price: '3.800.000',
		type: 'Phòng trọ',
		location: 'Phường Bình Thạnh, TP. Hồ Chí Minh',
		area: '22 m²',
		occupants: 'Tối đa 2',
		highlight: 'Có máy lạnh',
		publishedLabel: '2 ngày trước',
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz3L1z1GETwkrJhhYF4qivfvgSs19tGUpSyVq-k-mZMbNaoyRX9fivfZTWptcLUVBQ7eVHKhgtedEiIlXNIIcaUT2jwbwF6UJSdbBKM5us3elOFahjbbZF_zpA2SN-XCSvf0v8Q0vp2qs7nmI2suxMmwvHmlMF7JNg14Gxyx7c1kK29GF-gmo8ZkZRJ2DezmRKKtowi4NpjO9btWtm9LH7JGTElaLK7wkT5Ug3bJ5mzMU3NAhI4q9-',
		verified: false,
	},
];
