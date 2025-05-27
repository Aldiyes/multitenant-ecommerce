'use client';

import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useProductFilters } from '@/modules/products/hooks/use-product-filters';
import { PriceFilter } from '@/modules/products/ui/components/price-filter';

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

	const onChange = (key: keyof typeof filters, value: unknown) => {
		setFilters({ ...filters, [key]: value });
	};

	return (
		<div className="border rounded-md bg-white">
			<div className="p-4 border-b flex items-center justify-between">
				<p className="font-medium">Filters</p>
				<button onClick={() => {}} type="button" className="underline">
					Clear
				</button>
			</div>
			<ProductFilter title="Price" className="border-b-0">
				<PriceFilter
					minPrice={filters.minPrice}
					maxPrice={filters.maxPrice}
					onMinPriceChangeAction={(value) => onChange('minPrice', value)}
					onMaxPriceChangeAction={(value) => onChange('maxPrice', value)}
				/>
			</ProductFilter>
		</div>
	);
};
