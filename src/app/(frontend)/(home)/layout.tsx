import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { Footer } from '@/modules/home/ui/components/footer';
import { Navbar } from '@/modules/home/ui/components/navbar';
import {
	SearchFilters,
	SearchFiltersSkeleton,
} from '@/modules/home/ui/components/search-filters';

export default async function RootHomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ErrorBoundary fallback={<div>Something went wrong</div>}>
					<Suspense fallback={<SearchFiltersSkeleton />}>
						<SearchFilters />
					</Suspense>
				</ErrorBoundary>
			</HydrationBoundary>
			<div className="flex-1 bg-[#F4F4F0]">{children}</div>
			<Footer />
		</div>
	);
}
