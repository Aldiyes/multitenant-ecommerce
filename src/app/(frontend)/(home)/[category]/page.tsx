type Props = {
	params: Promise<{
		category: string;
	}>;
};

export default async function CategoryPage({ params }: Props) {
	const { category } = await params;
	return <div>Category: {category}</div>;
}
