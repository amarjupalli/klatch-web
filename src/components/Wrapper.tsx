import React from "react";
import { Box } from "@chakra-ui/core";

type WrapperProps = {};

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box mt="4" mx="auto" w="400px">
      {children}
    </Box>
  );
};
