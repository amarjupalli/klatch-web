import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import { Wrapper } from "../../components/Wrapper";
import { Text, Button } from "@chakra-ui/core";
import { InputField } from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { getErrors } from "../../utils/getErrors";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenErr, setTokenErr] = useState("");

  return (
    <Wrapper>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async ({ newPassword }, { setErrors }) => {
          const response = await changePassword({ newPassword, token });
          if (response.data?.changePassword.errors) {
            const errors = getErrors(response.data.changePassword.errors);
            setErrors(errors);
            "token" in errors && setTokenErr(errors.token);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="new password"
              placeholder="new password"
              type="password"
            />
            {tokenErr && (
              <Text mt={2} color="tomato">
                {tokenErr}
              </Text>
            )}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
