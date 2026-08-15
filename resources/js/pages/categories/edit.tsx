import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
import AppLayout from '@/layouts/app-layout';
import * as categoryRoutes from '@/routes/categories';
import { type BreadcrumbItem } from '@/types';
import type { CategoryParentOption, SingleCategory } from '@/types/category';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'Categories', href: categoryRoutes.index.url() },
	{ title: 'Edit', href: '#' },
];

interface EditCategoryProps {
	category: SingleCategory;
	parentOptions: CategoryParentOption[];
}

export default function EditCategory({
	category,
	parentOptions,
}: EditCategoryProps) {
	const { data, setData, put, processing, errors } = useForm({
		name: category.name,
		parent_id: category.parent_id,
		slug: category.slug ?? '',
		description: category.description ?? '',
		is_active: category.is_active,
	});

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		put(categoryRoutes.update.url(category.id));
	}

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Edit Category" />
			<div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle>Edit Category</CardTitle>
						<CardAction>
							<Link href={categoryRoutes.index()}>
								<Button variant="outline">Go back</Button>
							</Link>
						</CardAction>
					</CardHeader>
					<CardContent>
						<form onSubmit={submit} className="space-y-5">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={data.name}
									onChange={(event) =>
										setData('name', event.target.value)
									}
									aria-invalid={!!errors.name}
								/>
								<InputError message={errors.name} />
							</div>

							<div className="space-y-2">
								<Label>Parent category</Label>
								<Select
									value={
										data.parent_id === null
											? 'root'
											: String(data.parent_id)
									}
									onValueChange={(value) =>
										setData(
											'parent_id',
											value === 'root'
												? null
												: Number(value),
										)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select parent" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="root">
											— Root category
										</SelectItem>
										{parentOptions.map((option) => (
											<SelectItem
												key={option.id}
												value={String(option.id)}
												style={{
													paddingLeft: `${0.5 + (option.depth - 1) * 1.25}rem`,
												}}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<InputError message={errors.parent_id} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="slug">Slug</Label>
								<Input
									id="slug"
									value={data.slug}
									onChange={(event) =>
										setData('slug', event.target.value)
									}
									aria-invalid={!!errors.slug}
								/>
								<InputError message={errors.slug} />
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<textarea
									id="description"
									value={data.description}
									onChange={(event) =>
										setData(
											'description',
											event.target.value,
										)
									}
									className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
								/>
								<InputError message={errors.description} />
							</div>

							<div className="flex items-center gap-3">
								<Checkbox
									id="is_active"
									checked={data.is_active}
									onCheckedChange={(checked) =>
										setData('is_active', checked === true)
									}
								/>
								<Label htmlFor="is_active">
									Active category
								</Label>
								<InputError message={errors.is_active} />
							</div>

							<div className="flex justify-end">
								<Button type="submit" disabled={processing}>
									Update
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
}
