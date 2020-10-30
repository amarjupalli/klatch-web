import React from "react";
import { Flex, IconButton, Text } from "@chakra-ui/core";
import { PostSnippetFragment, useVotingMutation } from "../generated/graphql";

type VoteProps = Pick<PostSnippetFragment, "id" | "points">;

export const Vote: React.FC<VoteProps> = ({
  id: postId,
  points,
}: VoteProps): JSX.Element => {
  const [, voting] = useVotingMutation();
  const vote = async (value: number) => await voting({ postId, value });

  return (
    <Flex mr={4} direction="column" alignItems="center" justifyContent="center">
      <IconButton
        aria-label="up vote"
        icon="chevron-up"
        size="xs"
        variant="ghost"
        onClick={() => vote(1)}
      />
      <Text color={points >= 0 ? "green.600" : "red.600"} mt={1} mb={1}>
        {points}
      </Text>
      <IconButton
        aria-label="down vote"
        icon="chevron-down"
        size="xs"
        variant="ghost"
        onClick={() => vote(-1)}
      />
    </Flex>
  );
};

export default React.memo(Vote);
