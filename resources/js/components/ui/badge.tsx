import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex w-fit shrink-0 items-center justify-center overflow-hidden border font-medium whitespace-nowrap transition-[color,box-shadow] before:shrink-0 [&>svg]:pointer-events-none [&>svg]:size-3 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
				destructive:
					'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
				outline:
					'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
				gray: 'border-transparent bg-gray-50 text-gray-700 inset-ring inset-ring-gray-500/15 [a&]:hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:inset-ring-gray-400/20',
				red: 'border-transparent bg-red-50 text-red-700 inset-ring inset-ring-red-600/15 [a&]:hover:bg-red-100 dark:bg-red-950/60 dark:text-red-300 dark:inset-ring-red-400/25',
				yellow:
					'border-transparent bg-yellow-50 text-yellow-800 inset-ring inset-ring-yellow-600/20 [a&]:hover:bg-yellow-100 dark:bg-yellow-950/60 dark:text-yellow-300 dark:inset-ring-yellow-400/25',
				green: 'border-transparent bg-green-50 text-green-700 inset-ring inset-ring-green-600/20 [a&]:hover:bg-green-100 dark:bg-green-950/60 dark:text-green-300 dark:inset-ring-green-400/25',
				blue: 'border-transparent bg-blue-50 text-blue-700 inset-ring inset-ring-blue-700/15 [a&]:hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:inset-ring-blue-400/25',
				indigo:
					'border-transparent bg-indigo-50 text-indigo-700 inset-ring inset-ring-indigo-700/15 [a&]:hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:inset-ring-indigo-400/25',
				purple:
					'border-transparent bg-purple-50 text-purple-700 inset-ring inset-ring-purple-700/15 [a&]:hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:inset-ring-purple-400/25',
				pink: 'border-transparent bg-pink-50 text-pink-700 inset-ring inset-ring-pink-700/15 [a&]:hover:bg-pink-100 dark:bg-pink-950/60 dark:text-pink-300 dark:inset-ring-pink-400/25',
			},
			size: {
				sm: 'min-h-5 px-1.5 py-0.5 text-[0.6875rem] [&>svg]:size-2.5',
				default: 'min-h-6 px-2 py-0.5 text-xs',
				lg: 'min-h-7 px-2.5 py-1 text-sm [&>svg]:size-3.5',
			},
			shape: {
				rounded: 'rounded-md',
				pill: 'rounded-full',
			},
			dot: {
				true: 'before:size-1.5 before:rounded-full before:bg-current',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			shape: 'rounded',
			dot: false,
		},
	},
);

function Badge({
	className,
	variant,
	size,
	shape,
	dot,
	asChild = false,
  ...props
}: React.ComponentProps<'span'> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : 'span';

	return (
		<Comp
			data-slot="badge"
			className={cn(
				badgeVariants({ variant, size, shape, dot }),
				className,
			)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
