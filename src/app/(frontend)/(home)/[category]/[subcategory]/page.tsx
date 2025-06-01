import type { SearchParams } from 'nuqs/server';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { DEFAULT_LIMIT } from '@/constants';

import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';

type Props = {
	params: Promise<{
		subcategory: string;
	}>;
	searchParams: Promise<SearchParams>;
};

export default async function SubcategoryPage({ params, searchParams }: Props) {
	const { subcategory } = await params;
	const filters = await loadProductFilters(searchParams);

	const queryClient = getQueryClient();

	void queryClient.prefetchInfiniteQuery(
		trpc.products.getMany.infiniteQueryOptions({
			...filters,
			category: subcategory,
			limit: DEFAULT_LIMIT,
		})
	);
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductListView category={subcategory} />
		</HydrationBoundary>
	);
}
