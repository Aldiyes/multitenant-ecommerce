import { StarIcon } from 'lucide-react';

import { MAX_RATING, MIN_RATING } from '@/constants';
import { cn } from '@/lib/utils';

type StarRatingProps = {
	rating: number;
	className?: string;
	iconClassName?: string;
	text?: string;
};

export const StarRating = ({
	rating,
	className,
	iconClassName,
	text,
}: StarRatingProps) => {
	const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

	return (
		<div className={cn('flex items-center gap-x-1', className)}>
			{Array.from({ length: MAX_RATING }).map((_, index) => (
				<StarIcon
					key={index}
					className={cn(
						'size-4',
						index < safeRating ? 'fill-black' : '',
						iconClassName
					)}
				/>
			))}
			{text && <p>{text}</p>}
		</div>
	);
};
