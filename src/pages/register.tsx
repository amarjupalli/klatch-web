import React from "react";
import { useMutation } from "urql";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { Box, Button, Text, Heading } from "@chakra-ui/core";

interface RegisterProps {}

const initialValues = { username: "", password: "" };
const mutation = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      user {
        username
      }
      errors {
        errorMessage
        field
      }
    }
  }
`;

const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useMutation(mutation);
  return (
    <Wrapper>
      <Heading as="h4" size="md">
        User Registration
      </Heading>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => register(values)}
      >
        {({ values, handleChange, isSubmitting }) => (
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
                <Text color="white">Register</Text>
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
