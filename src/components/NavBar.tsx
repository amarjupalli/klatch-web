import React from "react";
import { Box, Link, Flex, Button, Divider, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isSSR } from "../utils/isSSR";
interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isSSR(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <Flex>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="red.600">register</Link>
        </NextLink>
      </Flex>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Text color="red.600" mr={2}>
          {data.me.username}
        </Text>
        <Divider borderColor="red.600" orientation="vertical" />
        <Button
          isLoading={logoutFetching}
          onClick={() => logout()}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="whitesmoke" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
