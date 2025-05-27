'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

type Props = {
	category?: string;
};

export const ProductList = ({ category }: Props) => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.products.getMany.queryOptions({ category })
	);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
			{data?.docs.map((product) => (
				<div key={product.id} className="border rounded-md bg-white">
					<h2 className="text-lg font-medium">{product.name}</h2>
					<p>${product.price}</p>
				</div>
			))}
		</div>
	);
};

export const ProductListSkeleton = () => {
	return <div>Loading...</div>;
};
