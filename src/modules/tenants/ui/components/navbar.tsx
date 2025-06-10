"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { Loader2Icon, ShoppingCartIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { generateTenantURL } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton,
    ),
  {
    ssr: false,
  },
);

type Props = {
  slug: string;
};

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              alt={data.name}
              width={32}
              height={32}
              className="size-[32px] shrink-0 rounded-full border"
            />
          )}
          <p className="text-xl">{data.name}</p>
        </Link>
        <CheckoutButton tenantSlug={slug} />
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-12" />
      </div>
    </nav>
  );
};
