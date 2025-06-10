"use client";

import { useEffect } from "react";

import { Loader2Icon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function StripeVerifyPage() {
  const trpc = useTRPC();

  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: () => {
        window.location.href = "/";
      },
    }),
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2Icon className="text-muted-foreground animate-spin" />
    </div>
  );
}
