import { parseAsBoolean, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
    cancle: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });
};
