import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { useCart } from '@/modules/checkout/hooks/use-cart';

type Props = {
	tenantSlug: string;
	productId: string;
};

export const CartButton = ({ tenantSlug, productId }: Props) => {
	const cart = useCart(tenantSlug);
	return (
		<Button
			variant="elevated"
			onClick={() => cart.toggleProduct(productId)}
			className={cn(
				'flex-1 bg-pink-400',
				cart.isProductInCart(productId) && 'bg-white'
			)}
		>
			{cart.isProductInCart(productId) ? 'Remove from cart' : 'Add to cart'}
		</Button>
	);
};
