import { Input } from '@/components/ui/input';
import type { SearchableSelectOption } from '@/types/searchable-select';
import { ChevronDown } from 'lucide-react';
import {
	useEffect,
	useId,
	useRef,
	useState,
	type KeyboardEvent,
	type RefObject,
} from 'react';

export type { SearchableSelectOption } from '@/types/searchable-select';

interface SearchableSelectProps {
	id: string;
	value: string;
	options: SearchableSelectOption[];
	placeholder: string;
	disabled?: boolean;
	invalid?: boolean;
	inputRef?: RefObject<HTMLInputElement | null>;
	emptyMessage?: string;
	onValueChange: (value: string) => void;
	onSelect: (option: SearchableSelectOption) => void;
}

export function SearchableSelect({
	id,
	value,
	options,
	placeholder,
	disabled = false,
	invalid = false,
	inputRef,
	emptyMessage = 'Không tìm thấy kết quả.',
	onValueChange,
	onSelect,
}: SearchableSelectProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const listboxId = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [filterValue, setFilterValue] = useState('');
	const normalizedValue = filterValue.toLocaleLowerCase('vi-VN');
	const filteredOptions = options.filter((option) =>
		option.label.toLocaleLowerCase('vi-VN').includes(normalizedValue),
	);

	useEffect(() => {
		function closeWhenClickingOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', closeWhenClickingOutside);

		return () =>
			document.removeEventListener('mousedown', closeWhenClickingOutside);
	}, []);

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Escape') {
			setIsOpen(false);
			event.currentTarget.blur();
		}
	}

	return (
		<div ref={containerRef} className="relative">
			<Input
				ref={inputRef}
				id={id}
				type="search"
				role="combobox"
				value={value}
				disabled={disabled}
				placeholder={placeholder}
				aria-autocomplete="list"
				aria-controls={listboxId}
				aria-expanded={isOpen && !disabled}
				aria-invalid={invalid}
				onFocus={() => {
					setFilterValue('');
					setIsOpen(true);
				}}
				onKeyDown={handleKeyDown}
				onChange={(event) => {
					onValueChange(event.target.value);
					setFilterValue(event.target.value);
					setIsOpen(true);
				}}
				className="min-h-12 rounded-[10px] border-[var(--gtg-border-strong)] bg-white pr-10 text-base text-[var(--gtg-text)] placeholder:text-[var(--gtg-muted)] focus-visible:border-[var(--gtg-primary)] focus-visible:ring-[var(--gtg-primary-soft)] disabled:bg-[var(--gtg-surface-low)]"
			/>
			<ChevronDown
				className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[var(--gtg-muted)]"
				aria-hidden="true"
			/>
			{isOpen && !disabled && (
				<div
					id={listboxId}
					role="listbox"
					className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[var(--gtg-border)] bg-white p-1 shadow-lg"
				>
					{filteredOptions.length > 0 ? (
						filteredOptions.map((option) => (
							<button
								key={option.value}
								type="button"
								role="option"
								aria-selected={option.label === value}
								onMouseDown={(event) => event.preventDefault()}
								onClick={() => {
									onSelect(option);
									setFilterValue('');
									setIsOpen(false);
								}}
								className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-[var(--gtg-text)] hover:bg-[var(--gtg-surface-low)] focus-visible:bg-[var(--gtg-surface-low)] focus-visible:outline-none"
							>
								{option.label}
							</button>
						))
					) : (
						<p className="px-3 py-3 text-sm text-[var(--gtg-muted)]">
							{emptyMessage}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
