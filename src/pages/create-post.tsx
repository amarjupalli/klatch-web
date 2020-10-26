import React, { useEffect, useMemo } from "react";
import { Box, Button, Text } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { getErrors } from "../utils/getErrors";
import { useIsAuthenticated } from "../hooks/useIsAuthenticated";

const initialValues = {
  title: "",
  text: "",
};

export const CreatePost: React.FC<{}> = () => {
  const router = useRouter();
  const userLoggedOut = useIsAuthenticated();
  const [, createPost] = useCreatePostMutation();
  return userLoggedOut ? (
    <Text color="gray.600" ml={4} mt={4}>
      Taking you to log in...please wait.
    </Text>
  ) : (
    <Layout variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          try {
            await createPost({ input: values });
            return router.push("/");
          } catch (error) {
            const errors = getErrors(error);
            return setErrors(errors);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField name="title" placeholder="title" label="title" />
            </Box>
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="text"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="orange"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
