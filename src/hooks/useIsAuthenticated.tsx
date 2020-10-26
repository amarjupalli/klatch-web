import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

export const useIsAuthenticated = (): boolean => {
  const router = useRouter();
  const [{ fetching, data }] = useMeQuery();
  const userLoggedOut = useMemo(() => !fetching && !data?.me, [fetching, data]);

  useEffect(() => {
    if (userLoggedOut) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [userLoggedOut]);

  return userLoggedOut;
};
