import React from "react";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Box, Flex, Heading, Link, Spinner, Text } from "@chakra-ui/core";

export const Post: React.FC<{}> = () => {
  const router = useRouter();
  const postId: number =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, error, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: { id: postId },
  });

  if (error || (!data?.post && !fetching)) {
    return (
      <Layout>
        <Box bg="red.400" w="100%" p={6} color="white">
          <Heading size="lg">
            Uh, oh! this post does't not exist. Go back to{" "}
            <NextLink href="/">
              <Link color="red.600" style={{ backgroundColor: "white" }}>
                klatch home
              </Link>
            </NextLink>
          </Heading>
        </Box>
      </Layout>
    );
  }

  if (!error && fetching) {
    return <Spinner />;
  }

  const {
    title,
    text,
    creator: { username },
  } = data!.post!;

  return (
    <Layout>
      <Box p={5} borderWidth="1px">
        <Flex alignItems="center">
          <Heading size="xl">{title}</Heading>
          <Text fontSize="sm" ml={2} color="blue.600">
            {username}
          </Text>
        </Flex>
        <Text mt={2}>{text}</Text>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
