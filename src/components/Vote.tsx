import React from "react";
import { Flex, IconButton, Text } from "@chakra-ui/core";
import { PostSnippetFragment, useVotingMutation } from "../generated/graphql";

type VoteProps = Pick<PostSnippetFragment, "id" | "points" | "voteStatus">;

export const Vote: React.FC<VoteProps> = ({
  id: postId,
  points,
  voteStatus,
}: VoteProps): JSX.Element => {
  const [, voting] = useVotingMutation();
  const vote = async (value: number) => await voting({ postId, value });
  return (
    <Flex mr={4} direction="column" alignItems="center" justifyContent="center">
      <IconButton
        aria-label="up vote"
        icon="chevron-up"
        size="xs"
        variant="outline"
        variantColor={voteStatus === 1 ? "green" : undefined}
        onClick={() => {
          if (voteStatus === 1) {
            return;
          }
          return vote(1);
        }}
      />
      <Text
        fontWeight={"extrabold"}
        color={points >= 0 ? "green.600" : "red.600"}
        mt={1}
        mb={1}
      >
        {points}
      </Text>
      <IconButton
        aria-label="down vote"
        icon="chevron-down"
        size="xs"
        variant="outline"
        variantColor={voteStatus === -1 ? "red" : undefined}
        onClick={() => {
          if (voteStatus === -1) {
            return;
          }
          return vote(-1);
        }}
      />
    </Flex>
  );
};

export default React.memo(Vote);
