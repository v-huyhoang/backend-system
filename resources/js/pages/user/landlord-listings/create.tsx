import { PublicFooter } from '@/components/tro-day/public-footer';
import { PublicHeader } from '@/components/tro-day/public-header';
import {
	SearchableSelect,
	type SearchableSelectOption,
} from '@/components/tro-day/searchable-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	getProvinces,
	getWards,
	type LocationSuggestion,
} from '@/services/location-service';
import {
	getAmenities,
	getCostTypes,
	getPropertyTypes,
	type Amenity,
	type CostType,
	type PropertyType,
} from '@/services/rental-master-data-service';
import type { LandlordListingCostForm } from '@/types/landlord-listings';
import { Head, useForm } from '@inertiajs/react';
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
import { useEffect, useState } from 'react';

export default function CreateLandlordListing() {
	const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [costTypes, setCostTypes] = useState<CostType[]>([]);
	const [type, setType] = useState<number | null>(null);
	const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
	const [provinces, setProvinces] = useState<LocationSuggestion[]>([]);
	const [wards, setWards] = useState<LocationSuggestion[]>([]);
	const [selectedProvinceSlug, setSelectedProvinceSlug] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		Promise.all([
			getPropertyTypes(controller.signal),
			getAmenities(controller.signal),
			getCostTypes(controller.signal),
		])
			.then(
				([propertyTypeResponse, amenityResponse, costTypeResponse]) => {
					setPropertyTypes(propertyTypeResponse.data);
					setAmenities(amenityResponse.data);
					setCostTypes(costTypeResponse.data);
					setType(propertyTypeResponse.data[0]?.id ?? null);
					setData(
						'property_type_id',
						propertyTypeResponse.data[0]?.id ?? null,
					);
				},
			)
			.catch(() => undefined);

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		getProvinces(controller.signal)
			.then((response) => setProvinces(response.data))
			.catch(() => setProvinces([]));

		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (!selectedProvinceSlug) {
			setWards([]);
			return;
		}

		const controller = new AbortController();
		getWards(selectedProvinceSlug, controller.signal)
			.then((response) => setWards(response.data))
			.catch(() => setWards([]));

		return () => controller.abort();
	}, [selectedProvinceSlug]);

	const { data, setData, post, processing, errors } = useForm({
		property_type_id: null as number | null,
		ward_id: null as number | null,
		title: '',
		description: '',
		address_detail: '',
		monthly_rent: '',
		deposit_amount: '',
		area_sqm: '',
		max_occupants: 1,
		available_from: null as string | null,
		contact_name: '',
		contact_phone: '',
		amenity_ids: [] as number[],
		costs: [] as LandlordListingCostForm[],
	});
	const hasAddressErrors = Boolean(errors.ward_id || errors.address_detail);
	const hasRentErrors = Boolean(errors.monthly_rent || errors.deposit_amount);
	const hasCostErrors = Object.keys(errors).some((key) =>
		key.startsWith('costs.'),
	);
	const hasRoomDetailErrors = Boolean(
		errors.area_sqm || errors.max_occupants || errors.available_from,
	);
	const hasContactErrors = Boolean(
		errors.contact_name || errors.contact_phone,
	);

	const toggle = (amenityId: number) => {
		const nextAmenities = data.amenity_ids.includes(amenityId)
			? data.amenity_ids.filter((id) => id !== amenityId)
			: [...data.amenity_ids, amenityId];

		setSelectedAmenities(nextAmenities);
		setData('amenity_ids', nextAmenities);
	};

	function updateCost(costType: CostType, amount: string) {
		const costs = data.costs.some((cost) => cost.type === costType.slug)
			? data.costs.map((cost) =>
					cost.type === costType.slug ? { ...cost, amount } : cost,
				)
			: [
					...data.costs,
					{
						type: costType.slug,
						label: costType.name,
						amount,
						unit: costType.unit,
						note: '',
					},
				];

		setData('costs', costs);
	}

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		post('/chu-tro/tin-dang/tao-moi');
	}

	return (
		<div className="gtg-theme flex min-h-screen flex-col bg-[var(--gtg-page-bg)] text-[var(--gtg-text)]">
			<Head title="Đăng phòng mới | Trọ Đây" />
			<PublicHeader />
			<main className="flex-1 pt-16 lg:pt-[104px]">
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
					{/* <div
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
					</div> */}
					<form className="mt-8 space-y-6" onSubmit={submit}>
						<Section
							icon={Building2}
							title="Loại hình & tiêu đề bài đăng"
						>
							<div className="mb-3 grid gap-3 sm:grid-cols-2">
								{propertyTypes.map((item) => (
									<button
										key={item.id}
										type="button"
										onClick={() => {
											setType(item.id);
											setData(
												'property_type_id',
												item.id,
											);
										}}
										className={`min-h-24 rounded-xl border p-4 text-left ${type === item.id ? 'border-[var(--gtg-primary)] bg-[var(--gtg-primary-soft)] text-[var(--gtg-primary-dark)]' : 'border-[var(--gtg-border)] bg-[var(--gtg-surface-low)] hover:border-[var(--gtg-primary)]'}`}
									>
										<strong>{item.name}</strong>
										<span className="mt-1 block text-sm text-[var(--gtg-muted)]">
											Chọn loại hình phù hợp nhất với
											phòng của bạn.
										</span>
									</button>
								))}
							</div>
							{errors.property_type_id && (
								<p className="text-sm text-red-600">
									{errors.property_type_id}
								</p>
							)}
							<Field
								label="Tiêu đề tin đăng"
								placeholder="Ví dụ: Phòng gác lửng 24m², ban công thoáng"
								type="text"
								value={data.title}
								onChange={(value) => setData('title', value)}
								error={errors.title}
							/>
							<div className="mt-4 grid gap-2">
								<Label htmlFor="description">Mô tả phòng</Label>
								<textarea
									id="description"
									value={data.description}
									onChange={(event) =>
										setData(
											'description',
											event.target.value,
										)
									}
									placeholder="Mô tả diện tích, nội thất, giờ giấc và điều kiện thuê..."
									aria-invalid={Boolean(errors.description)}
									className="min-h-32 w-full rounded-xl border border-[var(--gtg-border-strong)] bg-white px-3 py-3 text-base outline-none focus:border-[var(--gtg-primary)] focus:ring-2 focus:ring-[var(--gtg-primary-soft)]"
								/>
								{errors.description && (
									<p className="text-sm text-red-600">
										{errors.description}
									</p>
								)}
							</div>
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
									reserveErrorSpace={hasAddressErrors}
									options={provinces.map(
										(province) => province.label,
									)}
									onValueChange={(value) => {
										const province = provinces.find(
											(item) => item.label === value,
										);
										const slug =
											province?.url.split('/').at(-1) ??
											'';
										setData('ward_id', null);
										setSelectedProvinceSlug(slug);
									}}
								/>
								<Select
									label="Khu vực / Phường xã"
									reserveErrorSpace={hasAddressErrors}
									options={wards.map((ward) => ward.label)}
									disabled={!selectedProvinceSlug}
									error={errors.ward_id}
									onValueChange={(value) => {
										const ward = wards.find(
											(item) => item.label === value,
										);
										setData('ward_id', ward?.id ?? null);
									}}
								/>
								<Field
									label="Số nhà, ngõ/hẻm, tên đường"
									reserveErrorSpace={hasAddressErrors}
									placeholder="Ví dụ: 124/8A Đường Hoàng Diệu 2"
									type="text"
									value={data.address_detail}
									onChange={(value) =>
										setData('address_detail', value)
									}
									error={errors.address_detail}
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
							<div className="grid gap-4 md:grid-cols-2">
								<Field
									label="Giá thuê mỗi tháng"
									reserveErrorSpace={hasRentErrors}
									placeholder="3.200.000"
									type="text"
									value={data.monthly_rent}
									onChange={(value) =>
										setData('monthly_rent', value)
									}
									error={errors.monthly_rent}
								/>
								<Field
									label="Tiền đặt cọc"
									reserveErrorSpace={hasRentErrors}
									placeholder="3.200.000"
									type="text"
									value={data.deposit_amount}
									onChange={(value) =>
										setData('deposit_amount', value)
									}
									error={errors.deposit_amount}
								/>
							</div>
							<div className="mt-5 grid gap-3 sm:grid-cols-4">
								{costTypes.map((costType) => {
									const costIndex = data.costs.findIndex(
										(cost) => cost.type === costType.slug,
									);

									return (
										<Field
											key={costType.id}
											reserveErrorSpace={hasCostErrors}
											label={`${costType.name} (${costType.unit})`}
											placeholder="Nhập mức phí"
											type="number"
											value={
												data.costs.find(
													(cost) =>
														cost.type ===
														costType.slug,
												)?.amount ?? ''
											}
											onChange={(value) =>
												updateCost(costType, value)
											}
											error={
												costIndex >= 0
													? (
															errors as Record<
																string,
																| string
																| undefined
															>
														)[
															`costs.${costIndex}.amount`
														]
													: undefined
											}
										/>
									);
								})}
							</div>
						</Section>
						<Section
							icon={Ruler}
							title="Diện tích, số người & ngày có thể dọn vào"
						>
							<div className="grid gap-4 md:grid-cols-3">
								<Field
									label="Diện tích sử dụng (m²)"
									reserveErrorSpace={hasRoomDetailErrors}
									placeholder="24"
									type="text"
									value={data.area_sqm}
									onChange={(value) =>
										setData('area_sqm', value)
									}
									error={errors.area_sqm}
								/>
								<Select
									label="Số người ở tối đa"
									reserveErrorSpace={hasRoomDetailErrors}
									options={[
										'1 người',
										'2 người',
										'3 người',
										'4 người',
									]}
									onValueChange={(value) =>
										setData(
											'max_occupants',
											Number.parseInt(value, 10),
										)
									}
								/>
								<div className="grid gap-2">
									<Label htmlFor="available_from">
										Ngày có thể dọn vào
									</Label>
									<div className="relative">
										<Input
											id="available_from"
											type="date"
											value={data.available_from ?? ''}
											onChange={(event) =>
												setData(
													'available_from',
													event.target.value || null,
												)
											}
											aria-invalid={Boolean(
												errors.available_from,
											)}
											aria-describedby={
												errors.available_from
													? 'available_from-error'
													: undefined
											}
											className="min-h-12 border-[var(--gtg-border-strong)] bg-white pr-12 text-base [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0"
										/>
										<CalendarDays
											className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[var(--gtg-text)]"
											aria-hidden="true"
										/>
									</div>
									{hasRoomDetailErrors && (
										<div className="min-h-5">
											{errors.available_from && (
												<p
													id="available_from-error"
													className="text-sm leading-5 text-red-600"
													role="alert"
												>
													{errors.available_from}
												</p>
											)}
										</div>
									)}
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
										key={amenity.id}
										className="flex min-h-11 items-center gap-3 rounded-lg border border-[var(--gtg-border)] bg-[var(--gtg-surface-low)] px-3 text-sm font-medium"
									>
										<Checkbox
											checked={selectedAmenities.includes(
												amenity.id,
											)}
											onCheckedChange={() =>
												toggle(amenity.id)
											}
										/>
										{amenity.name}
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
									reserveErrorSpace={hasContactErrors}
									placeholder="Nguyễn Thị Mai"
									type="text"
									value={data.contact_name}
									onChange={(value) =>
										setData('contact_name', value)
									}
									error={errors.contact_name}
								/>
								<Field
									label="Số điện thoại"
									reserveErrorSpace={hasContactErrors}
									placeholder="0918 234 421"
									type="text"
									value={data.contact_phone}
									onChange={(value) =>
										setData('contact_phone', value)
									}
									error={errors.contact_phone}
								/>
								<Select
									label="Vai trò người đăng"
									reserveErrorSpace={hasContactErrors}
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
function Field({
	label,
	placeholder,
	value,
	onChange,
	error,
	reserveErrorSpace = false,
	type = 'text',
}: {
	label: string;
	placeholder: string;
	value: string | number;
	onChange: (value: string) => void;
	error?: string;
	reserveErrorSpace?: boolean;
	type?: string;
}) {
	const id = label.toLowerCase().replaceAll(' ', '-');
	const errorId = `${id}-error`;

	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>

			<Input
				id={id}
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(event) => onChange(event.target.value)}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? errorId : undefined}
				className="min-h-12 border-[var(--gtg-border-strong)] bg-white text-base"
			/>
			{(reserveErrorSpace || error) && (
				<div className="min-h-5">
					{error && (
						<p
							id={errorId}
							className="text-sm leading-5 text-red-600"
							role="alert"
						>
							{error}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
function Select({
	label,
	options,
	disabled = false,
	error,
	reserveErrorSpace = false,
	onValueChange,
}: {
	label: string;
	options: string[];
	disabled?: boolean;
	error?: string;
	reserveErrorSpace?: boolean;
	onValueChange?: (value: string) => void;
}) {
	const [value, setValue] = useState('');
	useEffect(() => {
		if (value && !options.includes(value)) {
			setValue('');
		}
	}, [options, value]);
	const id = `listing-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;
	const errorId = `${id}-error`;
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
				disabled={disabled}
				invalid={Boolean(error)}
				describedBy={error ? errorId : undefined}
				placeholder={`Chọn ${label.toLowerCase()}`}
				onValueChange={(nextValue) => {
					setValue(nextValue);
					onValueChange?.(nextValue);
				}}
				onSelect={(option) => {
					setValue(option.label);
					onValueChange?.(option.label);
				}}
			/>
			{(reserveErrorSpace || error) && (
				<div className="min-h-5">
					{error && (
						<p
							id={errorId}
							className="text-sm leading-5 text-red-600"
							role="alert"
						>
							{error}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
