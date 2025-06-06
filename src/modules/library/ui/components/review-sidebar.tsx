import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ReviewForm } from "@/modules/library/ui/components/review-form";

type Props = {
  productId: string;
};

export const ReviewSidebar = ({ productId }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    }),
  );
  return <ReviewForm productId={productId} initialData={data} />;
};
