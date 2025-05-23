import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

type Props = {
	activeCategory?: string | null;
	activeCategoryName?: string | null;
	activeSubcategoryName?: string | null;
};

export const BreadcrumbNavigation = ({
	activeCategory,
	activeCategoryName,
	activeSubcategoryName,
}: Props) => {
	if (!activeCategoryName || activeCategory === 'all') return null;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{activeSubcategoryName ? (
					<>
						<BreadcrumbItem>
							<BreadcrumbLink
								className="text-lg font-medium underline text-primary"
								asChild
							>
								<Link href={`/${activeCategory}`}>{activeCategoryName}</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-primary font-medium text-lg">
							/
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage className="text-lg font-medium">
								{activeSubcategoryName}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				) : (
					<BreadcrumbItem>
						<BreadcrumbPage className="text-lg font-medium">
							{activeCategoryName}
						</BreadcrumbPage>
					</BreadcrumbItem>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
