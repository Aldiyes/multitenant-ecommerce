import Image from "next/image";
import Link from "next/link";

import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  name: string;
  imageUrl?: string | null;
  productUrl: string;
  tenantName: string;
  tenantUrl: string;
  isLast?: boolean;
  price: number;
  onRemoveAction: () => void;
};

export const CheckoutItem = ({
  name,
  imageUrl,
  productUrl,
  tenantName,
  tenantUrl,
  isLast,
  price,
  onRemoveAction,
}: Props) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b pr-4",
        isLast && "border-b-0",
      )}
    >
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between py-4">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>
          <Link href={tenantUrl}>
            <p className="font-medium underline">{tenantName}</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-between py-4">
        <p className="font-medium">{formatCurrency(price)}</p>
        <button
          type="button"
          onClick={onRemoveAction}
          className="cursor-pointer font-medium underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
