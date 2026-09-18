import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface AdminLayoutProps {
	children: ReactNode;
	breadcrumbs?: BreadcrumbItem[];
}

export default function AdminLayout({
	children,
	breadcrumbs,
	...props
}: AdminLayoutProps) {
	return (
		<AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
			{children}
			<Toaster position="top-right" richColors closeButton />
		</AppLayoutTemplate>
	);
}
