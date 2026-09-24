import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LandlordLayout from '@/layouts/landlord-layout';
import { index, update } from '@/routes/landlord/listings';
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
import { Head, Link, useForm } from '@inertiajs/react';
import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Cost = {
	type: string;
	label: string;
	amount: string | null;
	unit: string;
	note: string | null;
};
type Listing = {
	public_id: string;
	property_type_id: number;
	ward_id: number;
	province_slug: string | null;
	title: string;
	description: string;
	address_detail: string;
	monthly_rent: string;
	deposit_amount: string | null;
	area_sqm: string;
	max_occupants: number;
	available_from: string | null;
	contact_name: string;
	contact_phone: string;
	amenity_ids: number[];
	costs: Cost[];
	images: Array<{
		id: number;
		path: string;
		alt_text: string | null;
		is_primary: boolean;
	}>;
};
export default function Edit({ listing }: { listing: Listing }) {
	const [types, setTypes] = useState<PropertyType[]>([]);
	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [costTypes, setCostTypes] = useState<CostType[]>([]);
	const [provinces, setProvinces] = useState<LocationSuggestion[]>([]);
	const [wards, setWards] = useState<LocationSuggestion[]>([]);
	const [province, setProvince] = useState(listing.province_slug ?? '');
	const { data, setData, put, processing, errors } = useForm({
		...listing,
		images: [] as File[],
	});
	useEffect(() => {
		const c = new AbortController();
		Promise.all([
			getPropertyTypes(c.signal),
			getAmenities(c.signal),
			getCostTypes(c.signal),
			getProvinces(c.signal),
		]).then(([a, b, d, e]) => {
			setTypes(a.data);
			setAmenities(b.data);
			setCostTypes(d.data);
			setProvinces(e.data);
		});
		return () => c.abort();
	}, []);
	useEffect(() => {
		if (!province) return;
		const c = new AbortController();
		getWards(province, c.signal).then((r) => setWards(r.data));
		return () => c.abort();
	}, [province]);
	const previews = useMemo(
		() => data.images.map((file) => URL.createObjectURL(file)),
		[data.images],
	);
	const toggleAmenity = (id: number) =>
		setData(
			'amenity_ids',
			data.amenity_ids.includes(id)
				? data.amenity_ids.filter((item) => item !== id)
				: [...data.amenity_ids, id],
		);
	const updateCost = (costType: CostType, amount: string) =>
		setData(
			'costs',
			data.costs.some((cost) => cost.type === costType.slug)
				? data.costs.map((cost) =>
						cost.type === costType.slug
							? { ...cost, amount }
							: cost,
					)
				: [
						...data.costs,
						{
							type: costType.slug,
							label: costType.name,
							unit: costType.unit,
							amount,
							note: null,
						},
					],
		);
	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		put(update(listing.public_id).url, { forceFormData: true });
	};
	return (
		<LandlordLayout>
			<Head title={`Chỉnh sửa ${listing.title} | Trọ Đây`} />
			<main className="mx-auto max-w-6xl px-4 py-8">
				<div className="flex items-end justify-between gap-4">
					<div>
						<p className="text-sm font-bold text-[var(--gtg-accent)]">
							Bản nháp
						</p>
						<h1 className="text-3xl font-bold">
							Chỉnh sửa tin đăng
						</h1>
					</div>
					<Link href={index()} className="font-semibold">
						Quay lại
					</Link>
				</div>
				<form
					onSubmit={submit}
					className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]"
				>
					<div className="space-y-6">
						<section className="rounded-xl border bg-white p-5">
							<h2 className="font-bold">Thông tin phòng</h2>
							<div className="mt-4 grid gap-4">
								<label>
									<Label>Loại phòng</Label>
									<select
										value={data.property_type_id}
										onChange={(e) =>
											setData(
												'property_type_id',
												Number(e.target.value),
											)
										}
										className="mt-1 w-full rounded-lg border p-3"
									>
										{types.map((type) => (
											<option
												key={type.id}
												value={type.id}
											>
												{type.name}
											</option>
										))}
									</select>
								</label>
								<Field
									label="Tiêu đề"
									value={data.title}
									error={errors.title}
									onChange={(value) =>
										setData('title', value)
									}
								/>
								<label>
									<Label>Mô tả</Label>
									<textarea
										value={data.description}
										onChange={(e) =>
											setData(
												'description',
												e.target.value,
											)
										}
										className="mt-1 min-h-32 w-full rounded-lg border p-3"
									/>
									{errors.description && (
										<Error value={errors.description} />
									)}
								</label>
							</div>
						</section>
						<section className="rounded-xl border bg-white p-5">
							<h2 className="font-bold">Địa chỉ và giá</h2>
							<div className="mt-4 grid gap-4 md:grid-cols-2">
								<label>
									<Label>Tỉnh/thành</Label>
									<select
										value={province}
										onChange={(e) => {
											setProvince(e.target.value);
											setData('ward_id', 0);
										}}
										className="mt-1 w-full rounded-lg border p-3"
									>
										<option value="">
											Chọn tỉnh/thành
										</option>
										{provinces.map((item) => (
											<option
												key={item.url}
												value={item.url
													.split('/')
													.pop()}
											>
												{item.label}
											</option>
										))}
									</select>
								</label>
								<label>
									<Label>Phường/xã</Label>
									<select
										value={data.ward_id}
										onChange={(e) =>
											setData(
												'ward_id',
												Number(e.target.value),
											)
										}
										className="mt-1 w-full rounded-lg border p-3"
									>
										{wards.map((item) => (
											<option
												key={item.id}
												value={item.id}
											>
												{item.label}
											</option>
										))}
									</select>
								</label>
								<Field
									label="Địa chỉ chi tiết"
									value={data.address_detail}
									error={errors.address_detail}
									onChange={(value) =>
										setData('address_detail', value)
									}
								/>
								<Field
									label="Giá thuê"
									value={data.monthly_rent}
									error={errors.monthly_rent}
									onChange={(value) =>
										setData('monthly_rent', value)
									}
								/>
								<Field
									label="Diện tích (m²)"
									value={data.area_sqm}
									error={errors.area_sqm}
									onChange={(value) =>
										setData('area_sqm', value)
									}
								/>
								<Field label="Ngày có thể dọn vào" type="date" value={data.available_from} error={errors.available_from} onChange={(value) => setData('available_from', value || null)} />
							</div>
						</section>
						<section className="rounded-xl border bg-white p-5">
							<h2 className="font-bold">Tiện ích và chi phí</h2>
							<div className="mt-4 grid gap-2 sm:grid-cols-2">
								{amenities.map((item) => (
									<label
										key={item.id}
										className="flex items-center gap-2"
									>
										<Checkbox
											checked={data.amenity_ids.includes(
												item.id,
											)}
											onCheckedChange={() =>
												toggleAmenity(item.id)
											}
										/>
										{item.name}
									</label>
								))}
							</div>
							<div className="mt-4 grid gap-3">
								{costTypes.map((item) => (
									<label key={item.id}>
										<Label>
											{item.name} ({item.unit})
										</Label>
										<Input
											value={
												data.costs.find(
													(cost) =>
														cost.type === item.slug,
												)?.amount ?? ''
											}
											onChange={(e) =>
												updateCost(item, e.target.value)
											}
										/>
									</label>
								))}
							</div>
						</section>
						<section className="rounded-xl border bg-white p-5">
							<h2 className="font-bold">Hình ảnh</h2>
							<label className="mt-4 flex min-h-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
								<ImagePlus className="mr-2 size-5" />
								Thêm ảnh
								<input
									className="sr-only"
									type="file"
									multiple
									accept="image/jpeg,image/png,image/webp"
									onChange={(e) =>
										setData(
											'images',
											Array.from(e.target.files ?? []),
										)
									}
								/>
							</label>
							<div className="mt-4 grid grid-cols-3 gap-3">
								{listing.images.map((image) => (
									<img
										key={image.id}
										src={`/storage/${image.path}`}
										alt={image.alt_text ?? listing.title}
										className="aspect-[4/3] rounded object-cover"
									/>
								))}
								{previews.map((src, index) => (
									<div key={src} className="relative">
										<img
											src={src}
											alt="Ảnh mới"
											className="aspect-[4/3] rounded object-cover"
										/>
										<button
											type="button"
											onClick={() =>
												setData(
													'images',
													data.images.filter(
														(_, item) =>
															item !== index,
													),
												)
											}
											aria-label="Xóa ảnh mới"
											className="absolute top-1 right-1 rounded bg-white p-1"
										>
											<X className="size-4" />
										</button>
									</div>
								))}
							</div>
						</section>
						<button
							disabled={processing}
							className="rounded-lg bg-[var(--gtg-primary)] px-6 py-3 font-semibold text-white"
						>
							{processing ? 'Đang lưu...' : 'Lưu bản nháp'}
						</button>
					</div>
					<aside className="h-fit rounded-xl border bg-white p-5 lg:sticky lg:top-6">
						<p className="text-sm font-bold">Xem trước</p>
						<h2 className="mt-3 text-xl font-bold">
							{data.title || 'Tiêu đề tin đăng'}
						</h2>
						<p className="mt-3 text-sm whitespace-pre-wrap">
							{data.description || 'Mô tả phòng'}
						</p>
						<p className="mt-4 font-bold text-[var(--gtg-primary)]">
							{data.monthly_rent || 0} đ/tháng ·{' '}
							{data.area_sqm || 0} m²
						</p>
						<p className="mt-3 text-sm">{data.address_detail}</p>
					</aside>
				</form>
			</main>
		</LandlordLayout>
	);
}
function Field({
	label,
	value,
	onChange,
	error,
	type = 'text',
}: {
	label: string;
	value: string | number | null;
	onChange: (value: string) => void;
	error?: string;
	type?: string;
}) {
	return (
		<label>
			<Label>{label}</Label>
			<Input
				type={type}
				value={value ?? ''}
				onChange={(e) => onChange(e.target.value)}
			/>
			{error && <Error value={error} />}
		</label>
	);
}
function Error({ value }: { value: string }) {
	return <p className="mt-1 text-sm text-red-600">{value}</p>;
}
