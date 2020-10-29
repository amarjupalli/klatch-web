import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";

interface VariablesTypes {
  limit: number;
  cursor: null | string;
}

const Index = () => {
  const [variables, setVariables] = useState<VariablesTypes>({
    limit: 10,
    cursor: null,
  });
  const [{ fetching, data }] = usePostsQuery({ variables });

  const onShowMoreClick = (lastPostCreatedAt: string) => {
    const cursor = new Date(parseInt(lastPostCreatedAt)).toUTCString();
    return setVariables({ limit: variables.limit, cursor });
  };

  return (
    <Layout>
      <Flex>
        <Heading fontSize="xl" color="red.600">
          posts
        </Heading>
        <NextLink href="/create-post">
          <Link ml="auto" color="orange.600">
            <Icon name="edit" size="24px" /> create a new post
          </Link>
        </NextLink>
      </Flex>
      {data ? (
        <>
          <Stack spacing={8} mt={4}>
            {data.posts.posts.map(({ id, title, textSnippet }) => (
              <Box
                key={id}
                p={5}
                borderWidth="1px"
                borderColor="orange.200"
                shadow="md"
              >
                <NextLink href={`/post/${id}`}>
                  <Heading as={Link} fontSize="xl">
                    {title}
                  </Heading>
                </NextLink>
                <Text mt={4}>{`${textSnippet}...`}</Text>
              </Box>
            ))}
          </Stack>
          <Flex mt={2}>
            <Button
              isDisabled={!data.posts.hasMore}
              isLoading={fetching}
              mt={2}
              variant="ghost"
              variantColor="orange"
              m="auto"
              onClick={() =>
                onShowMoreClick(
                  data.posts.posts[data.posts.posts.length - 1].createdAt
                )
              }
            >
              Show more
            </Button>
          </Flex>
        </>
      ) : (
        <div>
          {fetching && "loading...please wait"}
          {!fetching && "No posts to show."}
        </div>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
