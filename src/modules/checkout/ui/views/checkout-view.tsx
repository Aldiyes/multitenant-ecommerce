"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { InboxIcon, Loader2Icon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { generateTenantURL } from "@/lib/utils";

import { useCart } from "@/modules/checkout/hooks/use-cart";
import { useCheckoutStates } from "@/modules/checkout/hooks/use-checkout-states";
import { CheckoutItem } from "@/modules/checkout/ui/components/checkout-item";
import { CheckoutSidebar } from "@/modules/checkout/ui/components/checkout-sidebar";

type Props = {
  tenantSlug: string;
};

export const CheckoutView = ({ tenantSlug }: Props) => {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);

  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    }),
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({
          success: false,
          cancle: false,
        });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          // TODO: modify when subdomains enabled
          router.push("/sign-in");
        }
        toast.error(error.message || "Something went wrong");
      },
    }),
  );

  useEffect(() => {
    if (states.success) {
      setStates({
        success: false,
        cancle: false,
      });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);

  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, Cart cleared");
    }
  }, [error, clearCart]);

  if (isLoading) {
    <div className="px-4 pt-4 lg:px-12 lg:pt-16">
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
        <Loader2Icon className="text-muted-foreground animate-spin" />
      </div>
    </div>;
  }

  if (!data || data.docs.length === 0) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                name={product.name}
                imageUrl={product.image?.url}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantName={product.tenant.name}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                isLast={index === data?.docs.length - 1}
                price={product.price}
                onRemoveAction={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice}
            onPurchaseAction={() => purchase.mutate({ tenantSlug, productIds })}
            isCancled={states.cancle}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
