import {
  ssrExchange,
  dedupExchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import { betterUpdateQuery } from "./betterUpdateQuery";

import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  VotingMutationVariables,
} from "../generated/graphql";
import { isSSR } from "./isSSR";

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache; // set partial flag when next pieces of date are not in cache

    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((field) => {
      const key = cache.resolveFieldByKey(entityKey, field.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      // urql can't figure this out so we need to manually specify the typename
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: "http://localhost:9000/graphql",
  fetchOptions: {
    credentials: "include" as const,
    headers: isSSR() ? { cookie: ctx.req.headers.cookie } : undefined,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          voting: (_result, args, cache, _info) => {
            const { postId, value } = args as VotingMutationVariables;
            const fragment = gql`
              fragment _ on Post {
                id
                points
                voteStatus
              }
            `;
            const data = cache.readFragment(fragment, { id: postId } as any);
            if (data) {
              if (data.voteStatus === args.value) {
                return;
              }
              const newPoints =
                (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
              cache.writeFragment(fragment, {
                id: postId,
                points: newPoints,
                voteStatus: value,
              } as any);
            }
          },
          createPost: (_result, _args, cache, _info) => {
            const allFields = cache.inspectFields("Query");
            const fieldInfos = allFields.filter(
              ({ fieldName }) => fieldName === "posts"
            );
            fieldInfos.forEach((field) => {
              cache.invalidate("Query", "posts", field.arguments || {});
            });
          },
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
