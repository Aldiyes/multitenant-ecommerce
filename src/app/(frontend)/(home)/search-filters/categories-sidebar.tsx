'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

import { CategoriesGetManyOutput } from '@/modules/categories/types';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

type Props = {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
};

export const CategoriesSidebar = ({ open, onOpenChangeAction }: Props) => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

	const router = useRouter();
	const [parentCategories, setParentCategories] =
		useState<CategoriesGetManyOutput | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<
		CategoriesGetManyOutput[1] | null
	>(null);

	// if we have parent categories, show those, otherwise show root categories
	const currentCategories = parentCategories ?? data ?? [];

	const handleOpenChange = (open: boolean) => {
		setSelectedCategory(null);
		setParentCategories(null);
		onOpenChangeAction(open);
	};

	const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
		if (category.subcategories && category.subcategories.length > 0) {
			setParentCategories(category.subcategories as CategoriesGetManyOutput);
			setSelectedCategory(category);
		} else {
			// this is a leaf category (no subcategories)
			if (parentCategories && selectedCategory) {
				// this is a subcategory - navigate to /category/subcategory
				router.push(`/${selectedCategory.slug}/${category.slug}`);
			} else {
				// this is a main category - navigate to /category
				if (category.slug === 'all') {
					router.push('/');
				} else {
					router.push(`/${category.slug}`);
				}
			}

			handleOpenChange(false);
		}
	};

	const handleBackButtonClick = () => {
		if (parentCategories) {
			setParentCategories(null);
			setSelectedCategory(null);
		}
	};

	const backgroundColor = selectedCategory?.color || 'white';

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				side="left"
				className="p-0 transition-none"
				style={{ backgroundColor }}
			>
				<SheetHeader className="p-4 border-b">
					<SheetTitle>Categories</SheetTitle>
				</SheetHeader>
				<ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
					{parentCategories && (
						<button
							onClick={handleBackButtonClick}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
						>
							<ChevronLeftIcon className="sise-4 mr-2" />
							Back
						</button>
					)}
					{currentCategories.map((category) => (
						<button
							key={category.slug}
							onClick={() => handleCategoryClick(category)}
							className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium cursor-pointer"
						>
							{category.name}
							{category.subcategories && category.subcategories.length > 0 && (
								<ChevronRightIcon className="sise-4" />
							)}
						</button>
					))}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};
