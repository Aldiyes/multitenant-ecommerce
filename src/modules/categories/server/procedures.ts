import { Category } from '@/payload-types';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const categoriesRouter = createTRPCRouter({
	getMany: baseProcedure.query(async ({ ctx }) => {
		const data = await ctx.payload.find({
			collection: 'categories',
			pagination: false,
			depth: 1, // populate subcategories, subcategories.[0] will be a type of "Category"
			where: {
				parent: {
					exists: false,
				},
			},
			sort: 'name',
		});

		const formatedData = data.docs.map((doc) => ({
			...doc,
			subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
				// because of "depth: 1" we are confident doc will be a type of "Category"
				...(doc as Category),
			})),
		}));
		return formatedData;
	}),
});
