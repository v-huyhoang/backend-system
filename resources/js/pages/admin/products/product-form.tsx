import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type {
	ProductCategoryOption,
	ProductStatus,
	SingleProduct,
} from '@/types/product';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useState } from 'react';

interface ProductFormProps {
	product?: SingleProduct;
	categories?: ProductCategoryOption[];
}

const textareaClassName =
	'min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

function lines(value: string) {
	return value
		.split('\n')
		.map((item) => item.trim())
		.filter(Boolean);
}

function ProductListField({
	id,
	label,
	initialValue,
	error,
	onChange,
}: {
	id: string;
	label: string;
	initialValue: string[];
	error?: string;
	onChange: (items: string[]) => void;
}) {
	const [value, setValue] = useState(initialValue.join('\n'));

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<textarea
				id={id}
				className={textareaClassName}
				value={value}
				onChange={(event) => {
					setValue(event.target.value);
					onChange(lines(event.target.value));
				}}
				placeholder="One item per line"
			/>
			<InputError message={error} />
		</div>
	);
}

export default function ProductForm({
	product,
	categories = [],
}: ProductFormProps) {
	const isEditing = Boolean(product);
	const { data, setData, post, put, processing, errors } = useForm({
		code: product?.code ?? '',
		name: product?.name ?? '',
		slug: product?.slug ?? '',
		category_id: product?.category_id ?? null,
		short_description: product?.short_description ?? '',
		content: product?.content ?? '',
		thumbnail_path: product?.thumbnail_path ?? '',
		advantages: product?.advantages ?? ([] as string[]),
		disadvantages: product?.disadvantages ?? ([] as string[]),
		suitable_for: product?.suitable_for ?? ([] as string[]),
		not_suitable_for: product?.not_suitable_for ?? ([] as string[]),
		status: product?.status ?? ('draft' as ProductStatus),
		is_featured: product?.is_featured ?? false,
		sort_order: product?.sort_order ?? 0,
		published_at: product?.published_at?.slice(0, 16) ?? '',
	});

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (product) {
			put(`/admin/products/${product.id}`);
			return;
		}
		post('/admin/products');
	}

	return (
		<form onSubmit={submit} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Basic information</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-5 lg:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="code">Product code</Label>
						<Input id="code" value={data.code} onChange={(event) => setData('code', event.target.value)} aria-invalid={!!errors.code} />
						<InputError message={errors.code} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" value={data.name} onChange={(event) => setData('name', event.target.value)} aria-invalid={!!errors.name} />
						<InputError message={errors.name} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="slug">Slug</Label>
						<Input id="slug" value={data.slug} onChange={(event) => setData('slug', event.target.value)} aria-invalid={!!errors.slug} />
						<InputError message={errors.slug} />
					</div>
					<div className="space-y-2">
						<Label>Category</Label>
						<Select value={data.category_id === null ? 'none' : String(data.category_id)} onValueChange={(value) => setData('category_id', value === 'none' ? null : Number(value))}>
							<SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="none">No category</SelectItem>
								{categories.map((category) => <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>)}
							</SelectContent>
						</Select>
						<InputError message={errors.category_id} />
					</div>
					<div className="space-y-2 lg:col-span-2">
						<Label htmlFor="short_description">Short description</Label>
						<textarea id="short_description" className={textareaClassName} value={data.short_description} onChange={(event) => setData('short_description', event.target.value)} />
						<InputError message={errors.short_description} />
					</div>
					<div className="space-y-2 lg:col-span-2">
						<Label htmlFor="content">Content</Label>
						<textarea id="content" className="min-h-52 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.content} onChange={(event) => setData('content', event.target.value)} />
						<InputError message={errors.content} />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader><CardTitle>Publishing</CardTitle></CardHeader>
				<CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-2">
						<Label>Status</Label>
						<Select value={data.status} onValueChange={(value: ProductStatus) => setData('status', value)}>
							<SelectTrigger><SelectValue /></SelectTrigger>
							<SelectContent>
								<SelectItem value="draft">Draft</SelectItem>
								<SelectItem value="published">Published</SelectItem>
								<SelectItem value="archived">Archived</SelectItem>
							</SelectContent>
						</Select>
						<InputError message={errors.status} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="sort_order">Sort order</Label>
						<Input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(event) => setData('sort_order', Number(event.target.value))} />
						<InputError message={errors.sort_order} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="published_at">Published at</Label>
						<Input id="published_at" type="datetime-local" value={data.published_at} onChange={(event) => setData('published_at', event.target.value)} />
						<InputError message={errors.published_at} />
					</div>
					<div className="flex items-center gap-3 pt-7">
						<Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked === true)} />
						<Label htmlFor="is_featured">Featured product</Label>
					</div>
					<div className="space-y-2 md:col-span-2 lg:col-span-4">
						<Label htmlFor="thumbnail_path">Thumbnail path or URL</Label>
						<Input id="thumbnail_path" value={data.thumbnail_path} onChange={(event) => setData('thumbnail_path', event.target.value)} />
						<InputError message={errors.thumbnail_path} />
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader><CardTitle>Review details</CardTitle></CardHeader>
				<CardContent className="grid gap-5 md:grid-cols-2">
					{([
						['advantages', 'Advantages'],
						['disadvantages', 'Disadvantages'],
						['suitable_for', 'Suitable for'],
						['not_suitable_for', 'Not suitable for'],
					] as const).map(([field, label]) => (
						<ProductListField
							key={field}
							id={field}
							label={label}
							initialValue={data[field]}
							error={errors[field]}
							onChange={(items) => setData(field, items)}
						/>
					))}
				</CardContent>
			</Card>

			<div className="flex justify-end gap-3">
				<Button asChild type="button" variant="outline"><Link href="/admin/products"><ArrowLeft /> Back</Link></Button>
				<Button type="submit" disabled={processing}>{processing ? <Loader2 className="animate-spin" /> : <Save />}{isEditing ? 'Save changes' : 'Create product'}</Button>
			</div>
		</form>
	);
}
