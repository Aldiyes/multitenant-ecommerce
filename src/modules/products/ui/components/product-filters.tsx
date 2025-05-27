'use client';

import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useProductFilters } from '@/modules/products/hooks/use-product-filters';
import { PriceFilter } from '@/modules/products/ui/components/price-filter';
import { TagsFilter } from '@/modules/products/ui/components/tags-filter';

type Props = {
	title: string;
	className?: string;
	children: React.ReactNode;
};

const ProductFilter = ({ title, className, children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

	return (
		<div className={cn('p-4 border-b flex flex-col gap-2', className)}>
			<div
				onClick={() => setIsOpen((current) => !current)}
				className="flex items-center justify-between cursor-pointer"
			>
				<p className="font-medium">{title}</p>
				<Icon className="size-4" />
			</div>
			{isOpen && children}
		</div>
	);
};

export const ProductFilters = () => {
	const [filters, setFilters] = useProductFilters();

	const hasHanyFilters = Object.entries(filters).some(([key, value]) => {
		if (key === 'sort') {
			return false;
		}

		if (Array.isArray(value)) {
			return value.length > 0;
		}

		if (typeof value === 'string') {
			return value !== '';
		}

		return value !== null;
	});

	const onChange = (key: keyof typeof filters, value: unknown) => {
		setFilters({ ...filters, [key]: value });
	};

	const onClear = () => {
		setFilters({
			minPrice: '',
			maxPrice: '',
			tags: [],
		});
	};

	return (
		<div className="border rounded-md bg-white">
			<div className="p-4 border-b flex items-center justify-between">
				<p className="font-medium">Filters</p>
				{hasHanyFilters && (
					<button
						onClick={onClear}
						type="button"
						className="underline cursor-pointer"
					>
						Clear
					</button>
				)}
			</div>
			<ProductFilter title="Price">
				<PriceFilter
					minPrice={filters.minPrice}
					maxPrice={filters.maxPrice}
					onMinPriceChangeAction={(value) => onChange('minPrice', value)}
					onMaxPriceChangeAction={(value) => onChange('maxPrice', value)}
				/>
			</ProductFilter>
			<ProductFilter title="Tags" className="border-b-0">
				<TagsFilter
					value={filters.tags}
					onTagsChangeAction={(value) => onChange('tags', value)}
				/>
			</ProductFilter>
		</div>
	);
};
