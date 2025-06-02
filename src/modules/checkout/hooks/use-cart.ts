import { useCartStore } from '../store/use-cart-store';

export const useCart = (tenantSlug: string) => {
	const {
		getCartByTenantAction,
		addProductAction,
		removeProductAction,
		clearCartAction,
		clearAllCartsAction,
	} = useCartStore();

	const productIds = getCartByTenantAction(tenantSlug);

	const toggleProduct = (productId: string) => {
		if (productIds.includes(productId)) {
			removeProductAction(tenantSlug, productId);
		} else {
			addProductAction(tenantSlug, productId);
		}
	};

	const isProductInCart = (productId: string) => {
		return productIds.includes(productId);
	};

	const clearTenantCart = () => {
		clearCartAction(tenantSlug);
	};

	return {
		productIds,
		addProductAction: (productId: string) =>
			addProductAction(tenantSlug, productId),
		removeProductAction: (productId: string) =>
			removeProductAction(tenantSlug, productId),
		clearCart: clearTenantCart,
		clearAllCartsAction,
		toggleProduct,
		isProductInCart,
		totalItems: productIds.length,
	};
};
