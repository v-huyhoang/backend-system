import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, MapPin, Phone, UserRound, X } from 'lucide-react';
import { useState } from 'react';

type Moderation = { id: number; moderator_name: string | null; from_status: string | null; to_status: string; reason: string | null; created_at: string | null };
type Listing = {
	public_id: string; title: string; description: string; status: string; rejection_reason: string | null; submitted_at: string | null;
	property_type: string | null; address: string; monthly_rent: number; deposit_amount: number; area_sqm: number; max_occupants: number; available_from: string | null;
	contact: { name: string; phone: string }; landlord: { name: string | null; email: string | null }; amenities: string[];
	costs: Array<{ label: string; amount: number | null; unit: string | null; note: string | null }>;
	images: Array<{ path: string; alt_text: string | null; is_primary: boolean }>; moderations: Moderation[];
};

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value));
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value)) : 'Chưa cập nhật';
const statusLabel = (status: string | null) => ({ draft: 'Bản nháp', pending_review: 'Chờ duyệt', published: 'Đã duyệt', rejected: 'Từ chối', hidden: 'Đã ẩn', rented: 'Đã cho thuê', expired: 'Hết hạn' })[status ?? ''] ?? status ?? 'Không rõ';

export default function Show({ listing, canReview }: { listing: Listing; canReview: boolean }) {
	const [rejectOpen, setRejectOpen] = useState(false);
	const { data, setData, post, processing, errors, reset } = useForm({ reason: '' });
	const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kiểm duyệt tin', href: dashboard().url }, { title: listing.title, href: `/admin/listings/${listing.public_id}` }];
	const approve = () => router.post(`/admin/listings/${listing.public_id}/approve`);
	const reject = () => post(`/admin/listings/${listing.public_id}/reject`, { onSuccess: () => { setRejectOpen(false); reset(); } });

	return <AdminLayout breadcrumbs={breadcrumbs}>
		<Head title={`Kiểm duyệt: ${listing.title}`} />
		<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><Button variant="ghost" size="sm" asChild className="-ml-3"><Link href={dashboard()}><ArrowLeft className="size-4" />Quay lại hàng đợi</Link></Button><div className="mt-3 flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight">{listing.title}</h1><Badge variant="secondary">{statusLabel(listing.status)}</Badge></div><p className="mt-2 text-sm text-muted-foreground">Gửi duyệt: {formatDate(listing.submitted_at)}</p></div>{canReview && listing.status === 'pending_review' && <div className="flex gap-2"><Button onClick={approve}><Check className="size-4" />Duyệt tin</Button><Button variant="outline" onClick={() => setRejectOpen(true)}><X className="size-4" />Từ chối</Button></div>}</div>
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
				<div className="space-y-6">
					<Card><CardHeader><CardTitle>Hình ảnh phòng</CardTitle><CardDescription>{listing.images.length} ảnh được chủ trọ cung cấp</CardDescription></CardHeader><CardContent>{listing.images.length === 0 ? <p className="text-sm text-muted-foreground">Tin đăng chưa có ảnh.</p> : <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{listing.images.map((image) => <div key={image.path} className="relative overflow-hidden rounded-lg border"><img src={image.path} alt={image.alt_text ?? listing.title} className="aspect-[4/3] w-full object-cover" />{image.is_primary && <Badge className="absolute left-2 top-2">Ảnh chính</Badge>}</div>)}</div>}</CardContent></Card>
					<Card><CardHeader><CardTitle>Mô tả</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line text-sm leading-6 text-foreground">{listing.description}</p></CardContent></Card>
					<Card><CardHeader><CardTitle>Tiện ích và chi phí</CardTitle></CardHeader><CardContent className="space-y-5"><div className="flex flex-wrap gap-2">{listing.amenities.length ? listing.amenities.map((amenity) => <Badge key={amenity} variant="secondary">{amenity}</Badge>) : <span className="text-sm text-muted-foreground">Chưa khai báo tiện ích.</span>}</div><div className="divide-y rounded-lg border">{listing.costs.length ? listing.costs.map((cost) => <div key={`${cost.label}-${cost.unit}`} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"><div><div className="font-medium">{cost.label}</div>{cost.note && <div className="mt-1 text-muted-foreground">{cost.note}</div>}</div><div className="font-medium">{cost.amount === null ? 'Thỏa thuận' : `${formatCurrency(cost.amount)} / ${cost.unit}`}</div></div>) : <p className="p-3 text-sm text-muted-foreground">Chưa khai báo chi phí.</p>}</div></CardContent></Card>
					<Card><CardHeader><CardTitle>Lịch sử kiểm duyệt</CardTitle></CardHeader><CardContent className="space-y-4">{listing.moderations.length ? listing.moderations.map((item) => <div key={item.id} className="border-l-2 pl-4"><p className="text-sm font-medium">{item.moderator_name ?? 'Người kiểm duyệt'}: {statusLabel(item.from_status)} → {statusLabel(item.to_status)}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(item.created_at)}</p>{item.reason && <p className="mt-2 text-sm">Lý do: {item.reason}</p>}</div>) : <p className="text-sm text-muted-foreground">Chưa có lịch sử kiểm duyệt.</p>}</CardContent></Card>
				</div>
				<aside className="space-y-6"><Card><CardHeader><CardTitle>Thông tin phòng</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><div><p className="text-muted-foreground">Loại phòng</p><p className="font-medium">{listing.property_type ?? 'Chưa cập nhật'}</p></div><div className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><p>{listing.address}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-muted-foreground">Giá thuê</p><p className="font-medium">{formatCurrency(listing.monthly_rent)}</p></div><div><p className="text-muted-foreground">Tiền cọc</p><p className="font-medium">{formatCurrency(listing.deposit_amount)}</p></div><div><p className="text-muted-foreground">Diện tích</p><p className="font-medium">{listing.area_sqm} m²</p></div><div><p className="text-muted-foreground">Tối đa</p><p className="font-medium">{listing.max_occupants} người</p></div></div><div><p className="text-muted-foreground">Có thể vào ở</p><p className="font-medium">{formatDate(listing.available_from)}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Chủ trọ & liên hệ</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex gap-2"><UserRound className="size-4 shrink-0 text-muted-foreground" /><div><p className="font-medium">{listing.landlord.name}</p><p className="text-muted-foreground">{listing.landlord.email}</p></div></div><div className="flex gap-2"><Phone className="size-4 shrink-0 text-muted-foreground" /><div><p className="font-medium">{listing.contact.name}</p><p className="text-muted-foreground">{listing.contact.phone}</p></div></div></CardContent></Card></aside>
			</div>
		</div>
		<Dialog open={rejectOpen} onOpenChange={setRejectOpen}><DialogContent><DialogHeader><DialogTitle>Trả tin về để bổ sung</DialogTitle><DialogDescription>Nêu rõ phần cần chỉnh sửa để chủ trọ gửi lại tin đăng.</DialogDescription></DialogHeader><div className="grid gap-2"><Label htmlFor="reason">Lý do từ chối</Label><textarea id="reason" className="min-h-28 rounded-md border bg-transparent px-3 py-2 text-sm" value={data.reason} onChange={(event) => setData('reason', event.target.value)} aria-invalid={Boolean(errors.reason)} />{errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}</div><DialogFooter><Button variant="outline" onClick={() => setRejectOpen(false)}>Hủy</Button><Button variant="destructive" onClick={reject} disabled={processing}>Xác nhận từ chối</Button></DialogFooter></DialogContent></Dialog>
	</AdminLayout>;
}
