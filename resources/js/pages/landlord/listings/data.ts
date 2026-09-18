import type {
	LandlordListing,
	LandlordListingStat,
} from '@/types/landlord-listings';

export const landlordListingStats: LandlordListingStat[] = [
	{
		label: 'Tin hoạt động',
		value: '02',
		description: 'đang hiển thị',
		icon: 'home',
	},
	{
		label: 'Lượt xem tuần này',
		value: '384',
		description: 'trên các tin đang hoạt động',
		icon: 'chart',
	},
	{
		label: 'Cuộc gọi & Zalo',
		value: '19',
		description: 'khách đã chủ động liên hệ',
		icon: 'phone',
	},
	{
		label: 'Cần xử lý',
		value: '01',
		description: 'tin cần bổ sung thông tin',
		icon: 'alert',
	},
];

export const landlordListings: LandlordListing[] = [
	{
		publicId: 'GTG-7081',
		title: 'Phòng có gác lửng cao, cửa sổ thoáng gần làng ĐHQG',
		address: 'Hẻm 48 Đường số 6, Phường Linh Xuân, TP. Hồ Chí Minh',
		monthlyRent: '3.200.000đ',
		area: '24 m²',
		image: '/images/tro-day/listings/room-1.jpg',
		status: 'published',
		statusLabel: 'Đang hiển thị',
		meta: 'Điện: 3.500đ/kWh · Nước: 20.000đ/m³',
		expiresLabel: 'Hết hạn: 28 ngày nữa',
	},
	{
		publicId: 'GTG-6520',
		title: 'Phòng trọ giá rẻ cho sinh viên hẻm đường D2',
		address: 'Hẻm 125 Nguyễn Gia Trí, Phường Thạnh Mỹ Tây, TP. Hồ Chí Minh',
		monthlyRent: '2.500.000đ',
		area: '18 m²',
		image: '/images/tro-day/listings/room-2.jpg',
		status: 'rejected',
		statusLabel: 'Cần bổ sung thông tin',
		meta: 'Vui lòng cập nhật trước 48 giờ',
		rejectionReason:
			'Ảnh tải lên chưa rõ và thiếu ảnh nhà vệ sinh; biểu phí điện nước cần ghi đơn giá cụ thể.',
	},
	{
		publicId: 'GTG-8812',
		title: 'Studio mini có ban công cây xanh thoáng mát',
		address: 'Hẻm 214 Huỳnh Tấn Phát, Phường Tân Thuận, TP. Hồ Chí Minh',
		monthlyRent: '4.500.000đ',
		area: '30 m²',
		image: '/images/tro-day/listings/room-3.jpg',
		status: 'pending_review',
		statusLabel: 'Chờ kiểm duyệt',
		meta: 'Gửi lúc 09:30 sáng nay',
	},
];
