import React from "react";
import NextLink from "next/link";
import { Flex, Box, Heading, Link, Text } from "@chakra-ui/core";
import { Post as PostProps, User as UserProps } from "../generated/graphql";
import Vote from "./Vote";

type PostItemProps = Pick<
  PostProps,
  "id" | "title" | "textSnippet" | "points" | "voteStatus"
> & { creator: Pick<UserProps, "id" | "username"> };

export const PostItem: React.FC<PostItemProps> = ({
  id,
  title,
  textSnippet,
  creator,
  points,
  voteStatus,
}: PostItemProps): JSX.Element => {
  return (
    <Flex
      key={id}
      p={5}
      mt={2}
      mb={4}
      borderWidth="1px"
      borderColor="orange.200"
      shadow="md"
    >
      <Vote id={id} points={points} voteStatus={voteStatus} />
      <Box>
        <NextLink href="post/[id]" as={`/post/${id}`}>
          <Heading as={Link} fontSize="xl">
            {title}
          </Heading>
        </NextLink>
        <Text color="gray.600" fontSize="sm">
          posted by {creator.username}
        </Text>
        <Text mt={4}>{`${textSnippet}...`}</Text>
      </Box>
    </Flex>
  );
};

export default PostItem;
