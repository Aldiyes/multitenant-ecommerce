import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import {
	ProductList,
	ProductListSkeleton,
} from '@/modules/products/ui/components/product-list';

type Props = {
	params: Promise<{
		subcategory: string;
	}>;
};

export default async function SubcategoryPage({ params }: Props) {
	const { subcategory } = await params;

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.products.getMany.queryOptions({ category: subcategory })
	);
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<Suspense fallback={<ProductListSkeleton />}>
					<ProductList category={subcategory} />
				</Suspense>
			</ErrorBoundary>
		</HydrationBoundary>
	);
}
