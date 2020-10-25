import React from "react";
import { withUrqlClient } from "next-urql";
import { Box, Button, Text, Heading } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { getErrors } from "../utils/getErrors";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";

interface LoginProps {}

const initialValues = { username: "", password: "" };

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper>
      <Heading as="h4" size="md">
        Log in
      </Heading>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          if (response.data?.login.errors) {
            const errors = getErrors(response.data.login.errors);
            setErrors(errors);
          } else if (response.data?.login.user) {
            return router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                label="username"
                name="username"
                placeholder="username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                label="password"
                name="password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Box mt={4}>
              <Button
                type="submit"
                variantColor="orange"
                isLoading={isSubmitting}
              >
                <Text color="white">Log in</Text>
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
