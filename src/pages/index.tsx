import React from "react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { Divider, Icon, Link } from "@chakra-ui/core";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link color="orange.600">
          <Icon name="edit" size="24px" /> create a post
        </Link>
      </NextLink>
      <Divider borderColor="black.200" width="50%" />
      {data ? (
        data.posts.map((d) => <div key={d.id}>{d.title}</div>)
      ) : (
        <div>"loading..."</div>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
