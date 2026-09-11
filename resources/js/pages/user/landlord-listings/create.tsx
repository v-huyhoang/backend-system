import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import {
	SearchableSelect,
	type SearchableSelectOption,
} from '@/components/tro-day/searchable-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head } from '@inertiajs/react';
import {
	Building2,
	CalendarDays,
	Camera,
	MapPin,
	Phone,
	ReceiptText,
	Ruler,
	Sparkles,
	Upload,
} from 'lucide-react';
import { useState } from 'react';

const types = [
	'Phòng trọ có gác',
	'Căn hộ mini / Studio',
	'Phòng trọ khép kín',
	'Ở ghép',
];
const amenities = [
	'Máy lạnh',
	'Máy giặt riêng',
	'Bếp riêng',
	'Thang máy',
	'Camera an ninh',
	'Giờ giấc tự do',
	'Chỗ để xe',
	'Ban công',
];
export default function CreateLandlordListing() {
	const [type, setType] = useState(types[0]);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
		'Máy lạnh',
		'Giờ giấc tự do',
	]);
	const toggle = (amenity: string) =>
		setSelectedAmenities((items) =>
			items.includes(amenity)
				? items.filter((item) => item !== amenity)
				: [...items, amenity],
		);
	return (
		<div className="gtg-theme flex min-h-screen flex-col bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Đăng phòng mới | Trọ Đây" />
			<PublicHeader />
			<main className="flex-1 pt-16">
				<div className="mx-auto max-w-[960px] px-4 py-8 md:px-6 lg:py-12">
					<p className="text-sm font-bold tracking-wider text-[var(--gtg-accent)] uppercase">
						Dành cho chủ trọ
					</p>
					<h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--gtg-primary)] sm:text-4xl">
						Đăng tin phòng trọ
					</h1>
					<p className="mt-3 max-w-2xl text-[var(--gtg-muted)]">
						Thông tin càng chính xác, phòng càng dễ tìm được người
						thuê phù hợp và được duyệt nhanh hơn.
					</p>
					<div
						className="mt-7 flex gap-2 overflow-x-auto"
						aria-label="Tiến trình đăng tin"
					>
						{[
							'Thông tin cơ bản',
							'Địa chỉ',
							'Giá & chi phí',
							'Tiện ích',
							'Hình ảnh',
							'Liên hệ',
						].map((step, index) => (
							<div
								key={step}
								className="flex shrink-0 items-center gap-2 text-sm font-semibold"
							>
								<span
									className={`grid size-7 place-items-center rounded-full ${index === 0 ? 'bg-[var(--gtg-primary)] text-white' : 'bg-white text-[var(--gtg-muted)]'}`}
								>
									{index + 1}
								</span>
								{step}
							</div>
						))}
					</div>
					<form
						className="mt-8 space-y-6"
						onSubmit={(event) => event.preventDefault()}
					>
						<Section
							icon={Building2}
							title="Loại hình & tiêu đề bài đăng"
						>
							<div className="mb-3 grid gap-3 sm:grid-cols-2">
								{types.map((item) => (
									<button
										key={item}
										type="button"
										onClick={() => setType(item)}
										className={`min-h-24 rounded-xl border p-4 text-left ${type === item ? 'border-[var(--gtg-primary)] bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]' : 'border-[var(--gtg-border)] bg-[var(--gtg-surface-low)] hover:border-[var(--gtg-primary)]'}`}
									>
										<strong>{item}</strong>
										<span className="mt-1 block text-sm text-[var(--gtg-muted)]">
											Chọn loại hình phù hợp nhất với
											phòng của bạn.
										</span>
									</button>
								))}
							</div>
							<Field
								label="Tiêu đề tin đăng"
								placeholder="Ví dụ: Phòng gác lửng 24m², ban công thoáng"
							/>
							<p className="mt-2 flex items-center gap-1 text-xs text-[var(--gtg-muted)]">
								Nêu bật đặc điểm thật; không viết in hoa toàn bộ
								tiêu đề.
							</p>
						</Section>
						<Section
							icon={MapPin}
							title="Địa chỉ & vị trí phòng trọ"
						>
							<div className="grid gap-4 md:grid-cols-3">
								<Select
									label="Tỉnh / Thành phố"
									options={[
										'TP. Hồ Chí Minh',
										'Hà Nội',
										'Đà Nẵng',
									]}
								/>
								<Select
									label="Khu vực / Phường xã"
									options={[
										'Phường Linh Xuân',
										'Phường Linh Trung',
										'Phường Tăng Nhơn Phú',
									]}
								/>
								<Field
									label="Số nhà, ngõ/hẻm, tên đường"
									placeholder="Ví dụ: 124/8A Đường Hoàng Diệu 2"
								/>
							</div>
							<div className="mt-4 rounded-lg border border-[var(--gtg-border)] bg-[var(--gtg-surface-low)] px-4 py-3 text-sm text-[var(--gtg-muted)]">
								Gợi ý chỉ dẫn: đầu hẻm có biển hiệu dễ nhận
								biết, xe máy có thể vào tận cửa.
							</div>
						</Section>
						<Section
							icon={ReceiptText}
							title="Giá thuê và tiền cọc"
						>
							<div className="grid gap-4 md:grid-cols-3">
								<Field
									label="Giá thuê mỗi tháng"
									placeholder="3.200.000"
								/>
								<Field
									label="Tiền đặt cọc"
									placeholder="3.200.000"
								/>
								<Field
									label="Diện tích sử dụng (m²)"
									placeholder="24"
								/>
							</div>
							<div className="mt-5 grid gap-3 sm:grid-cols-4">
								{[
									'Điện (đ/kWh)',
									'Nước (đ/m³)',
									'Internet / Wifi',
									'Gửi xe',
								].map((label) => (
									<Field
										key={label}
										label={label}
										placeholder="Nhập mức phí"
									/>
								))}
							</div>
						</Section>
						<Section
							icon={Ruler}
							title="Diện tích, số người & ngày có thể dọn vào"
						>
							<div className="grid gap-4 md:grid-cols-3">
								<Field
									label="Diện tích sử dụng (m²)"
									placeholder="24"
								/>
								<Select
									label="Số người ở tối đa"
									options={[
										'1 người',
										'2 người',
										'3 người',
										'4 người',
									]}
								/>
								<div className="grid gap-2">
									<Label>Ngày có thể dọn vào</Label>
									<button
										type="button"
										className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--gtg-primary)] px-4 font-semibold text-white"
									>
										<CalendarDays
											className="size-4"
											aria-hidden="true"
										/>
										Dọn vào ngay
									</button>
								</div>
							</div>
						</Section>
						<Section
							icon={Sparkles}
							title="Tiện ích phòng & tòa nhà"
						>
							<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
								{amenities.map((amenity) => (
									<label
										key={amenity}
										className="flex min-h-11 items-center gap-3 rounded-lg border border-[var(--gtg-border)] bg-[var(--gtg-surface-low)] px-3 text-sm font-medium"
									>
										<Checkbox
											checked={selectedAmenities.includes(
												amenity,
											)}
											onCheckedChange={() =>
												toggle(amenity)
											}
										/>
										{amenity}
									</label>
								))}
							</div>
						</Section>
						<Section icon={Camera} title="Hình ảnh thực tế">
							<p className="mb-4 text-sm text-[var(--gtg-muted)]">
								Yêu cầu chụp góc rộng, đủ sáng ban ngày, thấy rõ
								khu vệ sinh và lối đi (tối thiểu 3 ảnh).
							</p>
							<div className="grid gap-3 sm:grid-cols-4">
								<div className="aspect-[4/3] rounded-xl bg-[var(--gtg-surface-low)] p-3 text-sm text-[var(--gtg-muted)]">
									Ảnh bìa phòng
								</div>
								<div className="aspect-[4/3] rounded-xl bg-[var(--gtg-surface-low)] p-3 text-sm text-[var(--gtg-muted)]">
									Khu vực bếp
								</div>
								<div className="aspect-[4/3] rounded-xl bg-[var(--gtg-primary-soft)] p-3 text-sm text-[var(--gtg-primary)]">
									Đang tải ảnh…
								</div>
								<button
									type="button"
									className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--gtg-primary)] bg-[var(--gtg-primary-soft)]/40 text-[var(--gtg-primary)]"
								>
									<Upload
										className="size-7"
										aria-hidden="true"
									/>
									<span className="mt-3 font-semibold">
										Tải ảnh phòng thực tế
									</span>
									<span className="mt-1 text-sm text-[var(--gtg-muted)]">
										Tối thiểu 3 ảnh, ảnh sáng và rõ nét.
									</span>
								</button>
							</div>
						</Section>
						<Section icon={Phone} title="Thông tin người liên hệ">
							<div className="grid gap-4 md:grid-cols-3">
								<Field
									label="Tên người liên hệ"
									placeholder="Nguyễn Thị Mai"
								/>
								<Field
									label="Số điện thoại"
									placeholder="0918 234 421"
								/>
								<Select
									label="Vai trò người đăng"
									options={[
										'Chính chủ cho thuê',
										'Quản lý nhà trọ',
									]}
								/>
							</div>
							<label className="mt-5 flex min-h-11 items-center gap-3 rounded-lg bg-[var(--gtg-surface-low)] px-3 text-sm">
								<Checkbox defaultChecked />
								Nhận tin nhắn Zalo tự động
							</label>
						</Section>
						<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
							<button
								type="button"
								className="min-h-12 rounded-xl border border-[var(--gtg-border)] px-5 font-semibold"
							>
								Lưu bản nháp
							</button>
							<button
								type="submit"
								className="min-h-12 rounded-xl bg-[var(--gtg-primary)] px-6 font-semibold text-white hover:bg-[var(--gtg-primary-dark)]"
							>
								Xem trước & gửi duyệt
							</button>
						</div>
					</form>
				</div>
			</main>
			<PublicFooter />
		</div>
	);
}
function Section({
	icon: Icon,
	title,
	children,
}: {
	icon: typeof Building2;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl border border-[var(--gtg-border)] bg-white p-5 shadow-sm sm:p-7">
			<h2 className="flex items-center gap-3 text-xl font-bold">
				<span className="grid size-9 place-items-center rounded-lg bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary)]">
					<Icon className="size-5" aria-hidden="true" />
				</span>
				{title}
			</h2>
			<div className="mt-6">{children}</div>
		</section>
	);
}
function Field({ label, placeholder }: { label: string; placeholder: string }) {
	const id = label.toLowerCase().replaceAll(' ', '-');
	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				placeholder={placeholder}
				className="min-h-12 border-[var(--gtg-border-strong)] bg-[var(--gtg-surface-low)] text-base"
			/>
		</div>
	);
}
function Select({ label, options }: { label: string; options: string[] }) {
	const [value, setValue] = useState(options[0]);
	const id = `listing-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;
	const selectOptions: SearchableSelectOption[] = options.map((option) => ({
		label: option,
		value: option,
	}));

	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<SearchableSelect
				id={id}
				value={value}
				options={selectOptions}
				placeholder={`Chọn ${label.toLowerCase()}`}
				onValueChange={setValue}
				onSelect={(option) => setValue(option.label)}
			/>
		</div>
	);
}
