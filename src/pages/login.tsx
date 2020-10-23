import React from "react";
import { Box, Button, Text, Heading } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { getErrors } from "../utils/getErrors";

interface LoginProps {}

const initialValues = { username: "", password: "" };

const Login: React.FC<LoginProps> = ({}) => {
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

export default Login;
