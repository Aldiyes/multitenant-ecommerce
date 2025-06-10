import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Loader2Icon } from "lucide-react";

import { DEFAULT_LIMIT } from "@/constants";

import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  value?: string[] | null;
  onTagsChangeAction: (value: string[]) => void;
};

export const TagsFilter = ({ value, onTagsChangeAction }: Props) => {
  const trpc = useTRPC();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onTagsChangeAction(value?.filter((t) => t !== tag) || []);
    } else {
      onTagsChangeAction([...(value || []), tag]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              onClick={() => onClick(tag.name)}
              className="flex cursor-pointer items-center justify-between"
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          )),
        )
      )}
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="cursor-pointer justify-start text-start font-medium underline disabled:opacity-0"
        >
          Load more...
        </button>
      )}
    </div>
  );
};
