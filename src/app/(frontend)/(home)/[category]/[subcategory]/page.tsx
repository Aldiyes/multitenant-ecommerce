type Props = {
	params: Promise<{
		category: string;
		subcategory: string;
	}>;
};

export default async function CategoryPage({ params }: Props) {
	const { category, subcategory } = await params;
	return (
		<div>
			Category: {category}
			<br />
			Subcategory: {subcategory}
		</div>
	);
}
