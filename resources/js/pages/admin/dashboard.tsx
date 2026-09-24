import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { dashboard } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, ClipboardList, Eye, X } from 'lucide-react';
import { useState } from 'react';

type PendingListing = { public_id: string; title: string; address: string; monthly_rent: number; submitted_at: string | null; landlord: { name: string | null; email: string | null }; primary_image: { path: string; alt_text: string | null } | null };
type PaginationLink = { url: string | null; label: string; active: boolean };
type PendingListings = { data: PendingListing[]; from: number | null; to: number | null; total: number; links: PaginationLink[] };
type ModerationActivity = { id: number; listing: { public_id: string | null; title: string | null }; moderator_name: string | null; from_status: string | null; to_status: string; reason: string | null; created_at: string | null };

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];
const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
const formatDateTime = (date: string | null) => date ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) : 'Chưa có';
const statusLabel = (status: string | null) => ({ draft: 'Bản nháp', pending_review: 'Chờ duyệt', published: 'Đã duyệt', rejected: 'Từ chối' })[status ?? ''] ?? status ?? 'Không rõ';

export default function Dashboard({ pendingListings, recentActivity, canReview }: { pendingListings: PendingListings; recentActivity: { data: ModerationActivity[] }; canReview: boolean }) {
	const [listingToReject, setListingToReject] = useState<PendingListing | null>(null);
	const { data, setData, post, processing, errors, reset } = useForm({ reason: '' });
	const approve = (listing: PendingListing) => router.post(`/admin/listings/${listing.public_id}/approve`, {}, { preserveScroll: true });
	const reject = () => {
		if (!listingToReject) return;
		post(`/admin/listings/${listingToReject.public_id}/reject`, { preserveScroll: true, onSuccess: () => { setListingToReject(null); reset(); } });
	};

	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Kiểm duyệt tin đăng" />
			<div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
				<section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div><h1 className="text-2xl font-semibold tracking-tight">Kiểm duyệt tin đăng</h1><p className="text-sm text-muted-foreground">Duyệt hoặc trả tin về để bổ sung. Mọi quyết định đều được lưu trong audit log.</p></div>
					<Badge variant="secondary" className="w-fit gap-2 px-3 py-1.5 text-sm"><ClipboardList className="size-4" /> {pendingListings.total} tin chờ duyệt</Badge>
				</section>
				<Card>
					<CardHeader><CardTitle>Hàng đợi duyệt tin</CardTitle><CardDescription>Ưu tiên các tin được gửi sớm hơn để chủ trọ nhận phản hồi kịp thời.</CardDescription></CardHeader>
					<CardContent className="px-0 sm:px-6">
						{pendingListings.data.length === 0 ? <div className="px-6 py-12 text-center text-sm text-muted-foreground">Không có tin nào đang chờ duyệt.</div> : <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Tin đăng</TableHead><TableHead>Chủ trọ</TableHead><TableHead>Giá thuê</TableHead><TableHead>Gửi duyệt</TableHead><TableHead className="text-right">Thao tác</TableHead></TableRow></TableHeader><TableBody>{pendingListings.data.map((listing) => <TableRow key={listing.public_id}><TableCell className="min-w-72"><div className="flex items-center gap-3"><div className="size-14 shrink-0 overflow-hidden rounded-md bg-muted">{listing.primary_image ? <img src={listing.primary_image.path} alt={listing.primary_image.alt_text ?? listing.title} className="size-full object-cover" /> : <div className="grid size-full place-items-center text-xs text-muted-foreground">Không ảnh</div>}</div><div className="min-w-0"><div className="truncate font-medium">{listing.title}</div><div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{listing.address}</div></div></div></TableCell><TableCell><div>{listing.landlord.name}</div><div className="text-xs text-muted-foreground">{listing.landlord.email}</div></TableCell><TableCell>{formatCurrency(listing.monthly_rent)}</TableCell><TableCell>{formatDateTime(listing.submitted_at)}</TableCell><TableCell><div className="flex justify-end gap-2"><Button size="sm" variant="outline" asChild><Link href={`/admin/listings/${listing.public_id}`} aria-label={`Xem chi tiết ${listing.title}`}><Eye className="size-4" />Chi tiết</Link></Button><Button size="sm" onClick={() => approve(listing)} disabled={!canReview} aria-label={`Duyệt ${listing.title}`}><Check className="size-4" />Duyệt</Button><Button size="sm" variant="outline" onClick={() => setListingToReject(listing)} disabled={!canReview} aria-label={`Từ chối ${listing.title}`}><X className="size-4" />Từ chối</Button></div></TableCell></TableRow>)}</TableBody></Table></div>}
						{pendingListings.total > 0 && <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 text-sm text-muted-foreground"><span>Hiển thị {pendingListings.from}–{pendingListings.to} / {pendingListings.total} tin</span><div className="flex gap-1">{pendingListings.links.map((link) => <Button key={link.label} size="sm" variant={link.active ? 'secondary' : 'outline'} asChild disabled={!link.url}><Link href={link.url ?? '#'} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} /></Button>)}</div></div>}
					</CardContent>
				</Card>
				<Card>
					<CardHeader><CardTitle>Audit log gần đây</CardTitle><CardDescription>Lịch sử thay đổi trạng thái do người kiểm duyệt thực hiện.</CardDescription></CardHeader>
					<CardContent className="space-y-4">{recentActivity.data.length === 0 ? <p className="text-sm text-muted-foreground">Chưa có hoạt động kiểm duyệt.</p> : recentActivity.data.map((activity) => <div key={activity.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="font-medium">{activity.listing.title}</div><div className="mt-1 text-sm text-muted-foreground">{activity.moderator_name ?? 'Người kiểm duyệt'}: {statusLabel(activity.from_status)} → {statusLabel(activity.to_status)}</div>{activity.reason && <p className="mt-2 text-sm">Lý do: {activity.reason}</p>}</div><div className="text-sm text-muted-foreground">{formatDateTime(activity.created_at)}</div></div>)}</CardContent>
				</Card>
			</div>
			<Dialog open={listingToReject !== null} onOpenChange={(open) => !open && setListingToReject(null)}><DialogContent><DialogHeader><DialogTitle>Trả tin về để bổ sung</DialogTitle><DialogDescription>Nêu rõ phần cần chỉnh sửa để chủ trọ có thể gửi lại tin đăng.</DialogDescription></DialogHeader><div className="grid gap-2"><Label htmlFor="rejection-reason">Lý do từ chối</Label><textarea id="rejection-reason" className="min-h-28 rounded-md border bg-transparent px-3 py-2 text-sm" value={data.reason} onChange={(event) => setData('reason', event.target.value)} aria-invalid={Boolean(errors.reason)} />{errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}</div><DialogFooter><Button type="button" variant="outline" onClick={() => setListingToReject(null)}>Hủy</Button><Button type="button" variant="destructive" onClick={reject} disabled={processing}>Xác nhận từ chối</Button></DialogFooter></DialogContent></Dialog>
		</AdminLayout>
	);
}
