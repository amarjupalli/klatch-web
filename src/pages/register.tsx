import React from "react";
import { Box, Button, Text, Heading } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { getErrors } from "../utils/getErrors";

interface RegisterProps {}

const initialValues = { username: "", password: "" };

const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useRegisterMutation();
  return (
    <Wrapper>
      <Heading as="h4" size="md">
        User Registration
      </Heading>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            const errors = getErrors(response.data.register.errors);
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
