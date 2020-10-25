import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import { Box, Button, Text } from "@chakra-ui/core";
import { InputField } from "../components/InputField";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgetPasswordMutation } from "../generated/graphql";

export const ForgotPassword: React.FC<{}> = () => {
  const [complete, setcomplete] = useState(false);
  const [, forgetpassword] = useForgetPasswordMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgetpassword(values);
          setcomplete(true);
        }}
      >
        {({ isSubmitting }) => {
          return complete ? (
            <Box>
              <Text>
                If an account for the email exists, you'll receive an email with
                a link to change password.
              </Text>
            </Box>
          ) : (
            <Form>
              <Box mt={4}>
                <InputField
                  label="email"
                  name="email"
                  placeholder="email"
                  type="email"
                />
              </Box>
              <Box mt={4}>
                <Button
                  type="submit"
                  variantColor="orange"
                  isLoading={isSubmitting}
                >
                  Send email
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
